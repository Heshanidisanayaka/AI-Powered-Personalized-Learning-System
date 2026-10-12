from pydantic import BaseModel
from typing import List

class WeeklyActivityItem(BaseModel):
    day: str
    hours: float
    quizzesTaken: int
    avgAccuracy: int
    focusScore: int

class AnalyticsOverview(BaseModel):
    total_hours_studied: float
    avg_quiz_accuracy: float
    concepts_mastered: int
    total_concepts: int
    longest_streak_days: int
    current_xp: int
    current_level: int
    weekly_activity: List[WeeklyActivityItem]
    peak_focus_time: str
    retention_score_pct: int
