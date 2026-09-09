# LeagueBoard Backend API

FastAPI backend for the LeagueBoard sports league scoreboard application.

## Setup

### Prerequisites
- Python 3.11+

### Installation

```bash
# Install dependencies
pip install -e ".[dev]"

# Or install individually
pip install fastapi uvicorn pydantic python-jose[cryptography] pytest pytest-asyncio httpx
```

## Running

```bash
# Start the server
python -m uvicorn app.main:app --reload

# Or run directly
uvicorn app.main:app --reload
```

Server runs on: **http://localhost:8000**

API Docs: **http://localhost:8000/docs** (Swagger UI)

## Testing

```bash
# Run all tests
pytest tests/ -v

# Run specific test file
pytest tests/test_auth.py -v

# Run with coverage
pytest tests/ --cov=app
```

**Current Status:** ✅ All 24 tests passing

## Project Structure

```
backend/
├── app/
│   ├── main.py       # FastAPI application + all endpoints
│   ├── models.py     # Pydantic models
│   ├── auth.py       # JWT authentication
│   ├── database.py   # Mock database
│   └── __init__.py
├── tests/
│   ├── test_auth.py      # Authentication tests (6 tests)
│   ├── test_leagues.py   # League endpoint tests (6 tests)
│   ├── test_games.py     # Game endpoint tests (8 tests)
│   ├── test_teams.py     # Team endpoint tests (4 tests)
│   ├── conftest.py       # Pytest configuration
│   └── __init__.py
├── pyproject.toml    # Project configuration + dependencies
└── pytest.ini        # Pytest configuration
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login and get JWT token
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user info

### Leagues
- `GET /api/leagues` - List all leagues
- `POST /api/leagues` - Create new league
- `GET /api/leagues/{id}` - Get league details
- `GET /api/leagues/{id}/standings` - Get league standings
- `GET /api/leagues/{id}/games` - Get league games

### Games
- `GET /api/games` - Get recent games (limit: 5)
- `GET /api/games/{id}` - Get game details
- `PUT /api/games/{id}` - Update game score (admin only)

### Teams
- `GET /api/teams/{id}` - Get team details with roster

## Demo Credentials

```
Email: admin@example.com
Password: password123
Role: admin
```

## Database

Currently using **mock database** (`app/database.py`). 

To replace with real database:
1. Create database models (SQLAlchemy, etc.)
2. Update `app/database.py` to use actual DB queries
3. Tests will work unchanged (mock the DB layer)

## Architecture

- **Framework:** FastAPI (async, modern, fast)
- **Auth:** JWT tokens with Bearer scheme
- **Validation:** Pydantic models
- **Testing:** pytest + httpx test client
- **Database:** Mock (replaceable with SQLAlchemy, Tortoise, etc.)

## Key Features

✅ Complete REST API from OpenAPI spec  
✅ JWT authentication with Bearer tokens  
✅ Role-based access control (admin/spectator)  
✅ Comprehensive test suite (24 tests, all passing)  
✅ Mock database ready for replacement  
✅ Automatic API documentation (Swagger UI)  
✅ Error handling and validation  

## Environment Variables

Currently using hardcoded values. For production, create `.env`:

```
SECRET_KEY=your-secret-key-here
DATABASE_URL=sqlite:///./leagueboard.db
```

Update `app/auth.py` to use `os.getenv()`.

## Next Steps

1. Replace mock database with real database (PostgreSQL, MongoDB, etc.)
2. Add bcrypt password hashing in auth
3. Add refresh tokens
4. Add input validation and error handling
5. Add logging
6. Add CORS configuration for specific domains
7. Deploy to production server
