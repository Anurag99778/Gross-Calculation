"""
Main FastAPI application entry point.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.config import settings
from app.api.v1 import routes_health, routes_upload, routes_margins, routes_ai


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events."""
    # Startup
    # TODO: Initialize database connections, load models
    yield
    # Shutdown
    # TODO: Close database connections, cleanup


def create_app() -> FastAPI:
    """Application factory."""
    app = FastAPI(
        title="Gross Calculator API",
        description="API for gross margin calculations and data management",
        version="0.1.0",
        docs_url="/docs",
        redoc_url="/redoc",
        lifespan=lifespan,
    )

    # CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.ALLOWED_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Include routers
    app.include_router(routes_health.router, prefix="/api/v1", tags=["health"])
    app.include_router(routes_upload.router, prefix="/api/v1", tags=["upload"])
    app.include_router(routes_margins.router, prefix="/api/v1", tags=["margins"])
    app.include_router(routes_ai.router, prefix="/api/v1", tags=["ai"])

    return app


app = create_app()

if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        workers=settings.WORKERS if not settings.DEBUG else 1,
    ) 