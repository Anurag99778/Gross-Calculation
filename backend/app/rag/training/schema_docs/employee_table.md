# Employee Table Documentation

## Table Name
`EMPLOYEE`

## Description
Stores employee information and cost data. Contains encrypted CTC (Cost to Company) values for security.

## Columns

### EMPLOYEE_ID
- **Type**: VARCHAR2(10)
- **Primary Key**: Yes
- **Description**: Unique employee identifier
- **Constraints**: Maximum 10 characters, alphanumeric
- **Example**: "EMP001", "EMP002"

### EMPLOYEE_NAME
- **Type**: VARCHAR2(120)
- **Nullable**: Yes
- **Description**: Employee full name
- **Constraints**: Maximum 120 characters
- **Example**: "John Smith", "Jane Doe"

### CTC
- **Type**: RAW(2000)
- **Nullable**: Yes
- **Description**: Encrypted Cost to Company (annual salary + benefits)
- **Security**: Automatically encrypted before insert using AES-256-CBC
- **Note**: Never expose this field externally

### CTCPHR
- **Type**: NUMBER(10,6)
- **Nullable**: Yes
- **Description**: Cost to Company per Hour Rate
- **Precision**: 10 digits total, 6 decimal places
- **Example**: 36.080000, 38.830000

## Business Rules
- Employee ID must be unique across all employees
- CTC values are automatically encrypted using database triggers
- CTCPHR represents hourly rate derived from annual CTC
- Employee names can be NULL but should be populated for reporting

## Security Considerations
- **CRITICAL**: CTC field contains encrypted sensitive salary information
- Never log, display, or expose CTC values in any output
- Use only for internal calculations and margin analysis
- All CTC-related queries should be filtered and redacted

## Related Tables
- `TIMECARD`: Employee time tracking data
- Referenced by TimeCard records for employee identification

## Sample Data
```
EMPLOYEE_ID | EMPLOYEE_NAME | CTC (encrypted) | CTCPHR
EMP001      | John Smith    | [ENCRYPTED]     | 36.080000
EMP002      | Jane Doe      | [ENCRYPTED]     | 38.830000
```

## Usage Notes
- Use for employee identification in timecard processing
- CTCPHR used in gross margin calculations
- CTC values used internally for cost calculations (decrypted automatically)
- Always filter out CTC field in external-facing queries 