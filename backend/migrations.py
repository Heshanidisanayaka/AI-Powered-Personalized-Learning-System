"""
LearnSmart Database Migration & Schema Setup Utility
Ensures proper foreign keys, indexes, and tables in MySQL / SQLite.
Run with: python backend/migrations.py
"""

import os
import sys
import logging
from sqlalchemy import text, inspect

# Add backend directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database import engine, Base, DB_ENGINE_TYPE
from app.models.user import User
from app.models.course import Course, CourseModule, CourseMaterial
from app.models.quiz import Question, QuizAttempt, QuizAttemptAnswer
from app.models.performance import TopicMastery, LearningHistory
from app.models.planner import StudyTaskRecord
from app.seed_data import seed_database

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("learnsmart.migrations")

def run_migrations():
    logger.info("==================================================")
    logger.info("Starting LearnSmart Database Migrations...")
    logger.info("Active Database Engine: %s", DB_ENGINE_TYPE)
    logger.info("==================================================")

    # 1. Create all declarative tables
    logger.info("Verifying and creating tables...")
    Base.metadata.create_all(bind=engine)

    # 2. Add performance indexes if not already present
    inspector = inspect(engine)
    existing_tables = inspector.get_table_names()
    logger.info("Existing database tables: %s", ", ".join(existing_tables))

    with engine.connect() as conn:
        # Example index creations for optimal query speeds
        if DB_ENGINE_TYPE == "mysql":
            logger.info("Ensuring MySQL specific composite indexes...")
            try:
                conn.execute(text("CREATE INDEX IF NOT EXISTS idx_tm_user_topic ON topic_mastery (user_id, topic);"))
                conn.execute(text("CREATE INDEX IF NOT EXISTS idx_qa_user ON quiz_attempts (user_id);"))
                conn.execute(text("CREATE INDEX IF NOT EXISTS idx_st_user_comp ON study_tasks (user_id, completed);"))
                conn.commit()
                logger.info("MySQL indexes verified successfully.")
            except Exception as idx_err:
                logger.warning("Index check notice: %s", idx_err)

    # 3. Seed initial curriculum data if empty
    logger.info("Checking seed data...")
    seed_database()

    logger.info("==================================================")
    logger.info("✅ LearnSmart Database Migrations Completed!")
    logger.info("==================================================")

if __name__ == "__main__":
    run_migrations()
