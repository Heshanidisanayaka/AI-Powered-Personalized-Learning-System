from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.schemas.ai_chat import ChatQueryRequest, ChatQueryResponse
from app.services.auth_service import get_current_user
from app.services.rag_tutor_service import rag_tutor

router = APIRouter(prefix="/chat", tags=["AI Learning Assistant (CogniTutor)"])

@router.post("", response_model=ChatQueryResponse)
def chat_with_tutor(
    query: ChatQueryRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    RAG-driven pedagogical AI assistant that retrieves approved learning materials,
    explains concepts with analogies, gives hints, and provides clean code snippets.
    """
    response_data = rag_tutor.answer_query(
        query=query.message,
        course_context=query.course_context
    )
    return ChatQueryResponse(**response_data)
