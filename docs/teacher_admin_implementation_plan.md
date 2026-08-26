# Teacher & Admin Dashboards Implementation Plan

Building the Teacher and Admin portals requires strict security. We must ensure that Students cannot access Teacher tools, and Teachers cannot access Admin privileges. To achieve this, we will implement robust **Role-Based Access Control (RBAC)** across the entire stack.

Because you requested to build one module at a time, here is the roadmap we will follow.

## Module 1: Authentication & RBAC Core
Before we build the dashboards, we must secure the system.
*   **Backend (FastAPI)**: 
    *   Create JWT token generation logic that includes the user's `role` (`student`, `teacher`, `admin`) in the payload.
    *   Create FastAPI dependency functions (e.g., `require_teacher()`, `require_admin()`) to lock down API endpoints.
*   **Frontend (React)**: 
    *   Implement an `AuthContext` to store the JWT and the current user's role globally.
    *   Create a `<ProtectedRoute>` wrapper component to prevent unauthorized users from viewing the Teacher/Admin pages.

## Module 2: The Teacher Module
Once the system is secure, we will build the Teacher tools.
*   **Backend APIs**:
    *   `GET /api/teacher/students` (Fetch students in the teacher's subjects).
    *   `POST /api/teacher/marks` (Submit grades for quizzes/assignments).
    *   `GET /api/teacher/at-risk` (Fetch ML predictions highlighting struggling students).
*   **React Pages**:
    *   `TeacherDashboard.jsx`: Overview of classes, average performance, and a prioritized list of "At-Risk Students".
    *   `ClassManagement.jsx`: Interfaces to add subjects, lessons, and quizzes.
    *   `Gradebook.jsx`: Data entry forms for marks and attendance.

## Module 3: The Admin Module
Finally, we will build the highest-level access tools.
*   **Backend APIs**:
    *   `GET /api/admin/users` (List all users).
    *   `POST /api/admin/users` (Create new teachers/admins).
    *   `GET /api/admin/stats` (Fetch system-wide statistics).
*   **React Pages**:
    *   `AdminDashboard.jsx`: High-level metrics (Total Users, Active Subjects, System Health).
    *   `UserManagement.jsx`: Data tables to manage, edit, and delete user accounts across the platform.

---

> [!IMPORTANT]
> **User Review Required**
> 
> Please review this phased roadmap. Building the RBAC security (Module 1) is mandatory before we expose API endpoints for adding marks or deleting users.
> 
> **If you approve this plan, we will start immediately with Module 1 (Backend JWT Auth & Frontend Protected Routes). Let me know!**
