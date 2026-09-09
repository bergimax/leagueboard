from flask import Flask, jsonify
from flask_cors import CORS
import sqlite3
import os
from datetime import datetime
from functools import wraps
from flask import request
import jwt

app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = 'your-secret-key-change-this'

DB_PATH = 'leagueboard.db'

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    c = conn.cursor()

    c.execute('''CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'spectator'
    )''')

    c.execute('''CREATE TABLE IF NOT EXISTS leagues (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        sport TEXT NOT NULL,
        season INTEGER NOT NULL
    )''')

    c.execute('''CREATE TABLE IF NOT EXISTS teams (
        id INTEGER PRIMARY KEY,
        league_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        wins INTEGER DEFAULT 0,
        losses INTEGER DEFAULT 0,
        draws INTEGER DEFAULT 0,
        points INTEGER DEFAULT 0,
        FOREIGN KEY (league_id) REFERENCES leagues(id)
    )''')

    c.execute('''CREATE TABLE IF NOT EXISTS games (
        id INTEGER PRIMARY KEY,
        league_id INTEGER NOT NULL,
        home_team_id INTEGER NOT NULL,
        away_team_id INTEGER NOT NULL,
        home_score INTEGER,
        away_score INTEGER,
        date TEXT NOT NULL,
        status TEXT DEFAULT 'scheduled',
        FOREIGN KEY (league_id) REFERENCES leagues(id),
        FOREIGN KEY (home_team_id) REFERENCES teams(id),
        FOREIGN KEY (away_team_id) REFERENCES teams(id)
    )''')

    c.execute('''CREATE TABLE IF NOT EXISTS players (
        id INTEGER PRIMARY KEY,
        team_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        number INTEGER,
        position TEXT,
        FOREIGN KEY (team_id) REFERENCES teams(id)
    )''')

    conn.commit()
    conn.close()

    insert_demo_data()

def insert_demo_data():
    conn = get_db()
    c = conn.cursor()

    try:
        c.execute("SELECT COUNT(*) FROM users")
        if c.fetchone()[0] == 0:
            c.execute("INSERT INTO users (email, password, role) VALUES (?, ?, ?)",
                     ('admin@example.com', 'password123', 'admin'))

            c.execute("INSERT INTO leagues (name, sport, season) VALUES (?, ?, ?)",
                     ('Local Soccer League', 'soccer', 2024))
            league_id = c.lastrowid

            c.execute("INSERT INTO leagues (name, sport, season) VALUES (?, ?, ?)",
                     ('Basketball Championship', 'basketball', 2024))
            league_id2 = c.lastrowid

            team_names = ['Eagles', 'Tigers', 'Wolves', 'Panthers']
            for name in team_names:
                c.execute("INSERT INTO teams (league_id, name) VALUES (?, ?)",
                         (league_id, name))

            team_names2 = ['Warriors', 'Lakers', 'Celtics', 'Nets']
            for name in team_names2:
                c.execute("INSERT INTO teams (league_id, name) VALUES (?, ?)",
                         (league_id2, name))

            c.execute("INSERT INTO games (league_id, home_team_id, away_team_id, home_score, away_score, date, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
                     (league_id, 1, 2, 2, 1, datetime.now().isoformat(), 'finished'))
            c.execute("INSERT INTO games (league_id, home_team_id, away_team_id, date, status) VALUES (?, ?, ?, ?, ?)",
                     (league_id, 3, 4, datetime.now().isoformat(), 'scheduled'))

            conn.commit()
    except Exception as e:
        print(f"Demo data already exists: {e}")
    finally:
        conn.close()

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'error': 'Token missing'}), 401

        try:
            token = token.split(' ')[1]
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            current_user = data
        except Exception as e:
            return jsonify({'error': 'Invalid token'}), 401

        return f(current_user, *args, **kwargs)
    return decorated

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    conn = get_db()
    c = conn.cursor()
    c.execute("SELECT * FROM users WHERE email = ? AND password = ?", (email, password))
    user = c.fetchone()
    conn.close()

    if user:
        token = jwt.encode({
            'id': user['id'],
            'email': user['email'],
            'role': user['role']
        }, app.config['SECRET_KEY'], algorithm='HS256')

        return jsonify({
            'token': token,
            'user': {
                'id': user['id'],
                'email': user['email'],
                'role': user['role']
            }
        })

    return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/api/user', methods=['GET'])
@token_required
def get_user(current_user):
    return jsonify({
        'id': current_user['id'],
        'email': current_user['email'],
        'role': current_user['role']
    })

@app.route('/api/leagues', methods=['GET'])
@token_required
def get_leagues(current_user):
    conn = get_db()
    c = conn.cursor()
    c.execute("SELECT * FROM leagues")
    leagues = [dict(row) for row in c.fetchall()]
    conn.close()
    return jsonify(leagues)

