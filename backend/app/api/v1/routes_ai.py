from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Optional, List, Dict
from app.models.ai import AskRequest, AskResponse
from app.core.security import get_current_active_user
from app.services.ai_service import VannaClient

router = APIRouter()

# Initialize Vanna client
vanna_client = VannaClient()


@router.post("/ask", response_model=AskResponse)
async def ask_ai_question(
    request: AskRequest,
    redact_sensitive: bool = Query(True, description="Redact sensitive data in results"),
    current_user = Depends(get_current_active_user)
):
    """
    Convert natural language question to SQL and return results.
    
    WARNING: Never send CTC (Cost to Company) data externally.
    All sensitive data is encrypted and should remain secure.
    
    This endpoint:
    1. Validates the question for security
    2. Generates SQL using Vanna RAG
    3. Executes the SQL safely
    4. Returns results with security disclaimers
    """
    try:
        # TODO: Implement question validation
        # - Check question length limits
        # - Validate allowed keywords
        # - Block sensitive data queries
        # - Log validation results
        
        # Security validation
        if not _validate_question_security(request.question):
            raise HTTPException(
                status_code=400,
                detail="Question contains blocked keywords or patterns for security reasons"
            )
        
        # TODO: Implement AI question processing
        # - Call vanna_client.ask() to generate SQL
        # - Call vanna_client.run() to execute SQL
        # - Apply sensitive data redaction if enabled
        # - Handle execution errors gracefully
        
        # Placeholder implementation
        generated_sql = "SELECT 'placeholder' FROM dual"
        query_results = [{"message": "AI functionality not yet implemented"}]
        
        # TODO: Actual AI processing
        # generated_sql = vanna_client.ask(request.question, request.context)
        # query_results = vanna_client.run(generated_sql)
        
        # Apply redaction if enabled
        if redact_sensitive:
            query_results = vanna_client.redact_sensitive_data(query_results)
        
        return AskResponse(
            question=request.question,
            sql_query=generated_sql,
            explanation=_generate_explanation(request.question, generated_sql),
            results=query_results,
            row_count=len(query_results),
            security_note=_get_security_disclaimer()
        )
        
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        # logger.error(f"AI question processing failed: {e}") # Original code had this line commented out
        raise HTTPException(
            status_code=500,
            detail="Failed to process AI question. Please try again later."
        )


def _validate_question_security(question: str) -> bool:
    """
    Validate question for security compliance.
    
    TODO: Implement comprehensive security validation
    - Check for blocked keywords
    - Validate question length
    - Check for suspicious patterns
    - Return validation result
    
    Args:
        question: Natural language question to validate
        
    Returns:
        True if question is secure, False otherwise
    """
    # TODO: Implement security validation
    # - Check question length (min/max)
    # - Block sensitive keywords (CTC, salary, compensation)
    # - Validate question format
    # - Check for SQL injection patterns
    
    question_lower = question.lower()
    
    # Block sensitive keywords
    blocked_keywords = [
        'ctc', 'cost to company', 'salary', 'compensation',
        'hourly rate', 'wage', 'cost per hour'
    ]
    
    if any(keyword in question_lower for keyword in blocked_keywords):
        return False
    
    # Check question length
    if len(question) < 10 or len(question) > 500:
        return False
    
    return True


def _generate_explanation(question: str, sql: str) -> str:
    """
    Generate explanation for the SQL query.
    
    TODO: Implement explanation generation
    - Analyze question and SQL relationship
    - Generate human-readable explanation
    - Include business context
    - Return formatted explanation
    
    Args:
        question: Original natural language question
        sql: Generated SQL query
        
    Returns:
        Human-readable explanation of the SQL
    """
    # TODO: Implement explanation generation
    # - Use AI to generate explanations
    # - Include business context
    # - Explain SQL logic
    # - Return formatted explanation
    
    return f"This SQL query addresses the question: '{question}'. The query retrieves relevant data from the gross margin view to answer your question about project profitability and performance."


def _get_security_disclaimer() -> str:
    """
    Get security disclaimer for AI responses.
    
    Returns:
        Security disclaimer text
    """
    return (
        "WARNING: Never expose CTC (Cost to Company) data externally. "
        "All sensitive data is encrypted and should remain secure. "
        "This response has been filtered to remove any sensitive information. "
        "Use only for authorized business analysis purposes."
    )


@router.get("/training/status")
async def get_training_status(
    current_user = Depends(get_current_active_user)
):
    """
    Get current training status of the AI model.
    
    Returns:
        Training status and statistics
    """
    # TODO: Implement training status endpoint
    # - Get training status from Vanna client
    # - Return training metrics
    # - Include model performance data
    
    return {
        "status": "not_implemented",
        "message": "Training status endpoint not yet implemented"
    }


@router.post("/training/schema")
async def train_schema(
    ddl_texts: List[str],
    current_user = Depends(get_current_active_user)
):
    """
    Train the AI model with database schema information.
    
    Args:
        ddl_texts: List of DDL statements and schema descriptions
        
    Returns:
        Training result
    """
    # TODO: Implement schema training endpoint
    # - Validate DDL texts
    # - Call vanna_client.train_schema()
    # - Return training results
    
    try:
        # TODO: Actual schema training
        # success = vanna_client.train_schema(ddl_texts)
        success = False
        
        return {
            "success": success,
            "message": "Schema training not yet implemented",
            "texts_processed": len(ddl_texts)
        }
        
    except Exception as e:
        # logger.error(f"Schema training failed: {e}") # Original code had this line commented out
        raise HTTPException(
            status_code=500,
            detail="Schema training failed. Please try again later."
        )


@router.post("/training/examples")
async def train_examples(
    examples: List[Dict[str, str]],
    current_user = Depends(get_current_active_user)
):
    """
    Train the AI model with question-SQL example pairs.
    
    Args:
        examples: List of {'question': str, 'sql': str} dictionaries
        
    Returns:
        Training result
    """
    # TODO: Implement examples training endpoint
    # - Validate example format
    # - Call vanna_client.train_examples()
    # - Return training results
    
    try:
        # TODO: Actual examples training
        # success = vanna_client.train_examples(examples)
        success = False
        
        return {
            "success": success,
            "message": "Examples training not yet implemented",
            "examples_processed": len(examples)
        }
        
    except Exception as e:
        # logger.error(f"Examples training failed: {e}") # Original code had this line commented out
        raise HTTPException(
            status_code=500,
            detail="Examples training failed. Please try again later."
        ) 