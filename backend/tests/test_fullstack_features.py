import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.config import settings

client = TestClient(app)

# Helper to obtain a student token
def get_student_token():
    res = client.post("/api/auth/login", json={
        "email": "sarah.chen@stanford.edu",
        "password": "password"
    })
    return res.json()["access_token"]

# Helper to obtain an admin token
def get_admin_token():
    res = client.post("/api/auth/login", json={
        "email": "m.vance@cognilearn.ai",
        "password": "password"
    })
    return res.json()["access_token"]

def test_login_success_and_cookie():
    response = client.post("/api/auth/login", json={
        "email": "sarah.chen@stanford.edu",
        "password": "password"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["email"] == "sarah.chen@stanford.edu"
    assert data["role"] == "student"
    # Verify HttpOnly session cookie was set
    assert settings.SESSION_COOKIE_NAME in response.cookies

def test_login_invalid_credentials():
    response = client.post("/api/auth/login", json={
        "email": "sarah.chen@stanford.edu",
        "password": "wrong_password_123"
    })
    assert response.status_code == 401
    assert "Invalid email or password" in response.json()["detail"]

def test_register_duplicate_email():
    response = client.post("/api/auth/register", json={
        "name": "Sarah Chen Duplicate",
        "email": "sarah.chen@stanford.edu",
        "password": "newpassword123"
    })
    assert response.status_code == 400
    assert "already exists" in response.json()["detail"]

def test_logout_terminates_session():
    # Login first
    login_res = client.post("/api/auth/login", json={
        "email": "sarah.chen@stanford.edu",
        "password": "password"
    })
    assert login_res.status_code == 200
    
    # Logout
    logout_res = client.post("/api/auth/logout")
    assert logout_res.status_code == 200
    assert logout_res.json()["status"] == "success"

def test_auth_me_requires_authentication():
    # Calling /api/auth/me without any token or session cookie
    response = client.get("/api/auth/me")
    assert response.status_code == 401
    assert "Authentication required" in response.json()["detail"]

def test_auth_me_with_valid_bearer_token():
    token = get_student_token()
    response = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    user_data = response.json()
    assert user_data["name"] == "Sarah Chen"
    assert user_data["role"] == "student"

def test_dashboard_summary_endpoint():
    token = get_student_token()
    response = client.get("/api/dashboard", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    data = response.json()
    assert "student_name" in data
    assert data["student_name"] == "Sarah Chen"
    assert "overall_progress_pct" in data
    assert "weekly_activity" in data
    assert len(data["weekly_activity"]) == 7
    assert "weak_topics" in data
    assert "upcoming_tasks" in data
    assert "active_courses" in data

def test_course_module_completion_toggle():
    token = get_student_token()
    # List courses
    courses_res = client.get("/api/courses")
    assert courses_res.status_code == 200
    courses = courses_res.json()
    assert len(courses) > 0
    first_course = courses[0]
    assert len(first_course["modules"]) > 0
    first_module = first_course["modules"][0]

    # Toggle module status
    toggle_res = client.post(
        f"/api/courses/{first_course['id']}/modules/{first_module['id']}/toggle",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert toggle_res.status_code == 200
    updated_mod = toggle_res.json()
    assert updated_mod["id"] == first_module["id"]
    assert "completed" in updated_mod

def test_admin_access_restrictions():
    student_token = get_student_token()
    admin_token = get_admin_token()

    # 1. Student attempting to access admin stats -> MUST receive 403 Forbidden
    student_forbidden = client.get(
        "/api/admin/stats",
        headers={"Authorization": f"Bearer {student_token}"}
    )
    assert student_forbidden.status_code == 403
    assert "Administrative privileges required" in student_forbidden.json()["detail"]

    # 2. Student attempting to access admin users -> MUST receive 403 Forbidden
    student_users_forbidden = client.get(
        "/api/admin/users",
        headers={"Authorization": f"Bearer {student_token}"}
    )
    assert student_users_forbidden.status_code == 403

    # 3. Admin accessing admin stats -> 200 OK
    admin_allowed = client.get(
        "/api/admin/stats",
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert admin_allowed.status_code == 200
    assert "totalStudents" in admin_allowed.json()

    # 4. Admin accessing admin users -> 200 OK
    admin_users_allowed = client.get(
        "/api/admin/users",
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert admin_users_allowed.status_code == 200
    assert isinstance(admin_users_allowed.json(), list)

def test_invalid_resource_not_found():
    # Test querying non-existent course returns clean 404
    response = client.get("/api/courses/non-existent-course-id-999")
    assert response.status_code == 404
    assert response.json()["detail"] == "Course not found"
