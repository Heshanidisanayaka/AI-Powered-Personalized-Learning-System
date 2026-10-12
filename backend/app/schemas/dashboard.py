from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class WeeklyActivityItem(BaseModel):
    day: str
    hours: float
    quizzesTaken: int
    avgAccuracy: int
    focusScore: int

class RecommendedNextLesson(BaseModel):
    id: str
    title: str
    course_id: str
    course_title: str
    duration: str
    module_type: str
    topic: str

class DashboardWeakTopic(BaseModel):
    id: str
    topic: str
    subject: str
    masteryPercentage: int
    benchmarkPercentage: int
    status: str
    whyWeakExplanation: str
    criticalGaps: List[str] = []

class DashboardTask(BaseModel):
    id: str
    title: str
    course: str
    dueDate: str
    durationMinutes: int
    completed: bool
    priority: str
    type: str
    aiSuggested: bool

class DashboardCourseSummary(BaseModel):
    id: str
    title: str
    category: str
    thumbnail: str
    progressPercent: int
    completedModules: int
    totalModules: int
    estimatedHours: int
    nextLesson: Optional[str] = None

class DashboardSummaryResponse(BaseModel):
    student_name: str
    student_title: Optional[str] = None
    streak_days: int
    daily_goal_minutes: int
    daily_goal_progress_minutes: int
    total_xp: int
    level: int
    overall_progress_pct: int
    completed_modules_count: int
    total_modules_count: int
    recommended_next_lesson: Optional[RecommendedNextLesson] = None
    weekly_activity: List[WeeklyActivityItem]
    weak_topics: List[DashboardWeakTopic]
    upcoming_tasks: List[DashboardTask]
    active_courses: List[DashboardCourseSummary]
