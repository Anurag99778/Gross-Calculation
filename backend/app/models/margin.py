"""
Margin-related Pydantic models.
"""
from typing import List, Optional
from pydantic import BaseModel, Field


class MarginRow(BaseModel):
    """Individual project margin data."""
    
    projectName: str = Field(..., description="Name of the project")
    totalHours: float = Field(..., description="Total hours worked on the project")
    budget: float = Field(..., description="Project SOW value")
    grossMarginPercentage: float = Field(..., description="Gross margin percentage calculated by Oracle package")
    
    class Config:
        json_schema_extra = {
            "example": {
                "projectName": "E-commerce Platform",
                "totalHours": 120.5,
                "budget": 50000.00,
                "grossMarginPercentage": 45.2
            }
        }


class MarginSummary(BaseModel):
    """Summary statistics for all project margins."""
    
    totalProjects: int = Field(..., description="Total number of projects")
    totalHours: float = Field(..., description="Total hours across all projects")
    totalBudget: float = Field(..., description="Total SOW value across all projects")
    averageMarginPercentage: float = Field(..., description="Average margin percentage")
    
    class Config:
        json_schema_extra = {
            "example": {
                "totalProjects": 15,
                "totalHours": 1250.5,
                "totalBudget": 300000.00,
                "averageMarginPercentage": 37.5
            }
        }


class MarginFilter(BaseModel):
    """Filter options for margin queries."""
    
    project_name: Optional[str] = Field(None, description="Filter by project name")
    min_margin: Optional[float] = Field(None, description="Minimum margin percentage")
    max_margin: Optional[float] = Field(None, description="Maximum margin percentage")
    min_hours: Optional[float] = Field(None, description="Minimum total hours")
    max_hours: Optional[float] = Field(None, description="Maximum total hours") 