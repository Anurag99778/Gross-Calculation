# Gross Calculator - Production Monorepo

A full-stack application for calculating gross margins from employee timecards, project budgets, and employee costs.

## Architecture

- **Frontend**: React + Vite + TypeScript with Recharts for visualization
- **Backend**: FastAPI with Python, Oracle database integration, and Vanna RAG for NL→SQL
- **Database**: Oracle SQL with stored procedures for margin calculations
- **Infrastructure**: Docker Compose with optional Oracle XE

## Quick Start

### Prerequisites
- Python 3.11+


### Development Setup
```bash
# Clone and setup
git clone <repo-url>
cd gross-calculator

# Copy environment files
cp .env.example .env
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env

# Start services
make up

# Or start individual services
make backend-up
make frontend-up
make db-up
```

### Production Deployment
```bash
# Build and deploy
make build
make deploy
```

## Project Structure

```
project-root/
├── frontend/          # React + Vite + TypeScript
├── backend/           # FastAPI + Python
├── database/          # Oracle schema and functions
├── ops/              # Docker and deployment
└── docs/             # Documentation
```

## Key Features

- Excel file upload and validation
- Data cleaning and normalization
- Gross margin calculations via stored procedures
- Interactive dashboard with charts
- Natural language to SQL queries via Vanna RAG
- Production-ready Docker setup

## Environment Variables

See `.env.example` files in each service directory for required configuration.

## API Documentation

Once running, visit:
- Backend API: http://localhost:8000/docs
- Frontend: http://localhost:3000

## Contributing

1. Install pre-commit hooks: `pre-commit install`
2. Follow the established code structure
3. Add tests for new features
4. Update documentation as needed 
