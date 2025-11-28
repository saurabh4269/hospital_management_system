from fastapi import FastAPI

from app.routers import actions, advisory, dashboard, hospitals

app = FastAPI(title="SurgeGuard Backend", version="0.1.0")


@app.get("/health")
def health_check() -> dict:
    return {"status": "ok"}


# Register API routers
app.include_router(dashboard.router)
app.include_router(hospitals.router)
app.include_router(actions.router)
app.include_router(advisory.router)


# Optional: enable `python -m app.main` style running
if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
