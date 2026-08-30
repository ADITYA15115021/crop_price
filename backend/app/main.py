from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.routes.prices import router as prices_router
from backend.app.routes.states import router as states_router
from backend.app.routes.crops import router as crops_router
from backend.app.routes.years import router as years_router

app = FastAPI(
    title="Agricultural Price API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5174","http://localhost:5173", ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    prices_router,
    prefix="/api/v1"
)

app.include_router(
    states_router,
    prefix="/api/v1"
)

app.include_router(
    crops_router,
    prefix="/api/v1"
)

app.include_router(
    years_router,
    prefix="/api/v1"
)

@app.get("/")
def root():
    return {"message": "Agricultural Price API"}