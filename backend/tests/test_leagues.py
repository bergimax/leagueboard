def test_list_leagues(client, auth_token):
    response = client.get(
        "/api/leagues",
        headers={"Authorization": f"Bearer {auth_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 2
    assert data[0]["name"] == "Local Soccer League"
    assert data[0]["sport"] == "soccer"

def test_list_leagues_unauthorized(client):
    response = client.get("/api/leagues")
    assert response.status_code == 401

def test_get_league(client, auth_token):
    response = client.get(
        "/api/leagues/1",
        headers={"Authorization": f"Bearer {auth_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == 1
    assert data["name"] == "Local Soccer League"

def test_get_league_not_found(client, auth_token):
    response = client.get(
        "/api/leagues/999",
        headers={"Authorization": f"Bearer {auth_token}"}
    )
    assert response.status_code == 404

def test_create_league(client, auth_token):
    response = client.post(
        "/api/leagues",
        headers={"Authorization": f"Bearer {auth_token}"},
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

def test_get_standings(client, auth_token):
    response = client.get(
        "/api/leagues/1/standings",
        headers={"Authorization": f"Bearer {auth_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    standing = data[0]
    assert "team_id" in standing
    assert "team_name" in standing
    assert "points" in standing
    assert "wins" in standing
    assert "losses" in standing
    # Check sorted by points
    points = [s["points"] for s in data]
    assert points == sorted(points, reverse=True)
