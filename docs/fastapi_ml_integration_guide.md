# ML Integration with FastAPI

Now that we have a theoretical trained ML model (e.g., `performance_model.pkl`), it's time to wire it into the FastAPI backend so the React frontend can request predictions.

We will follow the flow: **React Request -> Validation -> ML Model -> DB Save -> React Response**.

---

### Step 1: Request & Response Schemas (Pydantic)
We use Pydantic to ensure the data React sends is perfectly formatted before our ML model touches it.

**1. File to create:** `prediction_schema.py`
**2. Where to save it:** `backend/app/schemas/prediction_schema.py`
**3. Complete code:**
```python
from pydantic import BaseModel, Field
from typing import List

# 1. What React sends to FastAPI
class PredictionRequest(BaseModel):
    student_id: int
    subject_id: int
    attendance_percentage: float = Field(..., ge=0, le=100)
    assignment_marks: float = Field(..., ge=0, le=100)
    quiz_marks: float = Field(..., ge=0, le=100)
    study_hours_per_week: float = Field(..., ge=0)

# 2. What FastAPI sends back to React
class PredictionResponse(BaseModel):
    predicted_score: float
    performance_category: str  # "Excellent", "Good", "Average", "At Risk"
    is_at_risk: bool
    weak_areas: List[str]
    recommendations: List[str]
```

---

### Step 2: The ML Predictor Logic
This file handles loading the model and wrapping it with our business logic (detecting weak areas and giving recommendations).

**1. File to create:** `predictor.py`
**2. Where to save it:** `backend/app/ml/predictor.py`
**3. Complete code:**
```python
import joblib
import numpy as np
import os

# Get the absolute path to the model file
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "performance_model.pkl")

# Load the model (We use a try-except to handle cases where the file isn't built yet)
try:
    model = joblib.load(MODEL_PATH)
except FileNotFoundError:
    model = None

def generate_prediction(data: dict) -> dict:
    # 1. Format the data for Scikit-learn
    # Order must match training: [attendance, assignments, quizzes, study_hours]
    features = np.array([[
        data['attendance_percentage'],
        data['assignment_marks'],
        data['quiz_marks'],
        data['study_hours_per_week']
    ]])
    
    # 2. Predict using the model (or use dummy logic if model file is missing during dev)
    if model:
        predicted_score = float(model.predict(features)[0])
    else:
        # Fallback dummy logic for testing before the real model is trained
        predicted_score = (data['attendance_percentage'] * 0.4) + (data['quiz_marks'] * 0.6)
    
    # 3. Calculate Category & Risk
    is_at_risk = predicted_score < 50
    if predicted_score >= 80:
        category = "Excellent"
    elif predicted_score >= 65:
        category = "Good"
    elif predicted_score >= 50:
        category = "Average"
    else:
        category = "At Risk"
        
    # 4. Identify Weak Areas & Recommendations (Heuristic Logic)
    weak_areas = []
    recommendations = []
    
    if data['attendance_percentage'] < 75:
        weak_areas.append("Low Attendance")
        recommendations.append("Attend at least 3 more classes this month to improve.")
        
    if data['quiz_marks'] < 50:
        weak_areas.append("Topic Quizzes")
        recommendations.append("Review Lesson 4 and attempt the practice quizzes again.")
        
    if data['study_hours_per_week'] < 5:
        weak_areas.append("Study Time")
        recommendations.append("Increase self-study time by at least 2 hours per week.")
        
    # If no weak areas, give a positive recommendation
    if not weak_areas:
        recommendations.append("You are on track! Keep up the good work.")

    return {
        "predicted_score": round(predicted_score, 2),
        "performance_category": category,
        "is_at_risk": is_at_risk,
        "weak_areas": weak_areas,
        "recommendations": recommendations
    }
```

---

### Step 3: The API Endpoint & Database Save
This is the route the frontend calls. It validates the request, gets the prediction, saves it to the MySQL database, and returns the response.

**1. File to create:** `predictions.py`
**2. Where to save it:** `backend/app/api/predictions.py`
**3. Complete code:**
```python
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.prediction_schema import PredictionRequest, PredictionResponse
from app.ml.predictor import generate_prediction
from app.database.session import get_db

# Note: In a real app, you would import your SQLAlchemy models here
# from app.models.prediction_model import AIPredictionDB

router = APIRouter()

@router.post("/predict", response_model=PredictionResponse)
def get_student_prediction(request: PredictionRequest, db: Session = Depends(get_db)):
    try:
        # 1. Convert the validated request to a dictionary
        student_data = request.dict()
        
        # 2. Get the prediction from our ML logic
        result = generate_prediction(student_data)
        
        # 3. Save to Database (Mock representation)
        # db_prediction = AIPredictionDB(
        #     student_id=request.student_id,
        #     subject_id=request.subject_id,
        #     predicted_exam_score=result["predicted_score"]
        # )
        # db.add(db_prediction)
        # db.commit()
        
        # 4. Return to React
        return result
        
    except Exception as e:
        # Error handling
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")
```

---

### Step 4: Hooking it up to FastAPI
We must tell the main application that this new `/predict` route exists.

**1. File to edit:** `backend/app/main.py`
**2. Add these lines:**
```python
from fastapi import FastAPI
# ADD THIS IMPORT:
from app.api.predictions import router as predictions_router

app = FastAPI(title="AI-Powered Learning System API")

# ADD THIS LINE:
app.include_router(predictions_router, prefix="/api", tags=["AI Predictions"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the AI-Powered Learning System API!"}
```

---

### Step 5: How to Test Using Swagger UI

FastAPI automatically generates a testing UI, which acts like Postman built directly into your browser!

1.  Run your server: `uvicorn app.main:app --reload`
2.  Open your browser to: `http://localhost:8000/docs`
3.  Scroll down to the **AI Predictions** section and click on `POST /api/predict`.
4.  Click the **"Try it out"** button.
5.  Edit the JSON request body (e.g., set attendance to `40` and quizzes to `30`).
6.  Click **"Execute"**.
7.  Scroll down to see the Server Response. You should see `is_at_risk: true`, and the system will recommend increasing study time and attendance!

---

> [!IMPORTANT]
> **User Review Required**
> 
> Please review this integration flow. It shows exactly how the AI logic fits cleanly inside the web server, ensuring fast response times without locking up the database. 
> 
> Once you understand the schema validation and prediction logic, let me know, and we can proceed!
