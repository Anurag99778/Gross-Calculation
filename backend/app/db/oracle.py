"""
Oracle database connection and utilities.
"""
import oracledb
import logging
from contextlib import contextmanager
from typing import Generator, Optional
from sqlalchemy import create_engine, text
from sqlalchemy.engine import Engine
from sqlalchemy.pool import QueuePool

from app.core.config import settings

logger = logging.getLogger(__name__)


class OracleDatabase:
    """Oracle database connection manager."""
    
    def __init__(self):
        self.engine: Optional[Engine] = None
        self._initialize_engine()
    
    def _initialize_engine(self) -> None:
        """Initialize the SQLAlchemy engine with Oracle connection."""
        try:
            # Set Oracle client path if specified
            if settings.ORACLE_CLIENT_PATH:
                oracledb.init_oracle_client(lib_dir=settings.ORACLE_CLIENT_PATH)
            
            # Create connection string
            connection_string = (
                f"oracle+oracledb://{settings.DB_USERNAME}:{settings.DB_PASSWORD}"
                f"@{settings.DB_HOST}:{settings.DB_PORT}/{settings.DB_SERVICE_NAME}"
            )
            
            # Create engine with connection pooling
            self.engine = create_engine(
                connection_string,
                poolclass=QueuePool,
                pool_size=settings.DB_POOL_SIZE,
                max_overflow=settings.DB_MAX_OVERFLOW,
                pool_pre_ping=True,
                pool_recycle=3600,  # Recycle connections every hour
                echo=settings.is_development,
            )
            
            logger.info("Oracle database engine initialized successfully")
            
        except Exception as e:
            logger.error(f"Failed to initialize Oracle database engine: {e}")
            raise
    
    @contextmanager
    def get_connection(self) -> Generator[oracledb.Connection, None, None]:
        """Get a direct Oracle connection using oracledb."""
        connection = None
        try:
            connection = oracledb.connect(
                user=settings.DB_USERNAME,
                password=settings.DB_PASSWORD,
                dsn=f"{settings.DB_HOST}:{settings.DB_PORT}/{settings.DB_SERVICE_NAME}",
                encoding="UTF-8",
                nencoding="UTF-8",
            )
            yield connection
        except Exception as e:
            logger.error(f"Database connection error: {e}")
            raise
        finally:
            if connection:
                connection.close()
    
    @contextmanager
    def get_sqlalchemy_connection(self) -> Generator[Engine, None, None]:
        """Get a SQLAlchemy connection."""
        if not self.engine:
            raise RuntimeError("Database engine not initialized")
        
        try:
            yield self.engine
        except Exception as e:
            logger.error(f"SQLAlchemy connection error: {e}")
            raise
    
    def test_connection(self) -> bool:
        """Test the database connection."""
        try:
            with self.get_connection() as conn:
                cursor = conn.cursor()
                cursor.execute("SELECT 1 FROM DUAL")
                result = cursor.fetchone()
                cursor.close()
                return result[0] == 1
        except Exception as e:
            logger.error(f"Connection test failed: {e}")
            return False
    
    def execute_query(self, query: str, params: Optional[dict] = None) -> list:
        """Execute a SQL query and return results."""
        try:
            with self.get_connection() as conn:
                cursor = conn.cursor()
                if params:
                    cursor.execute(query, params)
                else:
                    cursor.execute(query)
                
                if query.strip().upper().startswith("SELECT"):
                    columns = [col[0] for col in cursor.description]
                    rows = cursor.fetchall()
                    result = [dict(zip(columns, row)) for row in rows]
                else:
                    conn.commit()
                    result = [{"affected_rows": cursor.rowcount}]
                
                cursor.close()
                return result
                
        except Exception as e:
            logger.error(f"Query execution failed: {e}")
            raise
    
    def execute_stored_procedure(self, procedure_name: str, params: Optional[dict] = None) -> list:
        """Execute a stored procedure."""
        try:
            with self.get_connection() as conn:
                cursor = conn.cursor()
                
                # Call the stored procedure
                if params:
                    cursor.callproc(procedure_name, list(params.values()))
                else:
                    cursor.callproc(procedure_name)
                
                # Get results if any
                result = []
                try:
                    while True:
                        row = cursor.fetchone()
                        if row is None:
                            break
                        result.append(row)
                except oracledb.DatabaseError:
                    # No results to fetch
                    pass
                
                conn.commit()
                cursor.close()
                return result
                
        except Exception as e:
            logger.error(f"Stored procedure execution failed: {e}")
            raise
    
    def close(self) -> None:
        """Close the database engine."""
        if self.engine:
            self.engine.dispose()
            logger.info("Oracle database engine closed")


