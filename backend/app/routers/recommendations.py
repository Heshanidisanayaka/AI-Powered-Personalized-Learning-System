from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.user import User
from app.models.course import Course
from app.models.performance import TopicMastery
from app.schemas.recommendation import RecommendationSchema
from app.services.auth_service import get_current_user
from app.services.recommendation_service import recommendation_service

router = APIRouter(prefix="/recommendations", tags=["Personalized Learning Recommendations"])

@router.get("", response_model=List[RecommendationSchema])
def get_recommendations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    weak_topics = (
        db.query(TopicMastery)
        .filter(TopicMastery.user_id == current_user.id)
        .all()
    )
    courses = db.query(Course).all()
    return recommendation_service.generate_recommendations(current_user, weak_topics, courses)
