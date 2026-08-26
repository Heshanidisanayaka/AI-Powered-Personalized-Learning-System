# Complete Database Design

Designing a normalized database is crucial for a 4th-year project. "Normalized" simply means we organize data to reduce redundancy (avoid saving the same data twice) and ensure data integrity (making sure data links correctly using IDs).

Below is the complete database design for your **AI-Powered Personalized Learning System** using MySQL.

---

## 1. ER Diagram Description (Entity-Relationship)
Imagine a web of connected boxes. Here is how our data connects:
*   **Users** are the center. A user can be an Admin, Teacher, or Student.
*   A **Teacher** manages many **Subjects**.
*   A **Subject** has many **Lessons**. A **Lesson** has many **Topics**.
*   A **Topic** has many **Quizzes**. A **Quiz** has many **Questions**.
*   A **Student** takes many Quizzes, producing **QuizAttempts**.
*   A **Student** receives marks for **Assignments** and **Exams**, tracks **Attendance**, and logs **Study Sessions**.
*   The AI Engine scans all this data for a Student, generates **AIPredictions** (future exam scores), detects **WeakAreas** (linked to specific Topics), and produces **Personalized Recommendations** (suggesting specific Lessons).

---

## 2. Important Tables, Keys, and Relationships

### Core Academic Entities
*   **Users**: Stores everyone.
    *   *Primary Key*: `user_id` (INT)
    *   *Important*: `role` (ENUM: 'student', 'teacher', 'admin')
*   **Subjects**: The courses taught.
    *   *Primary Key*: `subject_id` (INT)
    *   *Foreign Key*: `teacher_id` (Links to Users table)
*   **Lessons & Topics**: Breakdown of the subject.
    *   *Primary Key*: `lesson_id` (INT), `topic_id` (INT)
    *   *Foreign Keys*: `subject_id` (in Lessons), `lesson_id` (in Topics)

### Assessment & Activity Entities
*   **Quizzes & Questions**: For topic-level testing.
    *   *Foreign Key*: `topic_id` (in Quizzes), `quiz_id` (in Questions)
*   **QuizAttempts, AssignmentMarks, ExamMarks**: Where student scores are saved.
    *   *Foreign Keys*: `student_id` (Links to Users), and the respective assessment ID (`quiz_id`, `assignment_id`, `exam_id`).
*   **Attendance & StudySessions**: Tracks student engagement.
    *   *Foreign Keys*: `student_id`, `subject_id`.

### AI & Intelligence Entities
*   **AIPredictions**: Saves what the AI thinks the student will score.
    *   *Foreign Keys*: `student_id`, `subject_id`.
*   **WeakAreas**: Saves the topics the student is struggling with.
    *   *Foreign Keys*: `student_id`, `topic_id`.
*   **Recommendations**: The AI's advice.
    *   *Foreign Keys*: `student_id`, `weak_area_id`, `suggested_lesson_id`.

---

## 3. SQL `CREATE TABLE` Statements

Here is the exact SQL code to create a highly professional, normalized database in MySQL.

