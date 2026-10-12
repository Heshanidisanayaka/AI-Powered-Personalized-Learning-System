from pydantic import BaseModel
from typing import Optional

class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    title: Optional[str] = None
    daily_goal_minutes: Optional[int] = None
    learning_style: Optional[str] = None
    preferred_difficulty: Optional[str] = None
    target_exam: Optional[str] = None
