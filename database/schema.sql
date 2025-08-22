-- Oracle Database Schema for Gross Calculator
-- Updated to match actual table structure with encrypted CTC

-- Enable foreign key constraints
ALTER SESSION SET CONSTRAINTS = DEFERRED;

-- Create tables
CREATE TABLE EMPLOYEE (
    EMPLOYEE_ID VARCHAR2(10) PRIMARY KEY,
    EMPLOYEE_NAME VARCHAR2(120),
    CTC RAW(2000), -- RAW to store encrypted data directly
    CTCPHR NUMBER(10,6)
);

CREATE TABLE PROJECT (
    PROJECT_ID NUMBER PRIMARY KEY,
    PROJECT_NAME VARCHAR2(200) NOT NULL UNIQUE,
    SOW NUMBER(20,2)
);

CREATE TABLE TIMECARD (
    EMPLOYEE_ID VARCHAR2(10),
    EMPLOYEE_NAME VARCHAR2(120),
    DAILY_DATE DATE,
    TIME_WORKED NUMBER(3,1),
    TIME_CARD_STATE VARCHAR2(50),
    TASK_TYPE VARCHAR2(50),
    PROJECT_NAME VARCHAR2(120)
);

-- Create indexes for better performance
CREATE INDEX idx_timecard_emp_id ON TIME_CARD(EMP_ID);
CREATE INDEX idx_timecard_project ON TIME_CARD(PROJECT_NAME);
CREATE INDEX idx_timecard_date ON TIME_CARD(WORK_DATE);
CREATE INDEX idx_timecard_emp_project_date ON TIME_CARD(EMP_ID, PROJECT_NAME, WORK_DATE);

-- Create audit table for tracking changes
CREATE TABLE AUDIT_LOG (
    ID NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    TABLE_NAME VARCHAR2(50) NOT NULL,
    RECORD_ID VARCHAR2(100) NOT NULL,
    ACTION VARCHAR2(20) NOT NULL, -- INSERT, UPDATE, DELETE
    OLD_VALUES CLOB,
    NEW_VALUES CLOB,
    USER_ID VARCHAR2(50),
    TIMESTAMP DATE DEFAULT SYSDATE,
    CONSTRAINT chk_action CHECK (ACTION IN ('INSERT', 'UPDATE', 'DELETE'))
);

-- Create sequence for audit log
CREATE SEQUENCE audit_log_seq START WITH 1 INCREMENT BY 1;

-- Create view for gross margin calculation using the package function
CREATE OR REPLACE VIEW GROSS_MARGIN_VIEW AS
SELECT 
    p.PROJECT_NAME,
    SUM(t.TIME_WORKED) as TOTAL_HOURS,
    p.SOW as BUDGET,
    margin_calc_pkg_02.f_get_gross_margin(p.PROJECT_NAME) as GROSS_MARGIN_PERCENTAGE
FROM PROJECT p
LEFT JOIN TIMECARD t ON p.PROJECT_NAME = t.PROJECT_NAME
GROUP BY p.PROJECT_NAME, p.SOW
ORDER BY GROSS_MARGIN_PERCENTAGE DESC;

-- Create materialized view for performance (refresh as needed)
CREATE MATERIALIZED VIEW GROSS_MARGIN_MV
REFRESH FAST ON COMMIT
AS SELECT * FROM GROSS_MARGIN_VIEW;

-- Create indexes on materialized view
CREATE INDEX idx_margin_mv_project ON GROSS_MARGIN_MV(PROJECT_NAME);
CREATE INDEX idx_margin_mv_percentage ON GROSS_MARGIN_MV(MARGIN_PERCENTAGE);

-- Grant permissions (adjust as needed for your Oracle setup)
-- GRANT SELECT, INSERT, UPDATE, DELETE ON EMPLOYEE TO your_app_user;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON PROJECT_SOW TO your_app_user;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON TIME_CARD TO your_app_user;
-- GRANT SELECT ON GROSS_MARGIN_VIEW TO your_app_user;
-- GRANT SELECT ON GROSS_MARGIN_MV TO your_app_user;

-- Commit the transaction
COMMIT;

-- Display table information
SELECT table_name, num_rows, blocks, avg_row_len 
FROM user_tables 
WHERE table_name IN ('EMPLOYEE', 'PROJECT_SOW', 'TIME_CARD', 'AUDIT_LOG');

-- Display view information
SELECT view_name, text FROM user_views WHERE view_name = 'GROSS_MARGIN_VIEW'; 