```sql
-- 1. Users Table (Students, Teachers, Admins)
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('student', 'teacher', 'admin') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Subjects Table
CREATE TABLE subjects (
    subject_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    teacher_id INT,
    FOREIGN KEY (teacher_id) REFERENCES users(user_id) ON DELETE SET NULL
);

-- 3. Lessons Table
CREATE TABLE lessons (
    lesson_id INT AUTO_INCREMENT PRIMARY KEY,
    subject_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    order_sequence INT,
    FOREIGN KEY (subject_id) REFERENCES subjects(subject_id) ON DELETE CASCADE
);

-- 4. Topics Table (Granular concepts for AI Weak Area detection)
CREATE TABLE topics (
    topic_id INT AUTO_INCREMENT PRIMARY KEY,
    lesson_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    FOREIGN KEY (lesson_id) REFERENCES lessons(lesson_id) ON DELETE CASCADE
);

-- 5. Quizzes Table
CREATE TABLE quizzes (
    quiz_id INT AUTO_INCREMENT PRIMARY KEY,
    topic_id INT NOT NULL,
    title VARCHAR(100) NOT NULL,
    max_score INT NOT NULL,
    FOREIGN KEY (topic_id) REFERENCES topics(topic_id) ON DELETE CASCADE
);

-- 6. Quiz Attempts (Tracks student performance on a quiz)
CREATE TABLE quiz_attempts (
    attempt_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    quiz_id INT NOT NULL,
    score_achieved INT NOT NULL,
    attempt_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(quiz_id) ON DELETE CASCADE
);

-- 7. Assignments & Assignment Marks
CREATE TABLE assignments (
    assignment_id INT AUTO_INCREMENT PRIMARY KEY,
    subject_id INT NOT NULL,
    title VARCHAR(100) NOT NULL,
    max_marks INT NOT NULL,
    FOREIGN KEY (subject_id) REFERENCES subjects(subject_id) ON DELETE CASCADE
);

CREATE TABLE assignment_marks (
    mark_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    assignment_id INT NOT NULL,
    score INT NOT NULL,
    date_recorded TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (assignment_id) REFERENCES assignments(assignment_id) ON DELETE CASCADE
);

-- 8. Exams & Exam Marks
CREATE TABLE exams (
    exam_id INT AUTO_INCREMENT PRIMARY KEY,
    subject_id INT NOT NULL,
    title VARCHAR(100) NOT NULL,
    max_marks INT NOT NULL,
    FOREIGN KEY (subject_id) REFERENCES subjects(subject_id) ON DELETE CASCADE
);

CREATE TABLE exam_marks (
    mark_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    exam_id INT NOT NULL,
    score INT NOT NULL,
    date_recorded TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (exam_id) REFERENCES exams(exam_id) ON DELETE CASCADE
);

-- 9. Attendance Tracking
CREATE TABLE attendance (
    attendance_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    subject_id INT NOT NULL,
    date DATE NOT NULL,
    status ENUM('present', 'absent', 'late') NOT NULL,
    FOREIGN KEY (student_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(subject_id) ON DELETE CASCADE
);

-- 10. Study Sessions (Student logs their self-study hours)
CREATE TABLE study_sessions (
    session_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    subject_id INT NOT NULL,
    duration_minutes INT NOT NULL,
    session_date DATE NOT NULL,
    FOREIGN KEY (student_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(subject_id) ON DELETE CASCADE
);

-- 11. AI Predictions (Output from Scikit-learn)
CREATE TABLE ai_predictions (
    prediction_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    subject_id INT NOT NULL,
    predicted_exam_score DECIMAL(5,2),
    prediction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(subject_id) ON DELETE CASCADE
);

-- 12. Weak Areas & Recommendations (Output from AI Engine)
CREATE TABLE weak_areas (
    weak_area_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    topic_id INT NOT NULL,
    severity ENUM('low', 'medium', 'high') NOT NULL,
    detected_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (topic_id) REFERENCES topics(topic_id) ON DELETE CASCADE
);

CREATE TABLE personalized_recommendations (
    rec_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    weak_area_id INT,
    suggested_lesson_id INT,
    message TEXT NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (student_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (weak_area_id) REFERENCES weak_areas(weak_area_id) ON DELETE CASCADE,
    FOREIGN KEY (suggested_lesson_id) REFERENCES lessons(lesson_id) ON DELETE SET NULL
);

-- 13. Notifications
CREATE TABLE notifications (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    message VARCHAR(255) NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
```

---

> [!IMPORTANT]
> **User Review Required**
> 
> The database is fully normalized. By splitting data into `topics`, `quizzes`, and `weak_areas`, the AI will have exactly the granular data it needs to recommend specific lessons to struggling students.
> 
> Please review the SQL design. Once you understand and approve this schema, let me know, and we can proceed to the next step (which involves deciding exactly how we will initialize the FastAPI and React projects on your machine).
