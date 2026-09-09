# LeagueBoard - Specifications

## Project Overview
**Name:** LeagueBoard  
**Tagline:** Simple, lightweight scoreboard for local sports leagues  
**Type:** Web-based application for managing and viewing sports league standings, schedules, and game scores  
**Scope:** Local community leagues (5–50 teams)

## User Roles & Access

### League Administrator
- Create and manage leagues/seasons
- Add/edit teams and players
- Schedule games
- Update game scores (manually, post-game)
- View all league data and reports

### Spectator (Fans, Broadcasters, Coaches)
- View league standings
- Browse game schedule
- See final scores and results
- View basic player stats
- No write access

## Core Features

### Phase 1 (MVP) - High Priority
- League dashboard with standings
- Game schedule view
- Manual score entry (admin only)
- Basic game detail page (final scores)
- Login/authentication
- Responsive design (mobile-friendly)

### Phase 2 (Future) - Medium Priority
- Player statistics and profiles
- Season archives
- League rules/info page
- Score notifications (email digest)

### Phase 3 (Polish) - Low Priority
- Custom league branding
- Advanced analytics/charts
- Mobile app
- Social sharing

## Key Pages & Views

| Page | User Type | Purpose |
|------|-----------|---------|
| Home/Dashboard | All | Overview: standings, upcoming games, latest results |
| Standings | All | Ranked teams by wins/points/divisions |
| Schedule | All | Full season schedule, filter by date/team |
| Game Detail | All | Final score, stats, attendance, play notes |
| Admin Panel | Admin | Score entry, team/player management, season setup |
| Team Profile | All | Team info, roster, season record, recent games |

## Multi-Sport Support

Customizable per league:

| Sport | Scoring | Key Stats |
|-------|---------|-----------|
| Soccer | Goals (1 pt) | Goals, assists, cards (yellow/red) |
| Basketball | Points (2 or 3 per basket) | Points, rebounds, assists, fouls |
| Volleyball | Sets and points | Sets, aces, blocks, kills |
| Baseball | Runs (1 pt) | Runs, hits, innings |

## Tech Stack

| Component | Choice | Rationale |
|-----------|--------|-----------|
| Frontend | React | Popular, extensive resources, Vercel free hosting |
| Backend | Python + Flask | Simple, fast development, minimal boilerplate |
| Database | SQLite | Zero setup, file-based, perfect for local leagues |
| Hosting | Vercel (Frontend) + Railway (Backend) | Generous free tiers, integrated CI/CD |
| Styling | Tailwind CSS | Rapid development, reusable components, lightweight build |
| Authentication | JWT | Simple implementation, secure |

## Data Model

- **Leagues:** name, sport, season, rules
- **Teams:** name, logo, home field, roster
- **Players:** name, number, position
- **Games:** date, time, home/away teams, score, status
- **Stats:** player performance per game (sport-specific)
- **Users:** email, role (admin/spectator), permissions

## Success Criteria

- Admins can set up a league and schedule games in under 10 minutes
- Spectators can view standings and scores without login
- Mobile-responsive (works on phones/tablets)
- Fast load times (<2 sec homepage)
- No admin overhead (minimal maintenance)
- Free or ~$5–10/month hosting cost

## Out of Scope (v1)

- ❌ Real-time live updates
- ❌ Mobile app (web only)
- ❌ Video/streaming integration
- ❌ Advanced analytics
- ❌ Payment processing
- ❌ Complex permission system

## Estimated Costs

- **Vercel:** Free (frontend)
- **Railway:** ~$5/month (backend Flask + database)
- **Total:** ~$5/month
