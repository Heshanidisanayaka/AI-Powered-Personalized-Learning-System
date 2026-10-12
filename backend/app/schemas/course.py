from pydantic import BaseModel
from typing import List, Optional

class CourseModuleSchema(BaseModel):
    id: str
    course_id: str
    title: str
    duration: str
    completed: bool
    module_type: str
    summary: Optional[str] = None
    order_index: int

    class Config:
        from_attributes = True

class CourseMaterialSchema(BaseModel):
    id: str
    course_id: str
    title: str
    material_type: str
    file_size: str
    downloads: int
    badge: str

    class Config:
        from_attributes = True

class CourseSchema(BaseModel):
    id: str
    title: str
    description: str
    category: str
    thumbnail: str
    instructor: str
    instructor_avatar: str
    total_modules: int
    completed_modules: int
    progress_percent: int
    estimated_hours: int
    level: str
    rating: float
    enrolled_count: int
    tags: str
    modules: List[CourseModuleSchema] = []
    materials: List[CourseMaterialSchema] = []

    class Config:
        from_attributes = True

class CourseCreate(BaseModel):
    title: str
    description: str
    category: str
    level: str = "Intermediate"
    estimated_hours: int = 24
