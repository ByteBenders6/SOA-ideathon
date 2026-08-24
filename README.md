<<<<<<< HEAD
# SOA-Ideathon
=======
# TourSphere — Connected Project

Architecture:
Frontend (served by Node) -> Node/Express backend on port 8000
Node backend -> PostgreSQL database
Node backend -> AIML Flask API on port 8001

## Before running
1. Install Node.js and PostgreSQL.
2. Create `backend/.env` from `backend/.env.example`.
3. Put your actual PostgreSQL password in `DB_PASSWORD`.
4. Put your OpenWeather API key in `aiml/.env`.

## Terminal 1 — Database + Node backend
```powershell
cd backend
npm.cmd install
npm.cmd run seed
npm.cmd start
```

Expected:
`Server running on http://localhost:8000`
`PostgreSQL connected!`

## Terminal 2 — AIML service
```powershell
cd aiml
python -m pip install -r requirements.txt
python api_server.py
```

Expected AIML health URL:
`http://127.0.0.1:8001/health`

## Open the website
Open:
`http://localhost:8000`

Do NOT use VS Code Go Live. The Node backend serves the frontend and API routes together.

## Checks
- http://localhost:8000/api/health
- http://127.0.0.1:8001/health
- http://localhost:8000/api/destinations

## Features connected
- AI search: frontend -> `/api/ai/search` -> AIML service
- Explore state buttons: frontend -> PostgreSQL via `/api/destinations/state/:state`
- Destination API routes fixed to match the seeded database schema.
>>>>>>> 0be3470 (Deploy TourSphere)
