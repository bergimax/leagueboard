import pytest
from app.database import MockDatabase

@pytest.fixture
def mock_db():
    return MockDatabase()
