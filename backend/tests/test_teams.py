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

class TestTeams:
    def test_get_team(self, auth_token):
        response = client.get(
            "/api/teams/1",
            headers=get_headers(auth_token)
        )
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == 1
        assert data["name"] == "Eagles"
        assert data["league_id"] == 1
        assert data["wins"] == 5
        assert data["losses"] == 2
        assert data["draws"] == 1
        assert data["points"] == 16

    def test_get_team_with_roster(self, auth_token):
        response = client.get(
            "/api/teams/1",
            headers=get_headers(auth_token)
        )
        assert response.status_code == 200
        data = response.json()
        assert "roster" in data
        assert isinstance(data["roster"], list)
        if data["roster"]:
            player = data["roster"][0]
            assert "id" in player
            assert "name" in player
            assert "number" in player
            assert "position" in player

    def test_get_team_not_found(self, auth_token):
        response = client.get(
            "/api/teams/999",
            headers=get_headers(auth_token)
        )
        assert response.status_code == 404

    def test_get_team_unauthorized(self):
        response = client.get("/api/teams/1")
        assert response.status_code == 401
