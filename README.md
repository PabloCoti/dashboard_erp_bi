# Dashboard ERP BI — Docker Setup Guide

This repository contains a small monorepo with a FastAPI backend and a React frontend. This README provides a step-by-step, Docker first setup so reviewers or evaluators can run the project from scratch using `docker compose`.

## Assumptions I made

- I focused the development effort on meeting the requirements and keeping the setup as simple as possible, so it's not optimal for production use.
- The documentation and guides should be in English for wider accessibility.
- The `docker-compose.yml` is already set up at the project root to orchestrate both backend and frontend services. Uses hardcoded ports `8000` (backend) and `3000` (frontend). For simplicity, no environment variables or `.env` files are used because the project is for demo purposes.
- The devs want to run the project in a windows Powershell environment, so commands are tailored for that shell. (Didn't use Linux or WSL to keep the setup as simple as possible).
- The .envs or secrets management is not included for simplicity, as this is a demo project, but should be considered for real project usage and setup.

## Project setup

Prerequisites

- Docker Desktop (or Docker Engine) installed and running on your machine.
- Git (To clone the repository).

Step-by-step: run the project with Docker

1. Clone the repository (if you haven't already):

```powershell
git clone <repo-url> dashboard_erp_bi
cd dashboard_erp_bi
```

2. (Optional) Inspect the `docker-compose.yml` at the project root to verify the service ports and volumes. And to verify that the ports `8000` and `3000` are free on your host machine.

3. Build and start the application using Docker Compose:

```powershell
docker compose up -d --build
```

This will build two images and create two containers:

- `backend` → FastAPI app, exposed on host port `8000`.
- `frontend` → production build served by nginx, exposed on host port `3000`.

4. Check that the containers are running:

```powershell
docker ps --filter "name=dashboard_erp_bi" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
```

5. Verify the backend API is reachable (example command for Powershell, could use curl or Postman too):

```powershell
Invoke-RestMethod http://localhost:8000/transactions | ConvertTo-Json -Depth 4
```

```powershell
Invoke-RestMethod http://localhost:8000/transactions/summary | ConvertTo-Json -Depth 4
```

6. Open the frontend in your browser:

Visit `http://localhost:3000` to see the dashboard UI. Use the "Transacciones" tab to add entries and the "Dashboard" tab to view the summary and embedded Looker Studio report.

Stopping the app

```powershell
docker compose down
```

Data persistence

- The backend service mounts `./backend/data` into the container so `transactions.json` is persisted on the host. If you remove that folder or delete the file, data will be lost.

Troubleshooting

- If `docker compose` fails, ensure Docker Desktop is running and you have permissions to use Docker.
- If ports `8000` or `3000` are already in use, stop the process that uses them or update `docker-compose.yml` to use different host ports.
- If the frontend does not show updated data after adding transactions, refresh the page or use the "Refrescar" button in the UI.

Security / notes

- This project is a small demo; it does not include authentication, input sanitization beyond Pydantic, or production hardened configuration. It's not ready to be exposed to the public internet as-is.
