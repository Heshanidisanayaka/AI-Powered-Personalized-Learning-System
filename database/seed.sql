USE ai_learning_db;

-- 1. Users
INSERT INTO users (first_name, last_name, email, password_hash, role) VALUES
('Admin', 'User', 'admin@school.edu', '$2b$12$dummyhash1', 'ADMIN'),
('Jane', 'Smith', 'teacher@school.edu', '$2b$12$dummyhash2', 'TEACHER'),
('John', 'Doe', 'student@school.edu', '$2b$12$dummyhash3', 'STUDENT');

-- 2. Students
INSERT INTO students (user_id, enrollment_number) VALUES
(3, 'STU2026-001');

-- 3. Teachers
INSERT INTO teachers (user_id, department) VALUES
(2, 'Computer Science');

-- 4. Admins
INSERT INTO admins (user_id) VALUES
(1);

-- 5. Subjects
INSERT INTO subjects (name, code, teacher_id) VALUES
('Introduction to Machine Learning', 'CS401', 1);

-- 6. Topics
INSERT INTO topics (subject_id, name) VALUES
(1, 'Supervised Learning');

-- 7. Lessons
INSERT INTO lessons (topic_id, title, content, order_index) VALUES
(1, 'Decision Trees and Random Forests', 'Content for decision trees...', 1);

-- 8. Student Lesson Progress
INSERT INTO student_lesson_progress (student_id, lesson_id, status) VALUES
(1, 1, 'COMPLETED');

-- 9. Quizzes
INSERT INTO quizzes (lesson_id, title) VALUES
(1, 'Random Forest Quiz 1');

-- 10. Questions
INSERT INTO questions (quiz_id, question_text, correct_answer, points) VALUES
(1, 'What does a Random Forest consist of?', 'Multiple Decision Trees', 1);

-- 11. Quiz Attempts
INSERT INTO quiz_attempts (student_id, quiz_id, score) VALUES
(1, 1, 100.0);

-- 12. Quiz Answers
INSERT INTO quiz_answers (attempt_id, question_id, student_answer, is_correct) VALUES
(1, 1, 'Multiple Decision Trees', TRUE);

-- 13. Assignments
INSERT INTO assignments (subject_id, title, due_date, max_score) VALUES
(1, 'Build a Classifier', '2026-09-15 23:59:59', 100.0);

-- 14. Assignment Submissions
INSERT INTO assignment_submissions (assignment_id, student_id, submission_url, grade) VALUES
(1, 1, 'http://github.com/johndoe/classifier', 95.0);

-- 15. Attendance
INSERT INTO attendance (student_id, subject_id, date, status) VALUES
(1, 1, '2026-08-26', 'PRESENT');

-- 16. Study Sessions
INSERT INTO study_sessions (student_id, subject_id, duration_minutes) VALUES
(1, 1, 120);

-- 17. Performance Records
INSERT INTO performance_records (student_id, term_name, overall_score) VALUES
(1, 'Fall 2026', 88.5);

-- 18. AI Predictions
INSERT INTO ai_predictions (student_id, predicted_score, risk_level) VALUES
(1, 92.0, 'LOW');

-- 19. Weak Areas
INSERT INTO weak_areas (student_id, subject_id, topic_id, severity) VALUES
(1, 1, 1, 'LOW');

-- 20. Personalized Recommendations
INSERT INTO personalized_recommendations (student_id, recommendation_text) VALUES
(1, 'Great job on Random Forests. Try exploring Neural Networks next.');

-- 21. Notifications
INSERT INTO notifications (user_id, message) VALUES
(3, 'Your assignment "Build a Classifier" has been graded.');
