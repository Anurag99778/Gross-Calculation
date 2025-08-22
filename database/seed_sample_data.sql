-- Sample Data for Gross Calculator
-- Updated to match actual table structure with encrypted CTC

-- Insert sample employees (CTC will be encrypted by trigger)
INSERT INTO EMPLOYEE (EMPLOYEE_ID, EMPLOYEE_NAME, CTC, CTCPHR) VALUES
('EMP001', 'John Smith', 75000, 36.08),
('EMP002', 'Jane Doe', 82000, 38.83),
('EMP003', 'Bob Johnson', 68000, 32.20),
('EMP004', 'Alice Brown', 95000, 45.02),
('EMP005', 'Charlie Wilson', 72000, 34.09);

-- Insert sample projects
INSERT INTO PROJECT (PROJECT_ID, PROJECT_NAME, SOW) VALUES
(1, 'E-commerce Platform', 50000.00),
(2, 'Mobile App Development', 35000.00),
(3, 'Data Analytics Dashboard', 25000.00),
(4, 'Cloud Migration', 75000.00),
(5, 'Security Audit', 15000.00);

-- Insert sample timecards
INSERT INTO TIMECARD (EMPLOYEE_ID, EMPLOYEE_NAME, DAILY_DATE, TIME_WORKED, TIME_CARD_STATE, TASK_TYPE, PROJECT_NAME) VALUES
('EMP001', 'John Smith', DATE '2024-01-15', 8.0, 'APPROVED', 'DEVELOPMENT', 'E-commerce Platform'),
('EMP001', 'John Smith', DATE '2024-01-16', 7.5, 'APPROVED', 'DEVELOPMENT', 'E-commerce Platform'),
('EMP002', 'Jane Doe', DATE '2024-01-15', 6.0, 'APPROVED', 'TESTING', 'E-commerce Platform'),
('EMP002', 'Jane Doe', DATE '2024-01-15', 2.0, 'APPROVED', 'DESIGN', 'Mobile App Development'),
('EMP003', 'Bob Johnson', DATE '2024-01-15', 8.0, 'APPROVED', 'DEVELOPMENT', 'Mobile App Development'),
('EMP003', 'Bob Johnson', DATE '2024-01-16', 6.5, 'APPROVED', 'ANALYSIS', 'Data Analytics Dashboard'),
('EMP004', 'Alice Brown', DATE '2024-01-15', 8.0, 'APPROVED', 'ARCHITECTURE', 'Cloud Migration'),
('EMP004', 'Alice Brown', DATE '2024-01-16', 8.0, 'APPROVED', 'IMPLEMENTATION', 'Cloud Migration'),
('EMP005', 'Charlie Wilson', DATE '2024-01-15', 4.0, 'APPROVED', 'AUDIT', 'Security Audit'),
('EMP005', 'Charlie Wilson', DATE '2024-01-16', 4.0, 'APPROVED', 'REPORTING', 'Security Audit');

-- Commit the data
COMMIT;

-- Verify the data
SELECT 'Employee Count' as metric, COUNT(*) as value FROM EMPLOYEE
UNION ALL
SELECT 'Project Count', COUNT(*) FROM PROJECT
UNION ALL
SELECT 'Timecard Count', COUNT(*) FROM TIMECARD;

-- Show sample margin calculation using the package function
SELECT 
    PROJECT_NAME,
    margin_calc_pkg_02.f_get_gross_margin(PROJECT_NAME) as GROSS_MARGIN_PERCENTAGE
FROM PROJECT;

-- Test the stored procedure
-- EXEC margin_calc_pkg_02.p_get_gross_percent('E-commerce Platform'); 