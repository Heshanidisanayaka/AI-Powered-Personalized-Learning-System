import os
import logging
from sqlalchemy import create_engine, text
from sqlalchemy.orm import declarative_base, sessionmaker
import pymysql
from app.config import settings

logger = logging.getLogger("cognilearn.database")
logging.basicConfig(level=logging.INFO)

Base = declarative_base()

def init_engine():
    """
    Attempts to connect to MySQL database as specified in the user request.
    If MySQL server or credentials are not yet configured or fail,
    smoothly falls back to local SQLite to ensure uninterrupted uptime.
    """
    mysql_url = settings.DATABASE_URL
    try:
        # Check if we can reach MySQL host and ensure database exists
        if "mysql" in mysql_url.lower():
            logger.info("Attempting connection to MySQL: %s:%s (Database: %s)", settings.MYSQL_HOST, settings.MYSQL_PORT, settings.MYSQL_DB)
            
            # Connect to MySQL server root to create database if not exists
            try:
                temp_conn = pymysql.connect(
                    host=settings.MYSQL_HOST,
                    user=settings.MYSQL_USER,
                    password=settings.MYSQL_PASSWORD,
                    port=settings.MYSQL_PORT,
                    connect_timeout=3
                )
                with temp_conn.cursor() as cursor:
                    cursor.execute(f"CREATE DATABASE IF NOT EXISTS `{settings.MYSQL_DB}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;")
                temp_conn.commit()
                temp_conn.close()
                logger.info("MySQL database `%s` verified/created successfully.", settings.MYSQL_DB)
            except Exception as db_init_err:
                logger.warning("Could not auto-create MySQL database (%s). Will attempt direct connection.", db_init_err)

            # Test connecting with SQLAlchemy engine
            engine = create_engine(
                mysql_url,
                pool_pre_ping=True,
                pool_recycle=3600,
                pool_size=10,
                max_overflow=20
            )
            with engine.connect() as conn:
                conn.execute(text("SELECT 1"))
            logger.info("✅ Successfully connected to MySQL database: %s", settings.MYSQL_DB)
            return engine, "mysql"
    except Exception as e:
        logger.warning(
            "⚠️ MySQL connection failed (%s). Falling back to SQLite database for seamless execution: %s",
            e,
            settings.SQLITE_FALLBACK_URL
        )

    # Fallback to SQLite
    sqlite_engine = create_engine(
        settings.SQLITE_FALLBACK_URL,
        connect_args={"check_same_thread": False}
    )
    logger.info("✅ Database initialized using SQLite engine: %s", settings.SQLITE_FALLBACK_URL)
    return sqlite_engine, "sqlite"

engine, DB_ENGINE_TYPE = init_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
