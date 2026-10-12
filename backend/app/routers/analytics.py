from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.schemas.analytics import AnalyticsOverview
from app.services.auth_service import get_current_user
from app.services.analytics_service import get_student_analytics_summary

router = APIRouter(prefix="/analytics", tags=["Learning Progress & Analytics"])

@router.get("", response_model=AnalyticsOverview)
def get_analytics(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return get_student_analytics_summary(db, current_user)