@app.route('/api/leagues/<int:league_id>/standings', methods=['GET'])
@token_required
def get_standings(current_user, league_id):
    conn = get_db()
    c = conn.cursor()

    c.execute("SELECT * FROM leagues WHERE id = ?", (league_id,))
    league = dict(c.fetchone())

    c.execute("""
        SELECT id, name FROM teams WHERE league_id = ? ORDER BY points DESC, wins DESC
    """, (league_id,))

    standings = []
    for team in c.fetchall():
        team_id = team['id']
        c.execute("""
            SELECT COUNT(*) as played,
                   SUM(CASE WHEN (home_team_id = ? AND home_score > away_score) OR
                                 (away_team_id = ? AND away_score > home_score) THEN 1 ELSE 0 END) as wins,
                   SUM(CASE WHEN (home_team_id = ? AND home_score < away_score) OR
                                 (away_team_id = ? AND away_score < home_score) THEN 1 ELSE 0 END) as losses,
                   SUM(CASE WHEN home_score = away_score THEN 1 ELSE 0 END) as draws,
                   SUM(CASE WHEN (home_team_id = ? AND home_score > away_score) OR
                                 (away_team_id = ? AND away_score > home_score) THEN 3 ELSE 0 END) +
                   SUM(CASE WHEN home_score = away_score THEN 1 ELSE 0 END) as points
            FROM games WHERE status = 'finished' AND (home_team_id = ? OR away_team_id = ?)
        """, (team_id, team_id, team_id, team_id, team_id, team_id, team_id, team_id))

        stats = c.fetchone()
        standings.append({
            'team_id': team_id,
            'team_name': team['name'],
            'played': stats['played'] or 0,
            'wins': stats['wins'] or 0,
            'losses': stats['losses'] or 0,
            'draws': stats['draws'] or 0,
            'points': stats['points'] or 0
        })

    conn.close()
    return jsonify({'league': league, 'standings': standings})

@app.route('/api/leagues/<int:league_id>/games', methods=['GET'])
@token_required
def get_games(current_user, league_id):
    conn = get_db()
    c = conn.cursor()

    c.execute("SELECT * FROM leagues WHERE id = ?", (league_id,))
    league = dict(c.fetchone())

    c.execute("""
        SELECT g.id, g.home_team_id, g.away_team_id, g.home_score, g.away_score,
               g.date, g.status, l.name as league_name,
               (SELECT name FROM teams WHERE id = g.home_team_id) as home_team,
               (SELECT name FROM teams WHERE id = g.away_team_id) as away_team
        FROM games g
        JOIN leagues l ON g.league_id = l.id
        WHERE g.league_id = ?
        ORDER BY g.date DESC
    """, (league_id,))

    games = [dict(row) for row in c.fetchall()]
    conn.close()

    return jsonify({'league': league, 'games': games})

@app.route('/api/games/recent', methods=['GET'])
@token_required
def get_recent_games(current_user):
    conn = get_db()
    c = conn.cursor()

    c.execute("""
        SELECT g.id, g.home_score, g.away_score, g.date, l.name as league_name,
               (SELECT name FROM teams WHERE id = g.home_team_id) as home_team,
               (SELECT name FROM teams WHERE id = g.away_team_id) as away_team
        FROM games g
        JOIN leagues l ON g.league_id = l.id
        WHERE g.status = 'finished'
        ORDER BY g.date DESC
        LIMIT 5
    """)

    games = [dict(row) for row in c.fetchall()]
    conn.close()

    return jsonify(games)

@app.route('/api/games/<int:game_id>', methods=['GET'])
@token_required
def get_game(current_user, game_id):
    conn = get_db()
    c = conn.cursor()

    c.execute("""
        SELECT g.*, l.name as league_name,
               (SELECT name FROM teams WHERE id = g.home_team_id) as home_team,
               (SELECT name FROM teams WHERE id = g.away_team_id) as away_team
        FROM games g
        JOIN leagues l ON g.league_id = l.id
        WHERE g.id = ?
    """, (game_id,))

    game = c.fetchone()
    conn.close()

    if game:
        return jsonify(dict(game))
    return jsonify({'error': 'Game not found'}), 404

@app.route('/api/games/<int:game_id>', methods=['PUT'])
@token_required
def update_game(current_user, game_id):
    if current_user['role'] != 'admin':
        return jsonify({'error': 'Unauthorized'}), 403

    data = request.get_json()
    conn = get_db()
    c = conn.cursor()

    c.execute("""
        UPDATE games
        SET home_score = ?, away_score = ?, status = ?
        WHERE id = ?
    """, (data.get('home_score'), data.get('away_score'), data.get('status'), game_id))

    conn.commit()
    conn.close()

    return jsonify({'message': 'Game updated'})

@app.route('/api/teams/<int:team_id>', methods=['GET'])
@token_required
def get_team(current_user, team_id):
    conn = get_db()
    c = conn.cursor()

    c.execute("SELECT * FROM teams WHERE id = ?", (team_id,))
    team = c.fetchone()

    if team:
        team = dict(team)
        c.execute("SELECT * FROM players WHERE team_id = ?", (team_id,))
        team['roster'] = [dict(row) for row in c.fetchall()]

        c.execute("SELECT name FROM leagues WHERE id = ?", (team['league_id'],))
        league = c.fetchone()
        team['league_name'] = league['name'] if league else 'Unknown'

        conn.close()
        return jsonify(team)

    conn.close()
    return jsonify({'error': 'Team not found'}), 404

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'})

if __name__ == '__main__':
    if not os.path.exists(DB_PATH):
        init_db()
    else:
        init_db()
    app.run(debug=True, port=5000)
