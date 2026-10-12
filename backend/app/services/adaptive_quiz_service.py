from typing import List, Optional, Tuple, Dict, Any
from sqlalchemy.orm import Session
from app.models.quiz import Question

DIFFICULTY_LEVELS = ["Easy", "Medium", "Hard", "Advanced"]

def get_next_adaptive_question(
    db: Session,
    answered_question_ids: List[str],
    previous_question_id: Optional[str] = None,
    previous_was_correct: Optional[bool] = None,
    current_ability: float = 0.0
) -> Tuple[Optional[Question], str, str, float]:
    """
    Adaptive Question Selection Engine (Item Response Theory heuristic):
    Adapts next question difficulty in real-time based on student response trajectory.
    Returns: (Question, target_difficulty, adaptation_reason, updated_ability)
    """
    updated_ability = current_ability

    if previous_was_correct is True:
        updated_ability += 0.5
        reason = "Performance was correct on the previous challenge. Stepping up problem complexity to test deeper concept application."
    elif previous_was_correct is False:
        updated_ability -= 0.5
        reason = "Calibrating question difficulty to scaffold fundamental invariants and prevent cognitive overload."
    else:
        reason = "Initial diagnostic difficulty calibrated to student baseline profile."

    # Determine target difficulty based on updated ability estimate
    if updated_ability >= 1.0:
        target_difficulty = "Hard"
    elif updated_ability >= 0.0:
        target_difficulty = "Medium"
    else:
        target_difficulty = "Easy"

    # Query candidate questions not yet answered
    query = db.query(Question).filter(~Question.id.in_(answered_question_ids))
    
    # Try to find question matching target difficulty
    candidate = query.filter(Question.difficulty == target_difficulty).first()
    
    # If none found for exact difficulty, try any remaining question
    if not candidate:
        candidate = query.first()

    return candidate, target_difficulty, reason, round(updated_ability, 2)
