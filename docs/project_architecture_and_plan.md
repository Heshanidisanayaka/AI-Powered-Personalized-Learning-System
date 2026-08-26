# Project Master Plan: AI-Powered Learning System

Welcome to your final-year project! This document serves as the master blueprint for your **AI-Powered Personalized Learning and Student Performance Prediction System**. Because you are building this from scratch, we will take it step by step. 

Read through this carefully, and we will wait for your approval before writing any code.

---

## 1. Complete Project Overview
This project is an intelligent educational platform that goes beyond just storing student marks. By collecting data on attendance, quiz scores, assignment marks, and study time, the system uses Machine Learning to **predict** how a student will perform in their final exams. If a student is at risk of failing or struggling in a specific topic, the AI will detect this "weak area" and provide **personalized learning recommendations** to help them improve.

## 2. System Modules
The system is divided into several interconnected modules:
*   **Authentication Module**: Handles secure login, registration, and password management using JWT.
*   **User Management Module**: Manages profiles for students, teachers, and admins.
*   **Core Academic Module**: Manages subjects, lessons, and quizzes.
*   **Performance Tracking Module**: Records assignments, exams, attendance, and study hours.
*   **AI Engine Module**: The brain of the system; predicts performance and detects weak subjects.
*   **Analytics & Dashboard Module**: Generates visual charts, progress reports, and personalized recommendations.

## 3. User Roles
1.  **Student**: Can view their own dashboard, take lessons/quizzes, log study time, view their predicted performance, and receive AI recommendations.
2.  **Teacher/Instructor**: Can manage subjects/lessons, input marks/attendance for students, and view analytics to see which students are "at risk".
3.  **Admin**: Manages the entire platform, oversees all users, and handles system settings.

## 4. Functional Requirements
*What the system MUST do:*
*   Users must be able to securely register and log in.
*   Teachers must be able to add marks (quiz, assignment, exam) and track attendance.
*   Students must be able to input their daily study hours.
*   The system must calculate and display overall performance metrics.
*   The AI must analyze historical data to predict a student's final exam score.
*   The AI must identify specific topics where the student's scores are consistently low.
*   The system must display visually appealing charts for performance trends.
*   The system must send automated notifications/reminders (e.g., "You haven't logged study time today").

## 5. Non-Functional Requirements
*How well the system MUST perform:*
*   **Security**: Passwords must be hashed, and API endpoints must be protected by JWT authentication.
*   **Usability**: The frontend must be responsive, modern, and easy to use (even on mobile devices).
*   **Performance**: The API should respond quickly (under 2 seconds), and AI predictions should not freeze the dashboard.
*   **Scalability**: The system should be able to handle multiple students logging in simultaneously.

## 6. Recommended Folder Structure
Since you are using React for the frontend and FastAPI for the backend, we will keep them completely separate.

```text
my-final-year-project/
│
├── frontend/                 # React.js Application
│   ├── public/
│   ├── src/
│   │   ├── assets/           # Images, icons
│   │   ├── components/       # Reusable UI parts (Buttons, Navbar, Cards)
│   │   ├── pages/            # Full pages (Login, Dashboard, Profile)
│   │   ├── services/         # API calls to backend (axios/fetch)
│   │   ├── context/          # State management (Auth context)
│   │   └── App.jsx           # Main routing file
│   └── package.json
│
├── backend/                  # FastAPI Python Application
│   ├── app/
│   │   ├── main.py           # FastAPI entry point
│   │   ├── api/              # API routes (endpoints)
│   │   ├── models/           # Database models (SQLAlchemy)
│   │   ├── schemas/          # Pydantic schemas (Data validation)
│   │   ├── core/             # Security, JWT, config
│   │   ├── crud/             # Database queries (Create, Read, Update, Delete)
│   │   └── ml/               # Machine Learning scripts & trained models
│   └── requirements.txt
```

