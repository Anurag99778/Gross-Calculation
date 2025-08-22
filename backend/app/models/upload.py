"""
Upload-related Pydantic models.
"""
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field


class ValidationIssue(BaseModel):
    """Individual validation issue found during file processing."""
    
    row: int = Field(..., description="Row number where issue occurred")
    column: str = Field(..., description="Column name with issue")
    value: Optional[str] = Field(None, description="Problematic value")
    error: str = Field(..., description="Description of the validation error")
    
    class Config:
        json_schema_extra = {
            "example": {
                "row": 45,
                "column": "DAILY_DATE",
                "value": "2024-13-01",
                "error": "Invalid date format. Expected YYYY-MM-DD"
            }
        }


class UploadResult(BaseModel):
    """Result of a file upload operation."""
    
    filename: str = Field(..., description="Name of uploaded file")
    file_type: str = Field(..., description="Type of file (timecard, employee, project)")
    total_rows: int = Field(..., description="Total rows in file")
    valid_rows: int = Field(..., description="Number of valid rows")
    invalid_rows: int = Field(..., description="Number of invalid rows")
    validation_issues: List[ValidationIssue] = Field(default_factory=list, description="List of validation issues")
    
    class Config:
        json_schema_extra = {
            "example": {
                "filename": "timecard_jan2024.xlsx",
                "file_type": "timecard",
                "total_rows": 100,
                "valid_rows": 95,
                "invalid_rows": 5,
                "validation_issues": []
            }
        }


class ValidationReport(BaseModel):
    """Comprehensive validation report for multiple file uploads."""
    
    uploads: List[UploadResult] = Field(..., description="Results for each uploaded file")
    total_files: int = Field(..., description="Total number of files processed")
    total_valid_rows: int = Field(..., description="Total valid rows across all files")
    total_invalid_rows: int = Field(..., description="Total invalid rows across all files")
    has_errors: bool = Field(..., description="Whether any validation errors occurred")
    
    class Config:
        json_schema_extra = {
            "example": {
                "uploads": [],
                "total_files": 3,
                "total_valid_rows": 285,
                "total_invalid_rows": 15,
                "has_errors": True
            }
        }


class UploadStatus(BaseModel):
    """Status of an upload operation."""
    
    uploadId: str = Field(..., description="Upload identifier")
    status: str = Field(..., description="Current status")
    progress: int = Field(..., ge=0, le=100, description="Progress percentage")
    message: Optional[str] = Field(None, description="Status message")
    
    class Config:
        json_schema_extra = {
            "example": {
                "uploadId": "upload_123",
                "status": "processing",
                "progress": 75,
                "message": "Validating data and loading to database"
            }
        }


class FileValidationError(BaseModel):
    """Validation error for a file upload."""
    
    row: int = Field(..., description="Row number where error occurred")
    column: str = Field(..., description="Column name where error occurred")
    value: str = Field(..., description="Invalid value")
    error: str = Field(..., description="Description of the error")
    
    class Config:
        json_schema_extra = {
            "example": {
                "row": 45,
                "column": "DATE",
                "value": "2024-13-01",
                "error": "Invalid date format. Expected YYYY-MM-DD"
            }
        } 