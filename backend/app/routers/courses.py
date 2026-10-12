from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.course import Course, CourseModule, CourseMaterial
from app.models.user import User
from app.schemas.course import CourseSchema, CourseModuleSchema, CourseMaterialSchema
from app.services.auth_service import get_current_user

router = APIRouter(prefix="/courses", tags=["Courses & Learning Materials"])

@router.get("", response_model=List[CourseSchema])
def list_courses(db: Session = Depends(get_db)):
    return db.query(Course).all()

@router.get("/{course_id}", response_model=CourseSchema)
def get_course(course_id: str, db: Session = Depends(get_db)):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return course

@router.get("/{course_id}/materials", response_model=List[CourseMaterialSchema])
def get_course_materials(course_id: str, db: Session = Depends(get_db)):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return course.materials

@router.post("/{course_id}/modules/{module_id}/toggle", response_model=CourseModuleSchema)
def toggle_module(
    course_id: str,
    module_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    module = db.query(CourseModule).filter(
        CourseModule.id == module_id,
        CourseModule.course_id == course_id
    ).first()
    if not module:
        raise HTTPException(status_code=404, detail="Module not found")

    module.completed = not module.completed

    # Recalculate parent course progress
    all_modules = db.query(CourseModule).filter(CourseModule.course_id == course_id).all()
    completed_count = sum(1 for m in all_modules if m.completed)
    pct = int(round((completed_count / len(all_modules)) * 100)) if all_modules else 0

    course = db.query(Course).filter(Course.id == course_id).first()
    if course:
        course.completed_modules = completed_count
        course.progress_percent = pct

    # Award XP if completed
    if module.completed:
        current_user.total_xp += 25

    db.commit()
    db.refresh(module)
    return module
