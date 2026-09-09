from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime
from .models import UserRole, Sport, GameStatus

Base = declarative_base()

class UserDB(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    role = Column(SQLEnum(UserRole), default=UserRole.SPECTATOR)

class LeagueDB(Base):
    __tablename__ = "leagues"

    id = Column(Integer, primary_key=True)
    name = Column(String, index=True)
    sport = Column(SQLEnum(Sport))
    season = Column(Integer)

    teams = relationship("TeamDB", back_populates="league")
    games = relationship("GameDB", back_populates="league")

class TeamDB(Base):
    __tablename__ = "teams"

    id = Column(Integer, primary_key=True)
    league_id = Column(Integer, ForeignKey("leagues.id"))
    name = Column(String, index=True)
    wins = Column(Integer, default=0)
    losses = Column(Integer, default=0)
    draws = Column(Integer, default=0)
    points = Column(Integer, default=0)

    league = relationship("LeagueDB", back_populates="teams")
    players = relationship("PlayerDB", back_populates="team")
    home_games = relationship("GameDB", foreign_keys="GameDB.home_team_id", back_populates="home_team")
    away_games = relationship("GameDB", foreign_keys="GameDB.away_team_id", back_populates="away_team")

class PlayerDB(Base):
    __tablename__ = "players"

    id = Column(Integer, primary_key=True)
    team_id = Column(Integer, ForeignKey("teams.id"))
    name = Column(String)
    number = Column(Integer)
    position = Column(String)

    team = relationship("TeamDB", back_populates="players")

class GameDB(Base):
    __tablename__ = "games"

    id = Column(Integer, primary_key=True)
    league_id = Column(Integer, ForeignKey("leagues.id"))
    home_team_id = Column(Integer, ForeignKey("teams.id"))
    away_team_id = Column(Integer, ForeignKey("teams.id"))
    home_score = Column(Integer, nullable=True)
    away_score = Column(Integer, nullable=True)
    date = Column(DateTime, index=True)
    status = Column(SQLEnum(GameStatus), default=GameStatus.SCHEDULED)

    league = relationship("LeagueDB", back_populates="games")
    home_team = relationship("TeamDB", foreign_keys=[home_team_id], back_populates="home_games")
    away_team = relationship("TeamDB", foreign_keys=[away_team_id], back_populates="away_games")
