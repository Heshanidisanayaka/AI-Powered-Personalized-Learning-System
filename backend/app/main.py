import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.seed_data import seed_database
from app.routers import (
    auth,
    profile,
    dashboard,
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
logger = logging.getLogger("learnsmart.main")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing LearnSmart AI SaaS backend & seed records...")
    seed_database()
    logger.info("Database and intelligent learning models initialized successfully.")
    yield
    logger.info("LearnSmart backend shutting down cleanly.")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Full-stack AI-Powered Personalized Learning System backend API with adaptive quizzes, ML topic mastery, weak-area detection, RAG tutor assistant, and institutional administration.",
    lifespan=lifespan
)

# CORS Configuration for React Frontend with credentials (HttpOnly cookies & Bearer tokens)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_origin_regex=r"^https?://(localhost|127\.0\.0\.1)(:\d+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount all feature routers under /api
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(dashboard.router, prefix=settings.API_V1_STR)
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
        "rag_engine": "TF-IDF vector space active",
        "session_cookie": settings.SESSION_COOKIE_NAME
    }
