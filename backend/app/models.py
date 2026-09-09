from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from enum import Enum

class UserRole(str, Enum):
    ADMIN = "admin"
    SPECTATOR = "spectator"

class Sport(str, Enum):
    SOCCER = "soccer"
    BASKETBALL = "basketball"
    VOLLEYBALL = "volleyball"
    BASEBALL = "baseball"

class GameStatus(str, Enum):
    SCHEDULED = "scheduled"
    FINISHED = "finished"

# Auth Models
class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class User(BaseModel):
    id: int
    email: str
    role: UserRole

class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    user: User

# League Models
class League(BaseModel):
    id: int
    name: str
    sport: Sport
    season: int

class CreateLeagueRequest(BaseModel):
    name: str
    sport: Sport
    season: int

# Team Models
class Player(BaseModel):
    id: int
    name: str
    number: int
    position: str

class Team(BaseModel):
    id: int
    league_id: int
    name: str
    wins: int
    losses: int
    draws: int
    points: int
    roster: Optional[list[Player]] = None

# Game Models
class Game(BaseModel):
    id: int
    league_id: int
    home_team_id: int
    away_team_id: int
    home_team: str
    away_team: str
    home_score: Optional[int] = None
    away_score: Optional[int] = None
    date: datetime
    status: GameStatus

class UpdateGameRequest(BaseModel):
    home_score: int
    away_score: int

# Standing Models
class Standing(BaseModel):
    team_id: int
    team_name: str
    played: int
    wins: int
    losses: int
    draws: int
    points: int
