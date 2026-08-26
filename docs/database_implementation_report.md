# Database Implementation Report

The database foundation for your AI-Powered Personalized Learning System is complete! 
Below are the answers to all 8 of your implementation questions.

## 1. Database Structure Explained
The database (`ai_learning_db`) is highly normalized and consists of 21 tables representing the core entities of the university system. It uses `INT AUTO_INCREMENT` for all primary keys and utilizes `ENUM` types for fixed-choice fields (like roles, status, and severity) to enforce data integrity. Every table (where appropriate) includes `created_at` timestamps for auditing purposes.

## 2. Table Relationships Explained
The database uses a relational architecture heavily relying on Foreign Keys with `ON DELETE CASCADE` to prevent orphaned records:
- **Core Identity**: `users` is the master table. `students`, `teachers`, and `admins` link directly to `users.id`.
- **Academics**: `subjects` belong to a `teacher`. `topics` belong to `subjects`. `lessons` belong to `topics`.
- **Assessments**: `quizzes` and `assignments` belong to `lessons` and `subjects`. 
- **Student Data**: `quiz_attempts`, `assignment_submissions`, `attendance`, `study_sessions`, and `student_lesson_progress` all link back to `student.id` (as well as their respective academic entity IDs).
- **AI Modules**: `performance_records`, `ai_predictions`, `weak_areas`, and `personalized_recommendations` directly map to `student.id`.

## 3. How to Create the Database
Because the script automatically creates the database if it doesn't exist, you do not need to create it manually. The `schema.sql` file handles this.

## 4. How to Run `schema.sql`
Open your terminal or command prompt, ensure MySQL is running, and execute:
```bash
# Replace 'root' with your MySQL username
mysql -u root -p < database/schema.sql
```
*(Enter your MySQL password when prompted).*

## 5. How to Run `seed.sql`
Once the schema is created, populate it with mock data by running:
```bash
mysql -u root -p < database/seed.sql
```

## 6. How to Configure `.env`
In your `backend/.env` file, ensure your `DATABASE_URL` is set correctly. 
Replace `user` and `password` with your real MySQL credentials:
```env
# Example configuration:
DATABASE_URL=mysql+pymysql://root:MySecretPassword123@localhost:3306/ai_learning_db
```

## 7. How to Start FastAPI
Open a terminal in the root of your project and run:
```bash
cd backend
.\venv\Scripts\Activate.ps1
uvicorn app.main:app --reload
```

## 8. How to Test the Database Connection
I have created a dedicated health check endpoint. 
With your FastAPI server running (and MySQL running), open your web browser and go to:
**👉 http://localhost:8000/health/db**

If your `.env` configuration is correct and MySQL is running, you will see:
```json
{"status": "success", "message": "Database connection is healthy!"}
```

---

> [!TIP]
> The SQLAlchemy Object Relational Mapping (ORM) models for all 21 tables have been completely built and saved in `backend/app/models/domain.py`. These models mirror the exact structure of your SQL schema and are ready for API integration in Phase 4.
