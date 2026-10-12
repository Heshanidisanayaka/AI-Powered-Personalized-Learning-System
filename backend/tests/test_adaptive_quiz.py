import pytest
from app.database import SessionLocal
from app.seed_data import seed_database
from app.services.adaptive_quiz_service import get_next_adaptive_question

@pytest.fixture(scope="module", autouse=True)
def setup_db():
    seed_database()

def test_adaptive_stepping_on_correct_answer():
    db = SessionLocal()
    try:
        # Given a correct previous answer and baseline ability, should step up
        q, diff, reason, new_ability = get_next_adaptive_question(
            db=db,
            answered_question_ids=[],
            previous_question_id="q1",
            previous_was_correct=True,
            current_ability=0.0
        )
        assert q is not None
        assert new_ability > 0.0
        assert "correct" in reason.lower()
    finally:
        db.close()

def test_adaptive_stepping_on_incorrect_answer():
    db = SessionLocal()
    try:
        # Given an incorrect answer, should step down to scaffold
        q, diff, reason, new_ability = get_next_adaptive_question(
            db=db,
            answered_question_ids=[],
            previous_question_id="q2",
            previous_was_correct=False,
            current_ability=0.0
        )
        assert q is not None
        assert new_ability < 0.0
        assert "calibrating" in reason.lower() or "scaffold" in reason.lower()
    finally:
        db.close()
