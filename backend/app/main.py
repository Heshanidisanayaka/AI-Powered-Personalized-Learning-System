import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.seed_data import seed_database
from app.routers import (
    auth,
    profile,
    courses,
    mastery,
    recommendations,
    quiz,
    planner,
    ai_chat,
    analytics,
    admin
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("cognilearn.main")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Intelligent AI-Powered Personalized Learning System backend API with adaptive quizzes, ML topic mastery, weak-area detection, and RAG tutor assistant."
)

# CORS Configuration for React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In development allow all origins including localhost:5173
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    logger.info("Initializing CogniLearn AI SaaS backend...")
    seed_database()
    logger.info("Database and intelligent learning models initialized successfully.")

# Mount all feature routers under /api
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(profile.router, prefix=settings.API_V1_STR)
app.include_router(courses.router, prefix=settings.API_V1_STR)
app.include_router(mastery.router, prefix=settings.API_V1_STR)
app.include_router(recommendations.router, prefix=settings.API_V1_STR)
app.include_router(quiz.router, prefix=settings.API_V1_STR)
app.include_router(planner.router, prefix=settings.API_V1_STR)
app.include_router(ai_chat.router, prefix=settings.API_V1_STR)
app.include_router(analytics.router, prefix=settings.API_V1_STR)
app.include_router(admin.router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "system": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "online",
        "documentation": "/docs"
    }

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "ml_engine": "scikit-learn GradientBoostingRegressor active",
        "rag_engine": "TF-IDF vector space active"
    }
