from pydantic import BaseModel
from typing import List, Optional, Dict

class TopicMasterySchema(BaseModel):
    id: str
    topic: str
    subject: str
    total_attempts: int
    correct_attempts: int
    raw_accuracy_percent: float
    
    # Clearly distinguished scores
    rule_based_mastery: float
    ml_predicted_mastery: float
    
    status: str # 'Critical Focus' | 'Needs Practice' | 'Developing' | 'Nearly Mastered'
    benchmark_percent: float
    last_practiced: str
    is_weak_area: bool
    weak_reason: Optional[str] = None
    critical_gaps: List[str] = []
    
    # ML transparency metrics
    ml_confidence_score: float = 0.92
    primary_ml_factor: str = "Recency & Error Velocity on High-Difficulty Questions"

class WeakAreaDiagnostic(BaseModel):
    id: str
    topic: str
    subject: str
    masteryPercentage: int
    benchmarkPercentage: int
    status: str
    criticalGaps: List[str]
    suggestedAction: str
    lastPracticed: str
    whyWeakExplanation: str