## 7. System Architecture
*   **Client (Frontend)**: React.js application running in the browser. It requests data and displays it using Recharts.
*   **API Gateway (Backend)**: Python FastAPI server. It receives requests from React, validates the data, checks the JWT token, and either fetches data from the database or runs data through the ML model.
*   **Database**: MySQL database holding all structured data.
*   **AI/ML Engine**: Python scripts running inside the backend that load a pre-trained Scikit-learn model to generate predictions based on the database data.

## 8. Database Entities (Tables)
1.  **Users**: `id`, `name`, `email`, `password_hash`, `role` (Student, Teacher, Admin).
2.  **Subjects**: `id`, `name`, `description`, `teacher_id`.
3.  **Lessons/Topics**: `id`, `subject_id`, `title`.
4.  **Enrollments**: `student_id`, `subject_id`.
5.  **Marks**: `id`, `student_id`, `subject_id`, `assessment_type` (Quiz, Assignment, Exam), `score`, `date`.
6.  **Attendance**: `id`, `student_id`, `date`, `status` (Present, Absent).
7.  **StudyLogs**: `id`, `student_id`, `date`, `hours_studied`.

## 9. AI/ML Components
*   **Performance Prediction Model**: A Regression model (e.g., Linear Regression or Random Forest Regressor).
    *   *Inputs (Features)*: Average quiz marks, attendance percentage, total study hours, past assignment marks.
    *   *Output (Label)*: Predicted Final Exam Score (percentage).
*   **Weak Area Detection**: An analytical algorithm that calculates the rolling average of quiz scores per specific topic. If the average drops below a certain threshold (e.g., 60%), it flags the topic.
*   **Recommender Rule Engine**: Maps "Weak Areas" to specific "Lessons". If a student is weak in "Topic A", the system recommends "Please re-read Lesson A and try Quiz A again."

## 10. Development Phases
*   **Phase 1: Foundation**: Set up the React frontend and FastAPI backend. Create the MySQL database and connect them.
*   **Phase 2: Authentication & Roles**: Build login, registration, JWT security, and route protection.
*   **Phase 3: Core CRUD Operations**: Build the screens and APIs to add subjects, enter marks, log attendance, and log study time.
*   **Phase 4: Machine Learning**: Export a dummy dataset, train the Scikit-learn model in a Jupyter Notebook, export the model as a `.pkl` file, and integrate it into FastAPI.
*   **Phase 5: Dashboards & Analytics**: Build the interactive React dashboards using Recharts to visualize the database data and AI predictions.
*   **Phase 6: Polish & Finalize**: Add notifications, test the system, and fix bugs.

## 11. Exact Order to Build the Project
*Do NOT skip around. Follow this sequence strictly:*

1.  **Environment Setup**: Install Node.js, Python, MySQL, and create the empty project folders.
2.  **Database Design**: Write the SQL scripts or SQLAlchemy models to create the database tables.
3.  **Backend Auth**: Build the FastAPI endpoints for User Registration and Login (JWT generation).
4.  **Frontend Auth**: Build the React Login/Register pages and save the JWT token in the browser.
5.  **Backend APIs (Data Entry)**: Build FastAPI endpoints to save and retrieve Marks, Attendance, and Study Time.
6.  **Frontend Forms**: Build React pages for Teachers to enter marks and Students to log study time.
7.  **ML Model Training**: Create a Python script outside the web app to train the Scikit-Learn model on sample data and save it.
8.  **Backend AI Integration**: Create a FastAPI endpoint that loads the ML model and returns a prediction for a specific student.
9.  **Frontend Dashboard**: Build the Student and Teacher dashboards, pulling real data and the AI predictions from the backend.
10. **Final Testing**: Ensure all user roles work correctly and the UI looks professional.

---

> [!IMPORTANT]
> **User Review Required**
> 
> Please read through this blueprint. Once you fully understand and agree with the architecture, folder structure, and the exact order of steps, simply reply with your approval. 
> 
> **We will start with Step 1 (Environment Setup & Folder Structure) as soon as you are ready.**
