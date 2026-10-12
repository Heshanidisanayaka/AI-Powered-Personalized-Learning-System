from pydantic import BaseModel
from typing import List, Optional

class ChatQueryRequest(BaseModel):
    message: str
    course_context: Optional[str] = None
    topic_context: Optional[str] = None

class ChatQueryResponse(BaseModel):
    id: str
    sender: str = "ai"
    text: str
    timestamp: str
    code_snippet: Optional[str] = None
    suggested_follow_ups: List[str] = []
    rag_sources_used: List[str] = []
    rag_confidence: float = 0.95
