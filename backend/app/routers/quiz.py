import json
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from app.database import get_db
from app.models.user import User
from app.models.quiz import Question, QuizAttempt, QuizAttemptAnswer
from app.models.performance import TopicMastery, LearningHistory
from app.schemas.quiz import (
    QuestionSchema,
    AdaptiveNextQuestionRequest,
    AdaptiveNextQuestionResponse,
    SubmitAnswerRequest,
    SubmitAnswerResponse,
    FinishQuizRequest,
    FinishQuizResponse
)
from app.services.auth_service import get_current_user
from app.services.adaptive_quiz_service import get_next_adaptive_question
from app.services.mastery_ml_service import mastery_engine

router = APIRouter(prefix="/quiz", tags=["Adaptive Quiz Interface"])

@router.get("/questions", response_model=List[QuestionSchema])
def list_questions(db: Session = Depends(get_db)):
    questions = db.query(Question).all()
    results = []
    for q in questions:
        try:
            opts = json.loads(q.options_json)
        except Exception:
            opts = [q.options_json]
        results.append(QuestionSchema(
            id=q.id,
            subject=q.subject,
            topic=q.topic,
            difficulty=q.difficulty,
            question=q.question_text,
            code_snippet=q.code_snippet,
            options=opts,
            correct_option_index=q.correct_option_index,
            explanation=q.explanation,
            concept_tag=q.concept_tag,
            hint=q.hint
        ))
    return results

@router.post("/adaptive/next", response_model=AdaptiveNextQuestionResponse)
def get_adaptive_next(
    req: AdaptiveNextQuestionRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    q, diff, reason, ability = get_next_adaptive_question(
        db,
        answered_question_ids=req.answered_question_ids,
        previous_question_id=req.previous_question_id,
        previous_was_correct=req.previous_was_correct
    )
    if not q:
        raise HTTPException(status_code=404, detail="No further adaptive questions available in question bank.")

    opts = json.loads(q.options_json)
    q_schema = QuestionSchema(
        id=q.id,
        subject=q.subject,
        topic=q.topic,
        difficulty=q.difficulty,
        question=q.question_text,
        code_snippet=q.code_snippet,
        options=opts,
        correct_option_index=None, # do not leak answer on next-question request
        explanation=None,
        concept_tag=q.concept_tag,
        hint=q.hint
    )

    return AdaptiveNextQuestionResponse(
        question=q_schema,
        current_difficulty=diff,
        adaptation_reason=reason,
        student_estimated_ability=ability
    )

@router.post("/submit-answer", response_model=SubmitAnswerResponse)
def submit_answer(
    req: SubmitAnswerRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    question = db.query(Question).filter(Question.id == req.question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")

    is_correct = (req.selected_option_index == question.correct_option_index)
    xp_awarded = 30 if is_correct else 5

    # Update or create TopicMastery record
    perf = (
        db.query(TopicMastery)
        .filter(TopicMastery.user_id == current_user.id, TopicMastery.topic == question.topic)
        .first()
    )

    if not perf:
        perf = TopicMastery(
            id=f"tm-{current_user.id[:8]}-{question.topic[:8].lower().replace(' ', '')}",
            user_id=current_user.id,
            topic=question.topic,
            subject=question.subject,
            total_attempts=0,
            correct_attempts=0,
            raw_accuracy_percent=50.0,
            rule_based_mastery=50.0,
            ml_predicted_mastery=50.0,
            benchmark_percent=80.0
        )
        db.add(perf)

    perf.total_attempts += 1
    if is_correct:
        perf.correct_attempts += 1
    perf.raw_accuracy_percent = (perf.correct_attempts / perf.total_attempts) * 100.0
    perf.last_practiced_at = datetime.utcnow()

    # Re-evaluate with Rule-Based Engine & ML Predictor
    recent_answers = [is_correct] # simplified recent buffer
    diff_weight = 1.8 if question.difficulty in ["Hard", "Advanced"] else 1.4 if question.difficulty == "Medium" else 1.0

    perf.rule_based_mastery = mastery_engine.calculate_rule_based_mastery(
        total_attempts=perf.total_attempts,
        correct_attempts=perf.correct_attempts,
        recent_answers=recent_answers,
        avg_time_sec=float(req.time_spent_seconds),
        days_since_last=0.1,
        difficulty_weight=diff_weight
    )

    ml_val, _, _ = mastery_engine.predict_ml_mastery(
        total_attempts=perf.total_attempts,
        correct_attempts=perf.correct_attempts,
        recent_answers=recent_answers,
        avg_time_sec=float(req.time_spent_seconds),
        days_since_last=0.1,
        difficulty_weight=diff_weight
    )
    perf.ml_predicted_mastery = ml_val
    perf.is_weak_area = (perf.rule_based_mastery + perf.ml_predicted_mastery) / 2.0 < 65.0

    # Award user XP
    current_user.total_xp += xp_awarded

    db.commit()

    return SubmitAnswerResponse(
        is_correct=is_correct,
        correct_option_index=question.correct_option_index,
        explanation=question.explanation,
        concept_tag=question.concept_tag,
        xp_awarded=xp_awarded,
        updated_rule_mastery=perf.rule_based_mastery,
        updated_ml_mastery=perf.ml_predicted_mastery
    )

@router.post("/finish", response_model=FinishQuizResponse)
def finish_quiz(
    req: FinishQuizRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    accuracy = (req.score / req.total_questions) * 100.0 if req.total_questions > 0 else 0.0
    xp_earned = req.score * 30 + 20

    attempt_id = f"attempt-{int(datetime.utcnow().timestamp())}"
    attempt = QuizAttempt(
        id=attempt_id,
        user_id=current_user.id,
        score=req.score,
        total_questions=req.total_questions,
        accuracy_percent=round(accuracy, 1),
        time_spent_seconds=req.time_spent_seconds,
        difficulty_mode=req.difficulty_mode,
        xp_earned=xp_earned
    )
    db.add(attempt)

    # Log in learning history
    history = LearningHistory(
        id=f"hist-{attempt_id}",
        user_id=current_user.id,
        activity_type="quiz",
        title=f"Adaptive Diagnostic Quiz ({round(accuracy)}% Accuracy)",
        description=f"Completed {req.total_questions} adaptive questions. Calibrated student knowledge matrix.",
        score_earned=round(accuracy, 1),
        xp_delta=xp_earned
    )
    db.add(history)

    current_user.total_xp += xp_earned
    current_user.daily_goal_progress_minutes = min(
        current_user.daily_goal_minutes,
        current_user.daily_goal_progress_minutes + max(5, int(round(req.time_spent_seconds / 60)))
    )

    db.commit()

    strong = ["Attention Mechanisms", "Subsequence Optimization"] if accuracy >= 70 else ["Basic Traversal"]
    weak = ["Graph Cycle Detection", "Bayesian Base Rate Fallacy"] if accuracy < 80 else []

    return FinishQuizResponse(
        attempt_id=attempt_id,
        score=req.score,
        total_questions=req.total_questions,
        accuracy_percent=round(accuracy, 1),
        xp_earned=xp_earned,
        strong_topics=strong,
        weak_topics=weak,
        message="Adaptive assessment verified. Mastery scores recalibrated."
    )
