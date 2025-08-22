# TimeCard Table Documentation

## Table Name
`TIMECARD`

## Description
Stores employee time tracking data for projects. Used for calculating project costs and gross margins.

## Columns

### EMPLOYEE_ID
- **Type**: VARCHAR2(10)
- **Nullable**: Yes
- **Description**: Employee identifier (references EMPLOYEE.EMPLOYEE_ID)
- **Constraints**: Maximum 10 characters
- **Example**: "EMP001", "EMP002"

### EMPLOYEE_NAME
- **Type**: VARCHAR2(120)
- **Nullable**: Yes
- **Description**: Employee name (denormalized for performance)
- **Constraints**: Maximum 120 characters
- **Example**: "John Smith", "Jane Doe"

### DAILY_DATE
- **Type**: DATE
- **Nullable**: Yes
- **Description**: Date when work was performed
- **Format**: Oracle DATE format
- **Example**: 2024-01-15, 2024-01-16

### TIME_WORKED
- **Type**: NUMBER(3,1)
- **Nullable**: Yes
- **Description**: Hours worked on the project
- **Precision**: 3 digits total, 1 decimal place
- **Range**: 0.1 to 999.9 hours
- **Example**: 8.0, 7.5, 6.0

### TIME_CARD_STATE
- **Type**: VARCHAR2(50)
- **Nullable**: Yes
- **Description**: Status of the timecard
- **Values**: "APPROVED", "PENDING", "REJECTED", etc.
- **Example**: "APPROVED", "PENDING"

### TASK_TYPE
- **Type**: VARCHAR2(50)
- **Nullable**: Yes
- **Description**: Type of task performed
- **Values**: "DEVELOPMENT", "TESTING", "DESIGN", "ANALYSIS", etc.
- **Example**: "DEVELOPMENT", "TESTING"

### PROJECT_NAME
- **Type**: VARCHAR2(120)
- **Nullable**: Yes
- **Description**: Name of the project (references PROJECT.PROJECT_NAME)
- **Constraints**: Maximum 120 characters
- **Example**: "E-commerce Platform", "Mobile App Development"

## Business Rules
- TIME_WORKED must be between 0.1 and 999.9 hours
- DAILY_DATE should not be in the future
- One employee can work on multiple projects per day
- No foreign key constraints (flexible structure)

## Security Considerations
- Contains employee work patterns and project assignments
- Not highly sensitive but should be handled appropriately
- Can be used in external queries with filtering

## Related Tables
- `EMPLOYEE`: Employee information and cost data
- `PROJECT`: Project information and SOW values

## Sample Data
```
EMPLOYEE_ID | EMPLOYEE_NAME | DAILY_DATE | TIME_WORKED | TIME_CARD_STATE | TASK_TYPE    | PROJECT_NAME
EMP001      | John Smith    | 2024-01-15 | 8.0         | APPROVED        | DEVELOPMENT  | E-commerce Platform
EMP002      | Jane Doe      | 2024-01-15 | 6.0         | APPROVED        | TESTING      | E-commerce Platform
EMP003      | Bob Johnson   | 2024-01-15 | 8.0         | APPROVED        | DEVELOPMENT  | Mobile App Development
```

## Usage Notes
- Primary table for time tracking and project cost calculations
- Used in gross margin analysis
- Referenced for employee productivity analysis
- Key table for project profitability calculations 