# Makefile for Gross Calculator
# Provides common commands for development and deployment

.PHONY: help setup dev build test clean deploy

# Default target
help:
	@echo "Gross Calculator - Available Commands:"
	@echo ""
	@echo "Setup:"
	@echo "  setup          - Initial setup of the project"
	@echo "  setup-db       - Setup database only"
	@echo ""
	@echo "Development:"
	@echo "  dev            - Start development environment"
	@echo "  dev-frontend   - Start frontend development server"
	@echo "  dev-backend    - Start backend development server"
	@echo ""
	@echo "Building:"
	@echo "  build          - Build all services"
	@echo "  build-frontend - Build frontend only"
	@echo "  build-backend  - Build backend only"
	@echo ""
	@echo "Testing:"
	@echo "  test           - Run all tests"
	@echo "  test-frontend  - Run frontend tests"
	@echo "  test-backend   - Run backend tests"
	@echo ""
	@echo "Quality:"
	@echo "  lint           - Run linting and formatting"
	@echo "  format         - Format code"
	@echo ""
	@echo "Docker:"
	@echo "  up             - Start all services with docker-compose"
	@echo "  down           - Stop all services"
	@echo "  logs           - View logs"
	@echo ""
	@echo "Database:"
	@echo "  db-migrate     - Run database migrations"
	@echo "  db-seed        - Seed database with sample data"
	@echo ""
	@echo "Deployment:"
	@echo "  deploy         - Deploy to production"
	@echo "  clean          - Clean build artifacts"

# Setup
setup:
	@echo "Setting up Gross Calculator project..."
	@if [ ! -f .env ]; then cp env.example .env; echo "Created .env file - please update with your values"; fi
	@cd frontend && npm install
	@cd backend && pip install -r requirements.txt
	@echo "Setup complete! Update .env file with your configuration."

setup-db:
	@echo "Setting up database..."
	@docker-compose -f ops/compose/docker-compose.yml up -d oracle
	@echo "Waiting for Oracle to start..."
	@sleep 60
	@echo "Database setup complete!"

# Development
dev: dev-backend dev-frontend

dev-frontend:
	@echo "Starting frontend development server..."
	@cd frontend && npm run dev

dev-backend:
	@echo "Starting backend development server..."
	@cd backend && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Building
build: build-backend build-frontend

build-frontend:
	@echo "Building frontend..."
	@cd frontend && npm run build

build-backend:
	@echo "Building backend..."
	@cd backend && python -m py_compile app/main.py

# Testing
test: test-backend test-frontend

test-frontend:
	@echo "Running frontend tests..."
	@cd frontend && npm test

test-backend:
	@echo "Running backend tests..."
	@cd backend && python -m pytest

# Quality
lint:
	@echo "Running linting and formatting..."
	@pre-commit run --all-files

format:
	@echo "Formatting code..."
	@cd backend && black . && isort .
	@cd frontend && npm run format

# Docker
up:
	@echo "Starting services with docker-compose..."
	@docker-compose -f ops/compose/docker-compose.yml up -d

down:
	@echo "Stopping services..."
	@docker-compose -f ops/compose/docker-compose.yml down

logs:
	@docker-compose -f ops/compose/docker-compose.yml logs -f

# Database
db-migrate:
	@echo "Running database migrations..."
	@docker-compose -f ops/compose/docker-compose.yml exec backend python -c "from app.db.oracle import execute_query; execute_query('SELECT 1 FROM DUAL')"

db-seed:
	@echo "Seeding database with sample data..."
	@docker-compose -f ops/compose/docker-compose.yml exec oracle sqlplus system/oracle123@//localhost:1521/XE @/opt/oracle/scripts/setup/seed_sample_data.sql

# Deployment
deploy:
	@echo "Deploying to production..."
	@echo "TODO: Implement production deployment"

# Cleanup
clean:
	@echo "Cleaning build artifacts..."
	@cd frontend && rm -rf dist node_modules
	@cd backend && find . -type d -name __pycache__ -exec rm -rf {} +
	@docker system prune -f 