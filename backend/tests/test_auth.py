def test_login_success(client):
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

def test_login_invalid_email(client):
    response = client.post(
        "/api/auth/login",
        json={"email": "wrong@example.com", "password": "password123"}
    )
    assert response.status_code == 401

def test_login_invalid_password(client):
    response = client.post(
        "/api/auth/login",
        json={"email": "admin@example.com", "password": "wrongpassword"}
    )
    assert response.status_code == 401

def test_get_current_user_success(client, auth_token):
    response = client.get(
        "/api/auth/me",
        headers={"Authorization": f"Bearer {auth_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "admin@example.com"
    assert data["role"] == "admin"

def test_get_current_user_no_token(client):
    response = client.get("/api/auth/me")
    assert response.status_code == 401

def test_logout(client, auth_token):
    response = client.post(
        "/api/auth/logout",
        headers={"Authorization": f"Bearer {auth_token}"}
    )
    assert response.status_code == 200
