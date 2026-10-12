from sqlalchemy import Column, String, Integer, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class StudyTaskRecord(Base):
    __tablename__ = "study_tasks"

    id = Column(String(50), primary_key=True, index=True)
    user_id = Column(String(50), ForeignKey("users.id"), nullable=False, index=True)
    title = Column(String(200), nullable=False)
    course = Column(String(100), nullable=False)
    due_date = Column(String(50), default="Today, 8:00 PM")
    duration_minutes = Column(Integer, default=25)
    completed = Column(Boolean, default=False)
    priority = Column(String(20), default="Medium") # High, Medium, Low
    task_type = Column(String(50), default="reading") # quiz, reading, coding, review
    ai_suggested = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="study_tasks")