# Global database instance
db = OracleDatabase()


def get_db() -> OracleDatabase:
    """Get the database instance."""
    return db


# TODO: Add connection pooling configuration
# TODO: Add retry logic for failed connections
# TODO: Add connection health monitoring
# TODO: Add query performance logging 


# TODO: Set Oracle client path if needed
# oracledb.init_oracle_client(lib_dir="/path/to/oracle/instantclient")


class OracleConnectionManager:
    """Oracle database connection manager with connection pooling."""
    
    def __init__(self):
        self.pool: Optional[oracledb.ConnectionPool] = None
        self._initialize_pool()
    
    def _initialize_pool(self):
        """Initialize connection pool."""
        # TODO: Implement connection pool initialization
        # WARNING: Never hardcode credentials - use environment variables
        try:
            dsn = oracledb.makedsn(
                settings.ORACLE_HOST,
                settings.ORACLE_PORT,
                service_name=settings.ORACLE_SERVICE
            )
            
            self.pool = oracledb.SessionPool(
                user=settings.ORACLE_USER,
                password=settings.ORACLE_PASSWORD,
                dsn=dsn,
                min=settings.ORACLE_POOL_MIN,
                max=settings.ORACLE_POOL_MAX,
                increment=1,
                encoding="UTF-8"
            )
        except Exception as e:
            # TODO: Proper error handling and logging
            raise Exception(f"Failed to initialize Oracle connection pool: {e}")
    
    @contextmanager
    def get_connection(self) -> Generator[oracledb.Connection, None, None]:
        """Get database connection from pool."""
        if not self.pool:
            raise Exception("Connection pool not initialized")
        
        connection = self.pool.acquire()
        try:
            yield connection
        finally:
            self.pool.release(connection)
    
    def close_pool(self):
        """Close the connection pool."""
        if self.pool:
            self.pool.close()
            self.pool = None


# Global connection manager instance
db_manager = OracleConnectionManager()


def get_db_connection():
    """Dependency to get database connection."""
    return db_manager.get_connection()


def execute_query(query: str, params: Optional[dict] = None) -> list:
    """
    Execute a SELECT query.
    
    WARNING: Always use bind variables to prevent SQL injection.
    Example: execute_query("SELECT * FROM table WHERE id = :id", {"id": 123})
    """
    # TODO: Implement query execution with proper error handling
    with db_manager.get_connection() as connection:
        cursor = connection.cursor()
        try:
            if params:
                cursor.execute(query, params)
            else:
                cursor.execute(query)
            
            # TODO: Handle different result types (SELECT, INSERT, UPDATE, DELETE)
            if cursor.description:  # SELECT query
                columns = [col[0] for col in cursor.description]
                rows = cursor.fetchall()
                return [dict(zip(columns, row)) for row in rows]
            else:  # Non-SELECT query
                connection.commit()
                return {"affected_rows": cursor.rowcount}
        finally:
            cursor.close()


def execute_stored_procedure(procedure_name: str, params: Optional[dict] = None):
    """Execute a stored procedure."""
    # TODO: Implement stored procedure execution
    # WARNING: Always use bind variables
    with db_manager.get_connection() as connection:
        cursor = connection.cursor()
        try:
            if params:
                cursor.callproc(procedure_name, list(params.values()))
            else:
                cursor.callproc(procedure_name)
            connection.commit()
        finally:
            cursor.close()


def test_connection() -> bool:
    """Test database connectivity."""
    try:
        with db_manager.get_connection() as connection:
            cursor = connection.cursor()
            cursor.execute("SELECT 1 FROM DUAL")
            result = cursor.fetchone()
            cursor.close()
            return result[0] == 1
    except Exception:
        return False 