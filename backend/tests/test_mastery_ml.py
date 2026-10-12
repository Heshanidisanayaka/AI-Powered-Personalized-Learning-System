import pytest
import numpy as np
from app.services.mastery_ml_service import mastery_engine

def test_rule_based_mastery_calculation():
    # Student with 80% accuracy, recent correct, zero time penalty, fresh recency
    score = mastery_engine.calculate_rule_based_mastery(
        total_attempts=10,
        correct_attempts=8,
        recent_answers=[True, True, True],
        avg_time_sec=20.0,
        days_since_last=0.0,
        difficulty_weight=1.5
    )
    assert 70.0 <= score <= 99.0

def test_rule_based_forgetting_decay():
    # Student with decayed memory (14 days without review)
    fresh_score = mastery_engine.calculate_rule_based_mastery(
        total_attempts=10,
        correct_attempts=8,
        recent_answers=[True, True, True],
        days_since_last=0.0
    )
    decayed_score = mastery_engine.calculate_rule_based_mastery(
        total_attempts=10,
        correct_attempts=8,
        recent_answers=[True, True, True],
        days_since_last=14.0
    )
    assert decayed_score < fresh_score

def test_ml_mastery_prediction_distinction():
    # Verify scikit-learn model returns a valid float prediction and confidence
    ml_pred, conf, driver = mastery_engine.predict_ml_mastery(
        total_attempts=12,
        correct_attempts=5,
        recent_answers=[False, False, True],
        avg_time_sec=32.0,
        days_since_last=1.5,
        difficulty_weight=1.6
    )
    assert 15.0 <= ml_pred <= 95.0
    assert 0.8 <= conf <= 1.0
    assert isinstance(driver, str) and len(driver) > 0
