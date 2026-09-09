from fastapi import FastAPI, HTTPException, status, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from .models import (
    LoginRequest, LoginResponse, User, League, CreateLeagueRequest,
    Game, UpdateGameRequest, Team, Standing
)
from .database import Database, seed_database
from .db import get_db, init_db
from .auth import create_access_token, get_current_user, require_admin, UserRole

app = FastAPI(
    title="LeagueBoard API",
    version="1.0.0",
    description="Sports League Scoreboard API"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database on startup (skip in tests)
@app.on_event("startup")
def startup_event():
    import os
    if os.getenv("ENV") != "testing":
        init_db()
        try:
            db = next(get_db())
            from .db_models import LeagueDB
            if db.query(LeagueDB).first() is None:
                seed_database(db)
        except:
            pass

# ============= Auth Endpoints =============

@app.post("/api/auth/login", response_model=LoginResponse)
async def login(credentials: LoginRequest, db: Session = Depends(get_db)):
    """User login"""
    database = Database(db)
    user = database.get_user_by_email(credentials.email)
    if not user or user["password_hash"] != credentials.password:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token(user["id"], user["email"], user["role"])
    return LoginResponse(
        access_token=token,
        token_type="bearer",
        user=User(id=user["id"], email=user["email"], role=user["role"])
    )

@app.post("/api/auth/logout")
async def logout(current_user: dict = Depends(get_current_user)):
    """User logout"""
    return {"message": "Logout successful"}

@app.get("/api/auth/me", response_model=User)
async def get_me(current_user: dict = Depends(get_current_user)):
    """Get current user"""
    return User(
        id=current_user["id"],
        email=current_user["email"],
        role=current_user["role"]
    )

# ============= League Endpoints =============

@app.get("/api/leagues", response_model=list[League])
async def list_leagues(current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    """List all leagues"""
    database = Database(db)
    return database.get_all_leagues()

@app.post("/api/leagues", response_model=League, status_code=201)
async def create_league(
    league_data: CreateLeagueRequest,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new league"""
    database = Database(db)
    league = League(id=0, **league_data.model_dump())
    return database.create_league(league)

@app.get("/api/leagues/{league_id}", response_model=League)
async def get_league(league_id: int, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get league details"""
    database = Database(db)
    league = database.get_league(league_id)
    if not league:
        raise HTTPException(status_code=404, detail="League not found")
    return league

@app.get("/api/leagues/{league_id}/standings", response_model=list[Standing])
async def get_standings(league_id: int, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get league standings"""
    database = Database(db)
    league = database.get_league(league_id)
    if not league:
        raise HTTPException(status_code=404, detail="League not found")

    standings = database.get_standings(league_id)
    return [Standing(**s) for s in standings]

@app.get("/api/leagues/{league_id}/games", response_model=list[Game])
async def get_league_games(league_id: int, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get league games"""
    database = Database(db)
    league = database.get_league(league_id)
    if not league:
        raise HTTPException(status_code=404, detail="League not found")

    return database.get_games_by_league(league_id)

# ============= Game Endpoints =============

@app.get("/api/games", response_model=list[Game])
async def get_recent_games(
    limit: int = Query(5, ge=1, le=100),
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get recent games"""
    database = Database(db)
    return database.get_recent_games(limit)

@app.get("/api/games/{game_id}", response_model=Game)
async def get_game(game_id: int, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get game details"""
    database = Database(db)
    game = database.get_game(game_id)
    if not game:
        raise HTTPException(status_code=404, detail="Game not found")
    return game

@app.put("/api/games/{game_id}", response_model=Game)
async def update_game(
    game_id: int,
    update_data: UpdateGameRequest,
    current_user: dict = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Update game score (admin only)"""
    database = Database(db)
    game = database.update_game(game_id, update_data.home_score, update_data.away_score)
    if not game:
        raise HTTPException(status_code=404, detail="Game not found")
    return game

# ============= Team Endpoints =============

@app.get("/api/teams/{team_id}", response_model=Team)
async def get_team(team_id: int, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get team details"""
    database = Database(db)
    team = database.get_team(team_id)
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    return team

# ============= Health Check =============

@app.get("/health")
async def health():
    """Health check endpoint"""
    return {"status": "ok"}
