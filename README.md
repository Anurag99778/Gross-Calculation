# Gross Calculator

A full-stack application for calculating gross margins from employee timecards, project budgets, and employee costs.

## Architecture

- **Frontend**: React + Vite + TypeScript with Recharts for visualization
- **Backend**: FastAPI with Python, Oracle database integration, and Vanna RAG for NL→SQL
- **Database**: Oracle SQL with stored procedures for margin calculations

## Quick Start

### Prerequisites
- Python 3.11+


### Development Setup
```bash
# Clone and setup
git clone <repo-url>
cd gross-calculator


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

