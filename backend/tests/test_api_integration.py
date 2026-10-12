import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "scikit-learn" in data["ml_engine"]

def test_login_sarah_chen():
    response = client.post("/api/auth/login", json={
        "email": "sarah.chen@stanford.edu",
        "password": "password"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["name"] == "Sarah Chen"

def test_get_topic_mastery_endpoint():
    response = client.get("/api/mastery")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    item = data[0]
    assert "rule_based_mastery" in item
    assert "ml_predicted_mastery" in item
    assert "status" in item

def test_get_weak_areas_with_reasons():
    response = client.get("/api/mastery/weak-areas")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    first_weak = data[0]
    assert "whyWeakExplanation" in first_weak
    assert len(first_weak["criticalGaps"]) > 0

def test_get_recommendations_with_reasoning():
    response = client.get("/api/recommendations")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    rec = data[0]
    assert "aiReasoning" in rec
    assert rec["matchScore"] >= 80

def test_rag_chat_endpoint():
    response = client.post("/api/chat", json={
        "message": "Why scale dot product in transformer attention by sqrt(d_k)?"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["sender"] == "ai"
    assert "text" in data
    assert len(data["rag_sources_used"]) > 0

def test_planner_tasks_and_generation():
    # Test task retrieval
    response = client.get("/api/planner/tasks")
    assert response.status_code == 200
    tasks = response.json()
    assert isinstance(tasks, list)

    # Test auto-generation
    gen_response = client.post("/api/planner/generate", json={
        "available_daily_minutes": 50,
        "prioritize_weak_topics": True
    })
    assert gen_response.status_code == 200
    new_tasks = gen_response.json()
    assert len(new_tasks) > 0
