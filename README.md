# LeagueBoard - Sports League Scoreboard

A lightweight, web-based scoreboard application for managing local sports leagues.

**Tech Stack:**
- Frontend: React + Vite + Tailwind CSS
- Backend: Python Flask + SQLite
- Auth: JWT

## Setup

### Prerequisites
- Node.js 16+ (for frontend)
- Python 3.8+ (for backend)
- npm (for frontend dependencies)

### Backend Setup

```bash
cd leagueboard-backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the server
python app.py
```

Backend runs on `http://localhost:5000`

### Frontend Setup

```bash
cd leagueboard-frontend

# Install dependencies
npm install

# Run dev server
npm run dev
```

Frontend runs on `http://localhost:5173` (Vite default)

## Demo Credentials

- Email: `admin@example.com`
- Password: `password123`
- Role: Admin (can update scores)

## Features

### Public (No Login Required)
- View league standings
- Browse game schedules
- See game results

### Admin Only
- Update game scores
- Manage teams and leagues
- View admin panel

## API Endpoints

### Auth
- `POST /api/login` - User login
- `GET /api/user` - Get current user (requires token)

### Leagues
- `GET /api/leagues` - List all leagues
- `GET /api/leagues/<id>/standings` - Get league standings
- `GET /api/leagues/<id>/games` - Get league schedule

### Games
- `GET /api/games/recent` - Get recent games
- `GET /api/games/<id>` - Get game details
- `PUT /api/games/<id>` - Update game (admin only)

### Teams
- `GET /api/teams/<id>` - Get team profile

## Project Structure

```
leagueboard-backend/
├── app.py              # Main Flask app
├── requirements.txt    # Python dependencies
└── leagueboard.db      # SQLite database

leagueboard-frontend/
├── src/
│   ├── components/     # Reusable components
│   ├── pages/          # Page components
│   ├── App.jsx         # Root component
│   └── main.jsx        # Entry point
├── package.json        # Node dependencies
└── vite.config.js      # Vite configuration
```

## Development Notes

### Adding New Features

1. Add database schema in `app.py` if needed
2. Create API endpoint in Flask
3. Create React component/page
4. Connect frontend to API

### Environment Variables

Backend `.env` (optional):
```
FLASK_ENV=development
SECRET_KEY=your-secret-key
```

## Deployment

### Frontend (Vercel)
```bash
cd leagueboard-frontend
npm run build
# Deploy build/ folder to Vercel
```

### Backend (Railway/Heroku)
```bash
cd leagueboard-backend
# Push to Railway/Heroku
```

## License

MIT
