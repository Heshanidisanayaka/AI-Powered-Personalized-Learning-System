from sqlalchemy import Column, String, Integer, DateTime, Boolean, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String(50), primary_key=True, index=True)
    email = Column(String(120), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    name = Column(String(100), nullable=False)
    role = Column(String(20), default="student", nullable=False) # 'student' | 'admin'
    title = Column(String(150), default="B.S. Computer Science & AI Candidate")
    grade = Column(String(50), default="Senior Year")
    avatar = Column(String(255), default="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250")
    
    streak_days = Column(Integer, default=14)
    daily_goal_minutes = Column(Integer, default=60)
    daily_goal_progress_minutes = Column(Integer, default=42)
    total_xp = Column(Integer, default=3840)
    level = Column(Integer, default=8)
    
    learning_style = Column(String(50), default="Hands-on Coding") # Visual, Hands-on Coding, Theoretical, Socratic
    preferred_difficulty = Column(String(50), default="Adaptive") # Adaptive, Beginner, Intermediate, Advanced
    target_exam = Column(String(150), default="ACM-ICPC & Machine Learning Engineer Certification")
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    quiz_attempts = relationship("QuizAttempt", back_populates="user", cascade="all, delete-orphan")
    topic_performances = relationship("TopicMastery", back_populates="user", cascade="all, delete-orphan")
    study_tasks = relationship("StudyTaskRecord", back_populates="user", cascade="all, delete-orphan")
    learning_history = relationship("LearningHistory", back_populates="user", cascade="all, delete-orphan")
