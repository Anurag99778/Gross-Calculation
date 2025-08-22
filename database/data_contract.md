# Data Contract - Gross Calculator

This document defines the data structure, validation rules, and business logic for the Gross Calculator application.

## Database Schema

### Tables

#### 1. EMPLOYEE
Stores employee information and encrypted cost data.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| EMPLOYEE_ID | VARCHAR2(10) | PRIMARY KEY | Unique employee identifier |
| EMPLOYEE_NAME | VARCHAR2(120) | NULL | Employee full name |
| CTC | RAW(2000) | NULL | Encrypted Cost to Company (AES-256 encrypted) |
| CTCPHR | NUMBER(10,6) | NULL | Cost to Company per Hour Rate |

**Business Rules:**
- EMPLOYEE_ID is the primary key
- CTC is automatically encrypted before insert using the encrypt_ctc_before_insert trigger
- CTCPHR represents the hourly rate derived from CTC
- Employee names can be NULL

#### 2. PROJECT
Stores project information and SOW values.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| PROJECT_ID | NUMBER | PRIMARY KEY | Auto-incrementing project identifier |
| PROJECT_NAME | VARCHAR2(200) | NOT NULL, UNIQUE | Unique project name |
| SOW | NUMBER(20,2) | NULL | Statement of Work value (project budget) |

**Business Rules:**
- PROJECT_NAME must be unique across all projects
- SOW represents the project budget/value
- Project names cannot be empty

#### 3. TIMECARD
Stores employee time tracking data.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| EMPLOYEE_ID | VARCHAR2(10) | NULL | References EMPLOYEE.EMPLOYEE_ID |
| EMPLOYEE_NAME | VARCHAR2(120) | NULL | Employee name (denormalized) |
| DAILY_DATE | DATE | NULL | Date when work was performed |
| TIME_WORKED | NUMBER(3,1) | NULL | Hours worked on the project |
| TIME_CARD_STATE | VARCHAR2(50) | NULL | Status of the timecard (e.g., APPROVED, PENDING) |
| TASK_TYPE | VARCHAR2(50) | NULL | Type of task performed |
| PROJECT_NAME | VARCHAR2(120) | NULL | Name of the project |

**Business Rules:**
- TIME_WORKED can be up to 999.9 hours (3,1 precision)
- DAILY_DATE can be any valid date
- One employee can work on multiple projects per day
- No foreign key constraints (flexible structure)

#### 4. AUDIT_LOG
Tracks changes and system events.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| ID | NUMBER | PRIMARY KEY, GENERATED ALWAYS AS IDENTITY | Auto-incrementing record ID |
| TABLE_NAME | VARCHAR2(50) | NOT NULL | Name of the table being audited |
| RECORD_ID | VARCHAR2(100) | NOT NULL | Identifier of the affected record |
| ACTION | VARCHAR2(20) | NOT NULL, IN ('INSERT', 'UPDATE', 'DELETE') | Type of action performed |
| OLD_VALUES | CLOB | NULL | Previous values (for UPDATE/DELETE) |
| NEW_VALUES | CLOB | NULL | New values (for INSERT/UPDATE) |
| USER_ID | VARCHAR2(50) | NULL | User who performed the action |
| TIMESTAMP | DATE | DEFAULT SYSDATE | When the action occurred |

## Views

### GROSS_MARGIN_VIEW
Calculates gross margins for all projects using the margin_calc_pkg_02 package.

**Columns:**
- PROJECT_NAME: Project identifier
- TOTAL_HOURS: Sum of all hours worked on the project
- BUDGET: Project SOW value
- GROSS_MARGIN_PERCENTAGE: Calculated margin percentage using the package function

**Calculation Logic:**
```
Uses margin_calc_pkg_02.f_get_gross_margin(project_name) which:
1. Decrypts CTC values from EMPLOYEE table
2. Calculates hourly rate: CTC / 2112 (assuming 40-hour work week × 52.8 weeks)
3. Calculates total cost: SUM(time_worked × hourly_rate)
4. Returns margin percentage: ((SOW - total_cost) / SOW) × 100
```

## Stored Functions and Packages

### margin_calc_pkg_02 Package

#### f_decrypt_ctc(p_encrypted_ctc RAW)
Decrypts the encrypted CTC values using AES-256-CBC.

**Parameters:**
- p_encrypted_ctc: RAW - Encrypted CTC value

