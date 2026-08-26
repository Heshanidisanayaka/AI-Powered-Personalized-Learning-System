import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="AI-Powered Personalized Learning API",
    description="Backend API for the Student Performance Prediction System",
    version="1.0.0"
)

# Configure CORS for Vite frontend
origins = [
    "http://localhost:5173",  # React local dev server
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.database.session import get_db
from sqlalchemy.orm import Session
from sqlalchemy import text
from fastapi import Depends, HTTPException

@app.get("/health/db")
def check_db_health(db: Session = Depends(get_db)):
    try:
        # Execute a simple query to check the database connection
        db.execute(text("SELECT 1"))
        return {"status": "success", "message": "Database connection is healthy!"}
    except Exception as e:
        logger.error(f"Database health check failed: {e}")
        raise HTTPException(status_code=500, detail="Database connection failed")

@app.get("/")
def read_root():
    logger.info("Root endpoint accessed")
    return {"message": "Welcome to the AI-Powered Learning System API. Phase 2 Configuration Successful!"}
