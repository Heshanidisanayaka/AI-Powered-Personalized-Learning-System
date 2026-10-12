from pydantic import BaseModel
from typing import Optional

class RecommendationSchema(BaseModel):
    id: str
    title: str
    category: str
    type: str # 'Interactive Lab' | 'Concept Deep Dive' | 'Practice Drill' | 'Flashcard Deck'
    difficulty: str
    estimatedTime: str
    matchScore: int
    aiReasoning: str # Explains why this is recommended based on student performance
    targetSkillGap: str
    thumbnail: str
    impactPotential: str
    courseRefId: Optional[str] = None
