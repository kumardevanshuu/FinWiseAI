# app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.endpoints import (
    auth, auth_refresh, users, goals, transactions, finance,
    recommendations, goal_stats, profile, assistant
)

from app.core.config import settings
from app.db.session import Base, engine
import app.db.base  # noqa: F401 — registers all models on Base.metadata
from app.routes.charts.charts import router as charts_router
from app.routes.charts.monthly_trend import router as monthly_trend_router
from app.routes.charts.savings_summary import router as savings_summary_router
from app.routes.charts.category_expense import router as category_expense_router
from app.routes.summary import router as summary_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="FinWiseAI Backend")

# Allowed frontend origins — configurable via CORS_ORIGINS in .env,
# instead of being hardcoded to localhost:5173 only.
origins = settings.cors_origins_list

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,      # ❗ MUST NOT be "*"
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(auth_refresh.router, prefix="/api/v1/auth", tags=["auth-refresh"])
app.include_router(users.router, prefix="/api/v1/users", tags=["users"])
app.include_router(transactions.router, prefix="/api/v1/transactions", tags=["transactions"])
app.include_router(goals.router, prefix="/api/v1/goals", tags=["goals"])
app.include_router(goal_stats.router, prefix="/api/v1/goals/stats", tags=["goal-stats"])
app.include_router(finance.router, prefix="/api/v1/finance", tags=["finance"])
app.include_router(recommendations.router, prefix="/api/v1/recommendations", tags=["recommendations"])
app.include_router(profile.router, prefix="/api/v1/profile", tags=["profile"])
app.include_router(charts_router, prefix="/charts", tags=["charts"])
app.include_router(monthly_trend_router, prefix="/charts", tags=["charts"])
app.include_router(savings_summary_router, prefix="/charts", tags=["charts"])
app.include_router(category_expense_router, prefix="/charts", tags=["charts"])
app.include_router(summary_router, prefix="/summary", tags=["summary"])
app.include_router(assistant.router, prefix="/api/v1/assistant", tags=["assistant"])

@app.get("/")
def root():
    return {"message": "FinWiseAI Backend Running"}
