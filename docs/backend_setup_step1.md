# Backend Setup Step 1: FastAPI & MySQL Initialization

Welcome to Step 1! We are going to set up the foundation of your Python backend. Because we are building this step-by-step, we will start strictly with the environment, packages, database connection, and a basic running server.

---

### Step 1.1: Create the Backend Folder & Virtual Environment
Since you already have a React app in your main project folder, let's keep the backend completely separate.

**1. Where to create:** In your main project folder (`AI-Powered Personalized Learning and Student Performance Prediction System`), create a new folder named `backend`.
**2. Open a terminal** inside the `backend` folder.
**3. Run these commands** to create and activate a Python virtual environment:
```bash
# Create the virtual environment
python -m venv venv

# Activate it (Windows)
.\venv\Scripts\activate
```

---

### Step 1.2: Install Required Packages

**1. File to create:** `requirements.txt`
**2. Where to save it:** Inside the `backend` folder.
**3. Complete code:**
```txt
fastapi==0.104.1
uvicorn==0.24.0.post1
sqlalchemy==2.0.23
pymysql==1.1.0
cryptography==41.0.5
python-dotenv==1.0.0
```
**4. How to run it:** Run the following command in your activated terminal to install the packages:
```bash
pip install -r requirements.txt
```

---

### Step 1.3: Configure the Environment Variables

**1. File to create:** `.env` (Note the dot at the beginning)
**2. Where to save it:** Inside the `backend` folder.
**3. Complete code:**
*(Make sure to change `root` and `your_password` to your actual MySQL credentials, and ensure you have created an empty database named `ai_learning_db` in MySQL).*
```env
# MySQL Database Connection String
DATABASE_URL=mysql+pymysql://root:your_password@localhost:3306/ai_learning_db
```

---

### Step 1.4: MySQL Database Connection

**1. Files to create:** You need to create a folder structure first. Inside `backend`, create a folder named `app`, and inside `app`, create a folder named `database`.

**2. File to create:** `config.py`
**3. Where to save it:** `backend/app/database/config.py`
**4. Complete code:**
```python
import os
from dotenv import load_dotenv

# Load variables from the .env file
load_dotenv()

# Get the database URL
DATABASE_URL = os.getenv("DATABASE_URL")
```

**5. File to create:** `session.py`
**6. Where to save it:** `backend/app/database/session.py`
**7. Complete code:**
```python
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.database.config import DATABASE_URL

# Create the SQLAlchemy engine that connects to MySQL
engine = create_engine(DATABASE_URL)

# Create a SessionLocal class. Each instance will be a database session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for our database models to inherit from
Base = declarative_base()

# Dependency to get a database session for each request
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

---

### Step 1.5: Basic FastAPI Server

**1. File to create:** `main.py`
**2. Where to save it:** `backend/app/main.py`
**3. Complete code:**
```python
from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db, engine, Base

# Create the FastAPI app instance
app = FastAPI(
    title="AI-Powered Learning System API",
    description="Backend API for 4th Year CS Project"
)

# Root endpoint to test if server is running
@app.get("/")
def read_root():
    return {"message": "Welcome to the AI-Powered Learning System API!"}

# Test database connection endpoint
@app.get("/test-db")
def test_db_connection(db: Session = Depends(get_db)):
    try:
        # Try to execute a simple query
        db.execute("SELECT 1")
        return {"message": "Successfully connected to the MySQL Database!"}
    except Exception as e:
        return {"error": f"Database connection failed: {str(e)}"}
```

---

### Step 1.6: How to Run and Test It

**How to run it:**
Make sure you are in the `backend` directory with your virtual environment activated, then run:
```bash
uvicorn app.main:app --reload
```

**How to test it:**
1. Open your web browser and go to: `http://localhost:8000/`
   *You should see: `{"message": "Welcome to the AI-Powered Learning System API!"}`*
2. Go to: `http://localhost:8000/test-db`
   *You should see: `{"message": "Successfully connected to the MySQL Database!"}` (Assuming your MySQL server is running and the `.env` credentials are correct).*
3. Go to: `http://localhost:8000/docs`
   *This opens the automatic Swagger UI documentation built into FastAPI.*

---

> [!IMPORTANT]
> **Awaiting Your Confirmation**
> 
> Please follow these exact steps to create the files on your machine, create the empty `ai_learning_db` in MySQL, and test the server. 
> 
> Let me know if you run into any errors or when you see the success message. **I will wait for your confirmation before we move to Step 2 (Creating the User Models and JWT Authentication).**
