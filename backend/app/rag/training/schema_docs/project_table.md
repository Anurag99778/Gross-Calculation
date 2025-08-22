# Project Table Documentation

## Table Name
`PROJECT`

## Description
Stores project information and SOW (Statement of Work) values for gross margin calculations.

## Columns

### PROJECT_ID
- **Type**: NUMBER
- **Primary Key**: Yes
- **Description**: Auto-incrementing project identifier
- **Generation**: Always generated as identity
- **Example**: 1, 2, 3

### PROJECT_NAME
- **Type**: VARCHAR2(200)
- **Nullable**: No
- **Unique**: Yes
- **Description**: Unique project name identifier
- **Constraints**: Maximum 200 characters, must be unique
- **Example**: "E-commerce Platform", "Mobile App Development"

### SOW
- **Type**: NUMBER(20,2)
- **Nullable**: Yes
- **Description**: Statement of Work value (project budget)
- **Precision**: 20 digits total, 2 decimal places
- **Example**: 50000.00, 75000.00

## Business Rules
- Project names must be unique across all projects
- SOW represents the total project budget/value
- Project ID is automatically generated
- Project names cannot be empty

## Security Considerations
- SOW values represent project budgets and are not highly sensitive
- Can be used in external queries with appropriate filtering
- No encryption required for this table

## Related Tables
- `TIMECARD`: Project time tracking data
- Referenced by TimeCard records for project identification

## Sample Data
```
PROJECT_ID | PROJECT_NAME           | SOW
1          | E-commerce Platform    | 50000.00
2          | Mobile App Development | 35000.00
3          | Data Analytics Dashboard| 25000.00
```

## Usage Notes
- Primary table for project identification
- SOW values used in gross margin calculations
- Referenced by TimeCard records for project association
- Used in margin analysis and reporting 