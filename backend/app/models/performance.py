from sqlalchemy import Column, String, Integer, Float, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class TopicMastery(Base):
    __tablename__ = "topic_mastery"

    id = Column(String(50), primary_key=True, index=True)
    user_id = Column(String(50), ForeignKey("users.id"), nullable=False, index=True)
    topic = Column(String(100), nullable=False, index=True)
    subject = Column(String(100), nullable=False)
    
    total_attempts = Column(Integer, default=0)
    correct_attempts = Column(Integer, default=0)
    raw_accuracy_percent = Column(Float, default=0.0)
    
    # Clearly distinguished rule-based and machine-learning scores
    rule_based_mastery = Column(Float, default=50.0) # Calculated via weighted recency heuristic
    ml_predicted_mastery = Column(Float, default=50.0) # Predicted via scikit-learn trained regressor
    
    avg_response_seconds = Column(Float, default=20.0)
    last_practiced_at = Column(DateTime, default=datetime.utcnow)
    
    is_weak_area = Column(Boolean, default=False)
    weak_reason = Column(Text, nullable=True) # Explicit pedagogical explanation why weak
    benchmark_percent = Column(Float, default=80.0) # Cohort benchmark

    user = relationship("User", back_populates="topic_performances")

class LearningHistory(Base):
    __tablename__ = "learning_history"

    id = Column(String(50), primary_key=True, index=True)
    user_id = Column(String(50), ForeignKey("users.id"), nullable=False, index=True)
    activity_type = Column(String(50), nullable=False) # 'quiz', 'lesson', 'lab', 'chat', 'task'
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    score_earned = Column(Float, nullable=True)
    xp_delta = Column(Integer, default=25)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="learning_history")
