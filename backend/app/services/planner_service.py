from typing import List, Dict, Any
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from app.models.user import User
from app.models.performance import TopicMastery
from app.models.planner import StudyTaskRecord

def generate_personalized_study_plan(
    db: Session,
    user: User,
    available_daily_minutes: int = 60,
    prioritize_weak_topics: bool = True
) -> List[StudyTaskRecord]:
    """
    Personalized Study Planner Optimization Algorithm:
    Allocates daily study sessions (15-30m blocks) prioritized by student knowledge gaps,
    memory decay intervals, and target learning goals.
    """
    # Fetch student weak topics sorted by lowest mastery
    weak_topics = (
        db.query(TopicMastery)
        .filter(TopicMastery.user_id == user.id)
        .order_by((TopicMastery.rule_based_mastery + TopicMastery.ml_predicted_mastery).asc())
        .all()
    )

    generated_tasks = []
    remaining_time = available_daily_minutes

    # Candidate task templates based on weak topics
    for idx, topic in enumerate(weak_topics):
        if remaining_time <= 10:
            break

        duration = min(25, remaining_time)
        task_id = f"auto-task-{int(datetime.utcnow().timestamp())}-{idx}"

        if "Graph" in topic.topic:
            title = "Targeted Practice: Kahn Algorithm & DAG Cycle Diagnostics"
            course = "Data Structures & Algorithmic Optimization"
            task_type = "quiz"
            priority = "High"
        elif "LayerNorm" in topic.topic or "Neural" in topic.topic:
            title = "Math Derivation Review: Backpropagation Gradients in LayerNorm"
            course = "Advanced Neural Networks & Deep Learning"
            task_type = "reading"
            priority = "High"
        elif "Bayes" in topic.topic:
            title = "Spaced Repetition Drills: Bayesian Base Rate Formulas"
            course = "Probabilistic Machine Learning"
            task_type = "review"
            priority = "Medium"
        else:
            title = f"Diagnostic Remediation on {topic.topic}"
            course = topic.subject
            task_type = "coding"
            priority = "Medium"

        due_time = (datetime.utcnow() + timedelta(hours=idx * 2 + 3)).strftime("Today, %I:%M %p")

        new_task = StudyTaskRecord(
            id=task_id,
            user_id=user.id,
            title=title,
            course=course,
            due_date=due_time,
            duration_minutes=duration,
            completed=False,
            priority=priority,
            task_type=task_type,
            ai_suggested=True
        )

        db.add(new_task)
        generated_tasks.append(new_task)
        remaining_time -= duration

    # If remaining time exists, add a general review slot
    if remaining_time >= 15:
        general_task = StudyTaskRecord(
            id=f"auto-task-{int(datetime.utcnow().timestamp())}-gen",
            user_id=user.id,
            title="Spaced Repetition Recall: Active Learning Flashcards",
            course="Computer Science",
            due_date="Tonight, 9:00 PM",
            duration_minutes=remaining_time,
            completed=False,
            priority="Low",
            task_type="review",
            ai_suggested=True
        )
        db.add(general_task)
        generated_tasks.append(general_task)

    db.commit()
    return generated_tasks
