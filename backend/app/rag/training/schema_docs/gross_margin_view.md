# Gross Margin View Documentation

## View Name
`GROSS_MARGIN_VIEW`

## Description
Calculates gross margins for all projects using the margin_calc_pkg_02 package functions. This view provides a comprehensive view of project profitability.

## Columns

### PROJECT_NAME
- **Type**: VARCHAR2(200)
- **Description**: Name of the project
- **Source**: PROJECT table

### TOTAL_HOURS
- **Type**: NUMBER
- **Description**: Sum of all hours worked on the project
- **Source**: TIMECARD table, aggregated
- **Calculation**: SUM(TIME_WORKED)

### BUDGET
- **Type**: NUMBER(20,2)
- **Description**: Project SOW value (budget)
- **Source**: PROJECT.SOW column

### GROSS_MARGIN_PERCENTAGE
- **Type**: NUMBER
- **Description**: Calculated gross margin percentage
- **Source**: margin_calc_pkg_02.f_get_gross_margin function
- **Calculation**: ((SOW - total_cost) / SOW) * 100

## Business Logic
The view uses the Oracle package function `margin_calc_pkg_02.f_get_gross_margin` which:
1. Decrypts CTC values from EMPLOYEE table
2. Calculates hourly rates (CTC / 2112)
3. Computes total project cost (hours × hourly rate)
4. Returns margin percentage: ((SOW - total_cost) / SOW) × 100

## Security Considerations
- **CRITICAL**: This view calls functions that decrypt CTC values
- Never expose this view directly to external systems
- Always filter and redact sensitive data in outputs
- Use only for internal margin analysis

## Related Objects
- `PROJECT`: Source of project names and SOW values
- `TIMECARD`: Source of time tracking data
- `EMPLOYEE`: Source of cost data (encrypted)
- `margin_calc_pkg_02.f_get_gross_margin`: Function for margin calculation

## Sample Data
```
PROJECT_NAME           | TOTAL_HOURS | BUDGET    | GROSS_MARGIN_PERCENTAGE
E-commerce Platform    | 120.5       | 50000.00 | 45.2
Mobile App Development | 85.0        | 35000.00 | 38.7
Data Analytics Dashboard| 45.5       | 25000.00 | 52.1
```

## Usage Notes
- Primary view for gross margin analysis
- Used in dashboard and reporting
- Automatically calculates margins using Oracle package
- Always filter outputs to remove sensitive data
- Refresh materialized view as needed for performance 