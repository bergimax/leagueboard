import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

class TestAuth:
    def test_login_success(self):
        response = client.post(
            "/api/auth/login",
            json={"email": "admin@example.com", "password": "password123"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"
        assert data["user"]["email"] == "admin@example.com"
        assert data["user"]["role"] == "admin"

    def test_login_invalid_email(self):
        response = client.post(
            "/api/auth/login",
            json={"email": "wrong@example.com", "password": "password123"}
        )
        assert response.status_code == 401

    def test_login_invalid_password(self):
        response = client.post(
            "/api/auth/login",
            json={"email": "admin@example.com", "password": "wrongpassword"}
        )
        assert response.status_code == 401

    def test_get_current_user_success(self):
        # First login
        login_response = client.post(
            "/api/auth/login",
            json={"email": "admin@example.com", "password": "password123"}
        )
        token = login_response.json()["access_token"]

        # Then get user
        response = client.get(
            "/api/auth/me",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["email"] == "admin@example.com"
        assert data["role"] == "admin"

    def test_get_current_user_no_token(self):
        response = client.get("/api/auth/me")
        assert response.status_code == 401

    def test_logout(self):
        # Login first
        login_response = client.post(
            "/api/auth/login",
            json={"email": "admin@example.com", "password": "password123"}
        )
        token = login_response.json()["access_token"]

        # Then logout
        response = client.post(
            "/api/auth/logout",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == 200
