# Starts backend and frontend for local development
Write-Host "Starting backend (uvicorn) and frontend (vite)"
Push-Location backend
Start-Process powershell -ArgumentList '-NoExit','-Command','python -m venv .venv; if (-not (Test-Path .venv)) { python -m venv .venv }; .\.venv\Scripts\Activate.ps1; pip install -r requirements.txt; uvicorn app.main:app --reload --port 8000'
Pop-Location
Push-Location frontend
Start-Process powershell -ArgumentList '-NoExit','-Command','npm install; npm run dev'
Pop-Location
