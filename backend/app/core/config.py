"""
Configuration settings for the application.
"""
from typing import List
from pydantic import BaseSettings, Field


class Settings(BaseSettings):
    """Application configuration from environment variables."""
    
    # Project
    PROJECT_NAME: str = "Gross Calculator"
    VERSION: str = "0.1.0"
    DEBUG: bool = False
    
    # Database
    ORACLE_HOST: str = Field(..., description="Oracle database host")
    ORACLE_PORT: int = Field(1521, description="Oracle database port")
    ORACLE_SERVICE: str = Field(..., description="Oracle service name")
    ORACLE_USER: str = Field(..., description="Oracle username")
    ORACLE_PASSWORD: str = Field(..., description="Oracle password")
    ORACLE_POOL_MIN: int = Field(1, description="Minimum connection pool size")
    ORACLE_POOL_MAX: int = Field(10, description="Maximum connection pool size")
    
    # File Upload
    FILE_UPLOAD_DIR: str = Field("./uploads", description="Directory for file uploads")
    MAX_FILE_SIZE: int = Field(10 * 1024 * 1024, description="Maximum file size in bytes")
    ALLOWED_EXTENSIONS: List[str] = Field([".xlsx", ".xls", ".csv"], description="Allowed file extensions")
    
    # RAG/AI
    RAG_MODEL_PATH: str = Field("./models", description="Path to RAG model files")
    RAG_EMBEDDING_MODEL: str = Field("all-MiniLM-L6-v2", description="Embedding model name")
    RAG_MAX_TOKENS: int = Field(1000, description="Maximum tokens for AI responses")
    
    # Security
    JWT_SECRET: str = Field(..., description="JWT secret key")
    JWT_ALGORITHM: str = Field("HS256", description="JWT algorithm")
    JWT_EXPIRY: int = Field(3600, description="JWT expiry in seconds")
    
    # CORS
    FRONTEND_URL: str = Field("http://localhost:3000", description="Frontend URL for CORS")
    ALLOWED_ORIGINS: List[str] = Field(["http://localhost:3000"], description="Allowed CORS origins")
    
    # API
    API_PREFIX: str = "/api/v1"
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    @property
    def database_url(self) -> str:
        """Construct Oracle connection string."""
        return f"oracle+oracledb://{self.ORACLE_USER}:{self.ORACLE_PASSWORD}@{self.ORACLE_HOST}:{self.ORACLE_PORT}/?service_name={self.ORACLE_SERVICE}"
    
    @property
    def is_development(self) -> bool:
        """Check if running in development mode."""
        return self.DEBUG
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# Global settings instance
settings = Settings() 