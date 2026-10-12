from sqlalchemy import Column, String, Integer, Float, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Question(Base):
    __tablename__ = "questions"

    id = Column(String(50), primary_key=True, index=True)
    subject = Column(String(100), nullable=False)
    topic = Column(String(100), nullable=False, index=True)
    difficulty = Column(String(50), default="Medium") # Easy, Medium, Hard, Intermediate, Advanced
    question_text = Column(Text, nullable=False)
    code_snippet = Column(Text, nullable=True)
    options_json = Column(Text, nullable=False) # JSON encoded list of 4 options
    correct_option_index = Column(Integer, nullable=False)
    explanation = Column(Text, nullable=False)
    concept_tag = Column(String(150), nullable=False)
    hint = Column(Text, nullable=False)
    discrimination_index = Column(Float, default=1.0) # Item Response Theory parameter

    attempt_answers = relationship("QuizAttemptAnswer", back_populates="question")

class QuizAttempt(Base):
    __tablename__ = "quiz_attempts"

    id = Column(String(50), primary_key=True, index=True)
    user_id = Column(String(50), ForeignKey("users.id"), nullable=False, index=True)
    score = Column(Integer, nullable=False)
    total_questions = Column(Integer, nullable=False)
    accuracy_percent = Column(Float, nullable=False)
    time_spent_seconds = Column(Integer, default=60)
    difficulty_mode = Column(String(50), default="Adaptive")
    xp_earned = Column(Integer, default=50)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="quiz_attempts")
    answers = relationship("QuizAttemptAnswer", back_populates="attempt", cascade="all, delete-orphan")

class QuizAttemptAnswer(Base):
    __tablename__ = "quiz_attempt_answers"

    id = Column(String(50), primary_key=True, index=True)
    attempt_id = Column(String(50), ForeignKey("quiz_attempts.id"), nullable=False)
    question_id = Column(String(50), ForeignKey("questions.id"), nullable=False)
    selected_option_index = Column(Integer, nullable=False)
    is_correct = Column(Boolean, nullable=False)
    time_spent_seconds = Column(Integer, default=15)
    topic = Column(String(100), nullable=False)
    difficulty = Column(String(50), nullable=False)

    attempt = relationship("QuizAttempt", back_populates="answers")
    question = relationship("Question", back_populates="attempt_answers")
