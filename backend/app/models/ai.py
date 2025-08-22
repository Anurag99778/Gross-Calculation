"""
AI-related Pydantic models.
"""
from typing import List, Optional, Any
from pydantic import BaseModel, Field


class AskRequest(BaseModel):
    """Request for AI-powered natural language to SQL conversion."""
    
    question: str = Field(..., description="Natural language question about the data")
    context: Optional[str] = Field(None, description="Additional context for the question")
    
    class Config:
        json_schema_extra = {
            "example": {
                "question": "What is the average gross margin for projects with more than 100 hours?",
                "context": "Focus on completed projects from Q4 2024"
            }
        }


class AskResponse(BaseModel):
    """Response from AI with generated SQL and results."""
    
    question: str = Field(..., description="Original question asked")
    sql_query: str = Field(..., description="Generated SQL query")
    explanation: str = Field(..., description="Explanation of the SQL query")
    results: List[dict] = Field(..., description="Query results")
    row_count: int = Field(..., description="Number of rows returned")
    
    # Security warning
    security_note: str = Field(
        default="WARNING: Never expose CTC (Cost to Company) data externally. All sensitive data is encrypted.",
        description="Security notice about data handling"
    )
    
    class Config:
        json_schema_extra = {
            "example": {
                "question": "What is the average gross margin for projects with more than 100 hours?",
                "sql_query": "SELECT AVG(gross_margin_percentage) FROM gross_margin_view WHERE total_hours > 100",
                "explanation": "This query calculates the average gross margin percentage for projects that have more than 100 total hours worked.",
                "results": [{"avg_gross_margin_percentage": 42.5}],
                "row_count": 1,
                "security_note": "WARNING: Never expose CTC (Cost to Company) data externally. All sensitive data is encrypted."
            }
        }


class TrainingExample(BaseModel):
    """Example for training the AI model."""
    
    question: str = Field(..., description="Natural language question")
    sql_query: str = Field(..., description="Expected SQL query")
    explanation: str = Field(..., description="Explanation of the query")
    
    class Config:
        json_schema_extra = {
            "example": {
                "question": "Show me projects with margins above 30%",
                "sql_query": "SELECT * FROM gross_margin_view WHERE gross_margin_percentage > 30",
                "explanation": "Query to find projects with gross margin percentage greater than 30%"
            }
        }


class AIMetrics(BaseModel):
    """Performance metrics for AI responses."""
    
    response_time_ms: float = Field(..., description="Response time in milliseconds")
    confidence_score: float = Field(..., description="AI confidence in the response (0-1)")
    tokens_used: int = Field(..., description="Number of tokens consumed")
    model_version: str = Field(..., description="Version of the AI model used") 