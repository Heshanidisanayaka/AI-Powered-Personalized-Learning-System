from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from app.database import get_db
from app.models.user import User
from app.models.performance import TopicMastery
from app.schemas.mastery import TopicMasterySchema, WeakAreaDiagnostic
from app.services.auth_service import get_current_user
from app.services.weak_area_service import diagnose_weak_areas

router = APIRouter(prefix="/mastery", tags=["Topic Mastery & Weak-Area Analysis"])

@router.get("", response_model=List[TopicMasterySchema])
def get_topic_mastery(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    performances = db.query(TopicMastery).filter(TopicMastery.user_id == current_user.id).all()
    results = []
    for p in performances:
        avg_score = (p.rule_based_mastery + p.ml_predicted_mastery) / 2.0
        status = "Critical Focus" if avg_score < 50.0 else "Needs Practice" if avg_score < 65.0 else "Developing" if avg_score < 80.0 else "Nearly Mastered"

        gaps = [
            "Confusing queue vs stack state management in Kahn Algorithm",
            "Detecting cycles in directed vs undirected graph components"
        ] if "Graph" in p.topic else [
            "Jacobian matrix derivative through variance normalization",
            "Learnable affine parameters scale and shift"
        ] if "LayerNorm" in p.topic or "Neural" in p.topic else [
            "Deriving posterior precision with known vs unknown variance"
        ] if "Bayes" in p.topic else [
            "1D rolling array tabulation for unbounded knapsack"
        ]

        results.append(TopicMasterySchema(
            id=p.id,
            topic=p.topic,
            subject=p.subject,
            total_attempts=p.total_attempts,
            correct_attempts=p.correct_attempts,
            raw_accuracy_percent=p.raw_accuracy_percent,
            rule_based_mastery=p.rule_based_mastery,
            ml_predicted_mastery=p.ml_predicted_mastery,
            status=status,
            benchmark_percent=p.benchmark_percent,
            last_practiced=p.last_practiced_at.strftime("%b %d, %Y") if p.last_practiced_at else "Recently",
            is_weak_area=p.is_weak_area,
            weak_reason=p.weak_reason,
            critical_gaps=gaps,
            ml_confidence_score=0.93,
            primary_ml_factor="Recency and Error Rate on High-Difficulty Concepts"
        ))
    return results

@router.get("/weak-areas", response_model=List[WeakAreaDiagnostic])
def get_weak_areas(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    performances = db.query(TopicMastery).filter(TopicMastery.user_id == current_user.id).all()
    return diagnose_weak_areas(performances)
