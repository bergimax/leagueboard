import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

@pytest.fixture
def auth_token():
    response = client.post(
        "/api/auth/login",
        json={"email": "admin@example.com", "password": "password123"}
    )
    return response.json()["access_token"]

def get_headers(token):
    return {"Authorization": f"Bearer {token}"}

class TestLeagues:
    def test_list_leagues(self, auth_token):
        response = client.get(
            "/api/leagues",
            headers=get_headers(auth_token)
        )
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 2
        assert data[0]["name"] == "Local Soccer League"
        assert data[0]["sport"] == "soccer"

    def test_list_leagues_unauthorized(self):
        response = client.get("/api/leagues")
        assert response.status_code == 401

    def test_get_league(self, auth_token):
        response = client.get(
            "/api/leagues/1",
            headers=get_headers(auth_token)
        )
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == 1
        assert data["name"] == "Local Soccer League"

    def test_get_league_not_found(self, auth_token):
        response = client.get(
            "/api/leagues/999",
            headers=get_headers(auth_token)
        )
        assert response.status_code == 404

    def test_create_league(self, auth_token):
        response = client.post(
            "/api/leagues",
            headers=get_headers(auth_token),
            json={
                "name": "New League",
                "sport": "volleyball",
                "season": 2025
            }
        )
        assert response.status_code == 201
        data = response.json()
        assert data["name"] == "New League"
        assert data["sport"] == "volleyball"
        assert data["season"] == 2025
        assert data["id"] is not None

    def test_get_standings(self, auth_token):
        response = client.get(
            "/api/leagues/1/standings",
            headers=get_headers(auth_token)
        )
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) > 0
        # Check first team has all required fields
        standing = data[0]
        assert "team_id" in standing
        assert "team_name" in standing
        assert "points" in standing
        assert "wins" in standing
        assert "losses" in standing
        # Check sorted by points
        points = [s["points"] for s in data]
        assert points == sorted(points, reverse=True)
