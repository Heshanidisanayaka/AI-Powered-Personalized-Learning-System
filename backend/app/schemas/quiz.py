from pydantic import BaseModel
from typing import List, Optional

class QuestionSchema(BaseModel):
    id: str
    subject: str
    topic: str
    difficulty: str
    question: str
    code_snippet: Optional[str] = None
    options: List[str]
    correct_option_index: Optional[int] = None # hidden on active quiz until submitted
    explanation: Optional[str] = None
    concept_tag: str
    hint: str

    class Config:
        from_attributes = True

class AdaptiveNextQuestionRequest(BaseModel):
    previous_question_id: Optional[str] = None
    previous_was_correct: Optional[bool] = None
    target_topic: Optional[str] = None
    answered_question_ids: List[str] = []

class AdaptiveNextQuestionResponse(BaseModel):
    question: QuestionSchema
    current_difficulty: str
    adaptation_reason: str
    student_estimated_ability: float

class SubmitAnswerRequest(BaseModel):
    question_id: str
    selected_option_index: int
    time_spent_seconds: int = 15

class SubmitAnswerResponse(BaseModel):
    is_correct: bool
    correct_option_index: int
    explanation: str
    concept_tag: str
    xp_awarded: int
    updated_rule_mastery: float
    updated_ml_mastery: float

class FinishQuizRequest(BaseModel):
    total_questions: int
    score: int
    time_spent_seconds: int
    difficulty_mode: str = "Adaptive"

class FinishQuizResponse(BaseModel):
    attempt_id: str
    score: int
    total_questions: int
    accuracy_percent: float
    xp_earned: int
    strong_topics: List[str]
    weak_topics: List[str]
    message: str
