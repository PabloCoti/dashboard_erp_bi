"""
Main application entrypoint. Configure middleware and include
API routers here. Keeping this file minimal makes the app easier to
test and reason about.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from .routes import router as transactions_router

app = FastAPI(title="Dashboard ERP BI - Backend")

# Simple CORS configuration for local development. In production
# this should be tightened to the exact allowed origins.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("CORS_ORIGINS", "http://localhost:3000")],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API routes
app.include_router(transactions_router)