**Returns:**
- NUMBER - Decrypted CTC value

**Logic:**
1. Decrypts using DBMS_CRYPTO.decrypt with AES_CBC_PKCS5
2. Converts RAW to VARCHAR2 to NUMBER
3. Returns 0 if decryption fails

#### f_get_gross_margin(p_name VARCHAR2)
Calculates gross margin percentage for a specific project.

**Parameters:**
- p_name: VARCHAR2 - Project name

**Returns:**
- NUMBER - Gross margin percentage

**Logic:**
1. Decrypts CTC values for all employees
2. Calculates hourly rates (CTC / 2112)
3. Sums up total cost (hours × hourly rate)
4. Returns margin percentage: ((SOW - total_cost) / SOW) × 100

#### p_get_gross_percent(p_project_name VARCHAR2)
Procedure that calls f_get_gross_margin and provides user-friendly output.

**Parameters:**
- p_project_name: VARCHAR2 - Project name

**Features:**
- Input validation
- Error handling with helpful messages
- Suggests similar project names if exact match not found
- Comprehensive error reporting

## Data Validation Rules

### File Upload Validation

#### TimeCard Files
- **Required Columns:** EMPLOYEE_ID, EMPLOYEE_NAME, DAILY_DATE, TIME_WORKED, PROJECT_NAME
- **Optional Columns:** TIME_CARD_STATE, TASK_TYPE
- **TIME_WORKED:** Numeric, 0.1 to 999.9
- **DAILY_DATE:** Valid date format
- **PROJECT_NAME:** Should exist in PROJECT table

#### Employee Files
- **Required Columns:** EMPLOYEE_ID, EMPLOYEE_NAME, CTC
- **Optional Columns:** CTCPHR
- **EMPLOYEE_ID:** 10 characters max
- **CTC:** Numeric value (will be encrypted automatically)
- **CTCPHR:** Numeric, precision 10,6

#### Project Files
- **Required Columns:** PROJECT_NAME, SOW
- **Optional Columns:** PROJECT_ID
- **PROJECT_NAME:** 200 characters max, must be unique
- **SOW:** Numeric value representing project budget

## Business Logic

### Margin Calculation
1. **CTC Decryption:** Uses AES-256-CBC with 32-byte key
2. **Hourly Rate Calculation:** CTC ÷ 2112 (40 hours/week × 52.8 weeks)
3. **Project Cost:** Sum of (time_worked × hourly_rate) for all employees on the project
4. **Gross Margin Percentage:** ((SOW - total_cost) ÷ SOW) × 100

### Data Encryption
- CTC values are automatically encrypted before insert using a trigger
- Encryption key: 32-byte AES-256 key derived from 'thesecretofyash'
- Decryption happens automatically in the margin calculation functions
- Raw encrypted data is stored in the database

### Data Integrity
- No foreign key constraints (flexible structure)
- Check constraints on audit log actions
- Materialized views for performance optimization
- Audit logging tracks all changes

## API Data Models

### UploadResult
```json
{
  "id": "string",
  "filename": "string",
  "status": "success|error|processing",
  "recordsProcessed": "number",
  "recordsFailed": "number",
  "errors": ["string"],
  "uploadedAt": "datetime"
}
```

### MarginRow
```json
{
  "projectName": "string",
  "totalHours": "number",
  "budget": "number",
  "grossMarginPercentage": "number"
}
```

### AskRequest/AskResponse
```json
{
  "question": "string",
  "context": "string?",
  "sql": "string",
  "explanation": "string",
  "result": "any?",
  "executionTime": "number?"
}
```

## Security Considerations

- CTC values are encrypted using AES-256-CBC encryption
- Encryption key is stored in the package specification
- All database operations are logged in AUDIT_LOG
- Input validation prevents SQL injection
- File uploads are scanned and validated
- Sensitive data (CTC) is never stored in plain text

## Performance Considerations

- Indexes on frequently queried columns
- Materialized view for margin calculations
- Connection pooling for database connections
- Package-level encryption/decryption functions
- Efficient margin calculation using CTEs

## Monitoring and Maintenance

- Health check endpoints for service monitoring
- Database connection health monitoring
- Query performance monitoring
- Regular materialized view refresh
- Audit log rotation and cleanup
- Backup and recovery procedures
- Encryption key management 