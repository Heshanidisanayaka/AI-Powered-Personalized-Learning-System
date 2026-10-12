from pydantic import BaseModel, EmailStr
from typing import Optional

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: str
    name: str
    email: str
    role: str

class TokenData(BaseModel):
    user_id: Optional[str] = None
    role: Optional[str] = None

class UserLogin(BaseModel):
    email: str
    password: str

class UserRegister(BaseModel):
    name: str
    email: str
    password: str
    role: Optional[str] = "student"
    title: Optional[str] = "B.S. Computer Science & AI Candidate"

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    role: str
    title: Optional[str] = None
    grade: Optional[str] = None
    avatar: Optional[str] = None
    streak_days: int
    daily_goal_minutes: int
    daily_goal_progress_minutes: int
    total_xp: int
    level: int
    learning_style: str
    preferred_difficulty: str
    target_exam: Optional[str] = None

    class Config:
        from_attributes = True
