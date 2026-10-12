from pydantic import BaseModel
from typing import Optional

class StudyTaskCreate(BaseModel):
    title: str
    course: str
    due_date: Optional[str] = "Today, 8:00 PM"
    duration_minutes: int = 25
    priority: str = "Medium" # High, Medium, Low
    task_type: str = "reading"
    ai_suggested: bool = False

class StudyTaskSchema(BaseModel):
    id: str
    title: str
    course: str
    dueDate: str
    durationMinutes: int
    completed: bool
    priority: str
    type: str
    aiSuggested: bool

    class Config:
        from_attributes = True

class GeneratePlanRequest(BaseModel):
    available_daily_minutes: int = 60
    prioritize_weak_topics: bool = True
