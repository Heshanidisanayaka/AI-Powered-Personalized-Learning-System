import os
from typing import Optional, List
from dotenv import load_dotenv

# Load .env file from project root or backend directory if present
load_dotenv()
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", "..", ".env"))
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", ".env"))

class Settings:
    PROJECT_NAME: str = "LearnSmart — AI-Powered Personalized Learning System"
    VERSION: str = "2.0.0"
    API_V1_STR: str = "/api"

    # Security & Cookie Session
    SECRET_KEY: str = os.getenv("SECRET_KEY", "learnsmart-ai-super-secret-jwt-key-2026-production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    SESSION_COOKIE_NAME: str = "learnsmart_session"
    COOKIE_SECURE: bool = False  # Set to True in HTTPS production
    COOKIE_SAMESITE: str = "lax"

    # CORS Allowed Origins
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ]

    # Database Configuration (MySQL default with automatic SQLite fallback)
    MYSQL_USER: str = os.getenv("MYSQL_USER", "root")
    MYSQL_PASSWORD: str = os.getenv("MYSQL_PASSWORD", "")
    MYSQL_HOST: str = os.getenv("MYSQL_HOST", "localhost")
    MYSQL_PORT: int = int(os.getenv("MYSQL_PORT", "3306"))
    MYSQL_DB: str = os.getenv("MYSQL_DB", "cognilearn_db")

    # Full Database URL
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        f"mysql+pymysql://{os.getenv('MYSQL_USER', 'root')}:{os.getenv('MYSQL_PASSWORD', '')}@{os.getenv('MYSQL_HOST', 'localhost')}:{os.getenv('MYSQL_PORT', '3306')}/{os.getenv('MYSQL_DB', 'cognilearn_db')}?charset=utf8mb4"
    )

    # Fallback SQLite DB path
    SQLITE_FALLBACK_URL: str = "sqlite:///./cognilearn.db"

    # Optional External AI API Key (Gemini / OpenAI for RAG)
    GEMINI_API_KEY: Optional[str] = os.getenv("GEMINI_API_KEY", None)
    OPENAI_API_KEY: Optional[str] = os.getenv("OPENAI_API_KEY", None)

settings = Settings()
