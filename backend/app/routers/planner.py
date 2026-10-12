from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from app.database import get_db
from app.models.user import User
from app.models.planner import StudyTaskRecord
from app.schemas.planner import StudyTaskSchema, StudyTaskCreate, GeneratePlanRequest
from app.services.auth_service import get_current_user
from app.services.planner_service import generate_personalized_study_plan

router = APIRouter(prefix="/planner", tags=["Personalized Study Planner"])

@router.get("/tasks", response_model=List[StudyTaskSchema])
def list_study_tasks(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    tasks = (
        db.query(StudyTaskRecord)
        .filter(StudyTaskRecord.user_id == current_user.id)
        .order_by(StudyTaskRecord.completed.asc(), StudyTaskRecord.created_at.desc())
        .all()
    )
    return [
        StudyTaskSchema(
            id=t.id,
            title=t.title,
            course=t.course,
            dueDate=t.due_date,
            durationMinutes=t.duration_minutes,
            completed=t.completed,
            priority=t.priority,
            type=t.task_type,
            aiSuggested=t.ai_suggested
        )
        for t in tasks
    ]

@router.post("/tasks", response_model=StudyTaskSchema)
def create_study_task(
    task_in: StudyTaskCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    task_id = f"task-{int(datetime.utcnow().timestamp())}"
    new_task = StudyTaskRecord(
        id=task_id,
        user_id=current_user.id,
        title=task_in.title,
        course=task_in.course,
        due_date=task_in.due_date or "Today, 8:00 PM",
        duration_minutes=task_in.duration_minutes,
        completed=False,
        priority=task_in.priority,
        task_type=task_in.task_type,
        ai_suggested=task_in.ai_suggested
    )
    db.add(new_task)
    db.commit()
    db.refresh(new_task)

    return StudyTaskSchema(
        id=new_task.id,
        title=new_task.title,
        course=new_task.course,
        dueDate=new_task.due_date,
        durationMinutes=new_task.duration_minutes,
        completed=new_task.completed,
        priority=new_task.priority,
        type=new_task.task_type,
        aiSuggested=new_task.ai_suggested
    )

@router.patch("/tasks/{task_id}/toggle", response_model=StudyTaskSchema)
def toggle_study_task(
    task_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    task = db.query(StudyTaskRecord).filter(
        StudyTaskRecord.id == task_id,
        StudyTaskRecord.user_id == current_user.id
    ).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    task.completed = not task.completed
    if task.completed:
        current_user.total_xp += 25
        current_user.daily_goal_progress_minutes = min(
            current_user.daily_goal_minutes,
            current_user.daily_goal_progress_minutes + task.duration_minutes
        )

    db.commit()
    db.refresh(task)

    return StudyTaskSchema(
        id=task.id,
        title=task.title,
        course=task.course,
        dueDate=task.due_date,
        durationMinutes=task.duration_minutes,
        completed=task.completed,
        priority=task.priority,
        type=task.task_type,
        aiSuggested=task.ai_suggested
    )

@router.delete("/tasks/{task_id}")
def delete_study_task(
    task_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    task = db.query(StudyTaskRecord).filter(
        StudyTaskRecord.id == task_id,
        StudyTaskRecord.user_id == current_user.id
    ).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    db.delete(task)
    db.commit()
    return {"message": "Task removed from planner"}

@router.post("/generate", response_model=List[StudyTaskSchema])
def generate_study_plan(
    req: GeneratePlanRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    new_tasks = generate_personalized_study_plan(
        db,
        current_user,
        available_daily_minutes=req.available_daily_minutes,
        prioritize_weak_topics=req.prioritize_weak_topics
    )
    return [
        StudyTaskSchema(
            id=t.id,
            title=t.title,
            course=t.course,
            dueDate=t.due_date,
            durationMinutes=t.duration_minutes,
            completed=t.completed,
            priority=t.priority,
            type=t.task_type,
            aiSuggested=t.ai_suggested
        )
        for t in new_tasks
    ]
