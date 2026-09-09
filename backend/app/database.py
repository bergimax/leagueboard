from sqlalchemy.orm import Session
from sqlalchemy import desc
from datetime import datetime
from .models import User, UserRole, League, Sport, Team, Game, GameStatus, Player
from .db_models import UserDB, LeagueDB, TeamDB, PlayerDB, GameDB

class Database:
    """Database abstraction layer - database-agnostic using SQLAlchemy"""

    def __init__(self, db: Session):
        self.db = db

    def get_user_by_email(self, email: str) -> dict | None:
        user = self.db.query(UserDB).filter(UserDB.email == email).first()
        if user:
            return {
                "id": user.id,
                "email": user.email,
                "password_hash": user.password_hash,
                "role": user.role
            }
        return None

    def get_user_by_id(self, user_id: int) -> dict | None:
        user = self.db.query(UserDB).filter(UserDB.id == user_id).first()
        if user:
            return {
                "id": user.id,
                "email": user.email,
                "password_hash": user.password_hash,
                "role": user.role
            }
        return None

    def get_league(self, league_id: int) -> League | None:
        league = self.db.query(LeagueDB).filter(LeagueDB.id == league_id).first()
        if league:
            return League(id=league.id, name=league.name, sport=league.sport, season=league.season)
        return None

    def get_all_leagues(self) -> list[League]:
        leagues = self.db.query(LeagueDB).all()
        return [League(id=l.id, name=l.name, sport=l.sport, season=l.season) for l in leagues]

    def create_league(self, league: League) -> League:
        db_league = LeagueDB(name=league.name, sport=league.sport, season=league.season)
        self.db.add(db_league)
        self.db.commit()
        self.db.refresh(db_league)
        return League(id=db_league.id, name=db_league.name, sport=db_league.sport, season=db_league.season)

    def get_games_by_league(self, league_id: int) -> list[Game]:
        games = self.db.query(GameDB).filter(GameDB.league_id == league_id).all()
        return [self._game_db_to_model(g) for g in games]

    def get_recent_games(self, limit: int = 5) -> list[Game]:
        games = (
            self.db.query(GameDB)
            .filter(GameDB.status == GameStatus.FINISHED)
            .order_by(desc(GameDB.date))
            .limit(limit)
            .all()
        )
        return [self._game_db_to_model(g) for g in games]

    def get_game(self, game_id: int) -> Game | None:
        game = self.db.query(GameDB).filter(GameDB.id == game_id).first()
        if game:
            return self._game_db_to_model(game)
        return None

    def update_game(self, game_id: int, home_score: int, away_score: int) -> Game | None:
        game = self.db.query(GameDB).filter(GameDB.id == game_id).first()
        if game:
            game.home_score = home_score
            game.away_score = away_score
            game.status = GameStatus.FINISHED
            self.db.commit()
            self.db.refresh(game)
            return self._game_db_to_model(game)
        return None

    def get_team(self, team_id: int) -> Team | None:
        team = self.db.query(TeamDB).filter(TeamDB.id == team_id).first()
        if team:
            roster = self.db.query(PlayerDB).filter(PlayerDB.team_id == team_id).all()
            players = [Player(id=p.id, name=p.name, number=p.number, position=p.position) for p in roster]
            return Team(
                id=team.id,
                league_id=team.league_id,
                name=team.name,
                wins=team.wins,
                losses=team.losses,
                draws=team.draws,
                points=team.points,
                roster=players
            )
        return None

    def get_standings(self, league_id: int) -> list[dict]:
        teams = self.db.query(TeamDB).filter(TeamDB.league_id == league_id).all()
        standings = []
        for team in teams:
            standings.append({
                "team_id": team.id,
                "team_name": team.name,
                "played": team.wins + team.losses + team.draws,
                "wins": team.wins,
                "losses": team.losses,
                "draws": team.draws,
                "points": team.points
            })
        return sorted(standings, key=lambda x: x["points"], reverse=True)

    @staticmethod
    def _game_db_to_model(game: GameDB) -> Game:
        home_team = game.home_team.name if game.home_team else "Unknown"
        away_team = game.away_team.name if game.away_team else "Unknown"
        return Game(
            id=game.id,
            league_id=game.league_id,
            home_team_id=game.home_team_id,
            away_team_id=game.away_team_id,
            home_team=home_team,
            away_team=away_team,
            home_score=game.home_score,
            away_score=game.away_score,
            date=game.date,
            status=game.status
        )


def seed_database(db: Session, commit=True):
    """Seed database with demo data"""
    # Check if data exists
    if db.query(LeagueDB).first():
        return  # Already seeded

    # Create user
    user = UserDB(email="admin@example.com", password_hash="password123", role=UserRole.ADMIN)
    db.add(user)
    db.flush()

    # Create leagues
    league1 = LeagueDB(name="Local Soccer League", sport=Sport.SOCCER, season=2024)
    league2 = LeagueDB(name="Basketball Championship", sport=Sport.BASKETBALL, season=2024)
    db.add(league1)
    db.add(league2)
    db.flush()

    # Create teams
    teams_data = [
        (league1.id, "Eagles", 5, 2, 1, 16),
        (league1.id, "Tigers", 4, 2, 2, 14),
        (league1.id, "Wolves", 3, 4, 1, 10),
        (league1.id, "Panthers", 2, 5, 1, 7),
        (league2.id, "Warriors", 6, 1, 0, 18),
        (league2.id, "Lakers", 5, 2, 0, 15),
        (league2.id, "Celtics", 4, 3, 0, 12),
        (league2.id, "Nets", 1, 6, 0, 3),
    ]

    teams = []
    for league_id, name, wins, losses, draws, points in teams_data:
        team = TeamDB(league_id=league_id, name=name, wins=wins, losses=losses, draws=draws, points=points)
        db.add(team)
        teams.append(team)
    db.flush()

    # Create players for some teams
    players_data = [
        (teams[0].id, "John Smith", 7, "Forward"),
        (teams[0].id, "Mike Johnson", 10, "Midfielder"),
        (teams[0].id, "David Brown", 1, "Goalkeeper"),
        (teams[4].id, "Stephen Curry", 30, "Point Guard"),
        (teams[4].id, "Klay Thompson", 11, "Shooting Guard"),
        (teams[4].id, "Draymond Green", 23, "Power Forward"),
    ]

    for team_id, name, number, position in players_data:
        player = PlayerDB(team_id=team_id, name=name, number=number, position=position)
        db.add(player)

    db.flush()

    # Create games
    games_data = [
        (league1.id, teams[0].id, teams[1].id, 2, 1, datetime(2024, 9, 5, 15, 0), GameStatus.FINISHED),
        (league1.id, teams[2].id, teams[3].id, 1, 0, datetime(2024, 9, 6, 16, 0), GameStatus.FINISHED),
        (league1.id, teams[0].id, teams[2].id, None, None, datetime(2024, 9, 12, 15, 0), GameStatus.SCHEDULED),
        (league2.id, teams[4].id, teams[5].id, 108, 95, datetime(2024, 9, 8, 19, 0), GameStatus.FINISHED),
        (league2.id, teams[6].id, teams[7].id, None, None, datetime(2024, 9, 13, 19, 30), GameStatus.SCHEDULED),
    ]

    for league_id, home_team_id, away_team_id, home_score, away_score, date, status in games_data:
        game = GameDB(
            league_id=league_id,
            home_team_id=home_team_id,
            away_team_id=away_team_id,
            home_score=home_score,
            away_score=away_score,
            date=date,
            status=status
        )
        db.add(game)

    if commit:
        db.commit()
