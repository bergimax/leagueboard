import os
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from fastapi.testclient import TestClient
from app.main import app
from app.db_models import Base
from app.db import get_db
from app.database import seed_database

# Set testing environment
os.environ["ENV"] = "testing"

@pytest.fixture(scope="session")
def engine_setup():
    """Setup test database engine once per session"""
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False}
    )
    Base.metadata.create_all(bind=engine)
    yield engine
    engine.dispose()

@pytest.fixture
def db(engine_setup) -> Session:
    """Provide a fresh database session for each test"""
    SessionLocal = sessionmaker(
        autocommit=False,
        autoflush=False,
        bind=engine_setup
    )
    session = SessionLocal()

    # Seed with demo data but don't commit (use test transaction)
    seed_database(session, commit=False)
    session.flush()  # Flush to get IDs but don't commit

    yield session

    # Cleanup - rollback everything
    session.rollback()
    session.close()

@pytest.fixture
def client(db: Session):
    """Provide a test client with database override"""
    def override_get_db():
        yield db

    app.dependency_overrides[get_db] = override_get_db
    test_client = TestClient(app)
    yield test_client
    app.dependency_overrides.clear()

@pytest.fixture
def auth_token(client):
    """Get authentication token"""
    response = client.post(
        "/api/auth/login",
        json={"email": "admin@example.com", "password": "password123"}
    )
    assert response.status_code == 200
    return response.json()["access_token"]
