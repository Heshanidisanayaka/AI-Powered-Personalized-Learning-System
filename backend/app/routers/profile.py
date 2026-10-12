from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.schemas.auth import UserResponse
from app.schemas.profile import ProfileUpdate
from app.services.auth_service import get_current_user

router = APIRouter(prefix="/profile", tags=["Student Learning Profile"])

@router.get("", response_model=UserResponse)
def get_profile(current_user: User = Depends(get_current_user)):
    return current_user

@router.put("", response_model=UserResponse)
def update_profile(
    profile_data: ProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if profile_data.name is not None:
        current_user.name = profile_data.name
    if profile_data.email is not None:
        current_user.email = profile_data.email
    if profile_data.title is not None:
        current_user.title = profile_data.title
    if profile_data.daily_goal_minutes is not None:
        current_user.daily_goal_minutes = profile_data.daily_goal_minutes
    if profile_data.learning_style is not None:
        current_user.learning_style = profile_data.learning_style
    if profile_data.preferred_difficulty is not None:
        current_user.preferred_difficulty = profile_data.preferred_difficulty
    if profile_data.target_exam is not None:
        current_user.target_exam = profile_data.target_exam

    db.commit()
    db.refresh(current_user)
    return current_user
