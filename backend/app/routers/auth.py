from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session
from app.config import settings
from app.database import get_db
from app.models.user import User
from app.schemas.auth import UserLogin, UserRegister, Token, UserResponse
from app.services.auth_service import verify_password, get_password_hash, create_access_token, get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication & User Sessions"])

@router.post("/register", response_model=Token)
def register(user_in: UserRegister, response: Response, db: Session = Depends(get_db)):
    if not user_in.email or "@" not in user_in.email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please provide a valid educational email address."
        )

    if len(user_in.password) < 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 6 characters long."
        )

    existing = db.query(User).filter(User.email == user_in.email.strip().lower()).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists. Please sign in instead."
        )

    user_slug = user_in.name.lower().replace(" ", "-")[:12]
    now_ts = int(datetime.now(timezone.utc).timestamp()) % 100000
    user_id = f"usr-{user_slug}-{now_ts}"
    
    new_user = User(
        id=user_id,
        email=user_in.email.strip().lower(),
        name=user_in.name.strip(),
        hashed_password=get_password_hash(user_in.password),
        role=user_in.role or "student",
        title=user_in.title or "B.S. Computer Science & AI Candidate"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_access_token({"sub": new_user.id, "role": new_user.role})

    # Set secure HttpOnly session cookie
    response.set_cookie(
        key=settings.SESSION_COOKIE_NAME,
        value=token,
        httponly=True,
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        samesite=settings.COOKIE_SAMESITE,
        secure=settings.COOKIE_SECURE,
        path="/"
    )

    return Token(
        access_token=token,
        user_id=new_user.id,
        name=new_user.name,
        email=new_user.email,
        role=new_user.role
    )

@router.post("/login", response_model=Token)
def login(login_data: UserLogin, response: Response, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_data.email.strip().lower()).first()
    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password. Please verify your credentials and try again."
        )

    token = create_access_token({"sub": user.id, "role": user.role})

    # Set secure HttpOnly session cookie
    response.set_cookie(
        key=settings.SESSION_COOKIE_NAME,
        value=token,
        httponly=True,
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        samesite=settings.COOKIE_SAMESITE,
        secure=settings.COOKIE_SECURE,
        path="/"
    )

    return Token(
        access_token=token,
        user_id=user.id,
        name=user.name,
        email=user.email,
        role=user.role
    )

@router.post("/logout")
def logout(response: Response):
    """
    Clears the HttpOnly session cookie and logs out the student or admin.
    """
    response.delete_cookie(
        key=settings.SESSION_COOKIE_NAME,
        path="/"
    )
    return {
        "status": "success",
        "message": "Signed out successfully. Session terminated."
    }

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user
