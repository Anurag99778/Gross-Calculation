from fastapi import APIRouter, Depends, Query
from typing import List, Optional
from app.models.margin import MarginRow, MarginSummary, MarginFilter
from app.core.security import get_current_active_user

router = APIRouter()


@router.get("/margins", response_model=List[MarginRow])
async def get_project_margins(
    project_name: Optional[str] = Query(None, description="Filter by project name"),
    min_margin: Optional[float] = Query(None, description="Minimum margin percentage"),
    max_margin: Optional[float] = Query(None, description="Maximum margin percentage"),
    current_user = Depends(get_current_active_user)
):
    """
    Get gross margin data for all projects.
    
    Returns project name, budget (SOW), cost, and margin percentage.
    """
    # TODO: Implement margin data retrieval
    # TODO: Use Oracle connection to query GROSS_MARGIN_VIEW
    # TODO: Apply filters if provided
    # TODO: Use margin_calc_pkg_02.f_get_gross_margin for calculations
    # TODO: Return list of MarginRow objects
    
    # Placeholder response
    return [
        MarginRow(
            projectName="Sample Project",
            totalHours=100.0,
            budget=50000.0,
            grossMarginPercentage=35.5
        )
    ]


@router.get("/margins/summary", response_model=MarginSummary)
async def get_margins_summary(
    current_user = Depends(get_current_active_user)
):
    """
    Get summary statistics for all project margins.
    
    Returns total projects, hours, budget, and average margin percentage.
    """
    # TODO: Implement summary calculation
    # TODO: Aggregate data from GROSS_MARGIN_VIEW
    # TODO: Calculate totals and averages
    # TODO: Return MarginSummary object
    
    return MarginSummary(
        totalProjects=0,
        totalHours=0.0,
        totalBudget=0.0,
        averageMarginPercentage=0.0
    )


@router.get("/projects", response_model=List[dict])
async def list_projects(
    current_user = Depends(get_current_active_user)
):
    """
    List all projects with basic information.
    
    Returns project ID, name, and SOW value.
    """
    # TODO: Implement project listing
    # TODO: Query PROJECT table
    # TODO: Return basic project information
    # TODO: Exclude sensitive data (CTC values)
    
    return [
        {
            "project_id": 1,
            "project_name": "Sample Project",
            "sow": 50000.0
        }
    ] 