def test_get_recent_games(client, auth_token):
    response = client.get(
        "/api/games",
        headers={"Authorization": f"Bearer {auth_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) <= 5
    for game in data:
        assert game["status"] == "finished"

def test_get_recent_games_with_limit(client, auth_token):
    response = client.get(
        "/api/games?limit=2",
        headers={"Authorization": f"Bearer {auth_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert len(data) <= 2

def test_get_league_games(client, auth_token):
    response = client.get(
        "/api/leagues/1/games",
        headers={"Authorization": f"Bearer {auth_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    for game in data:
        assert game["league_id"] == 1

def test_get_game(client, auth_token):
    response = client.get(
        "/api/games/1",
        headers={"Authorization": f"Bearer {auth_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == 1
    assert data["home_team"] == "Eagles"
    assert data["away_team"] == "Tigers"
    assert data["home_score"] == 2
    assert data["away_score"] == 1
    assert data["status"] == "finished"

def test_get_game_not_found(client, auth_token):
    response = client.get(
        "/api/games/999",
        headers={"Authorization": f"Bearer {auth_token}"}
    )
    assert response.status_code == 404

def test_update_game_success(client, auth_token):
    response = client.put(
        "/api/games/3",
        headers={"Authorization": f"Bearer {auth_token}"},
        json={"home_score": 3, "away_score": 2}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["home_score"] == 3
    assert data["away_score"] == 2
    assert data["status"] == "finished"

def test_update_game_not_found(client, auth_token):
    response = client.put(
        "/api/games/999",
        headers={"Authorization": f"Bearer {auth_token}"},
        json={"home_score": 1, "away_score": 0}
    )
    assert response.status_code == 404

def test_update_game_unauthorized(client):
    response = client.put(
        "/api/games/1",
        json={"home_score": 1, "away_score": 0}
    )
    assert response.status_code == 401
