-- Oracle Stored Procedures and Functions for Gross Calculator
-- Updated to match actual implementation with encrypted CTC

-- Create the margin calculation package
CREATE OR REPLACE PACKAGE margin_calc_pkg_02 IS
    FUNCTION f_get_gross_margin (
        p_name project.project_name%TYPE
    ) RETURN NUMBER;
    
    PROCEDURE p_get_gross_percent (
        p_project_name project.project_name%TYPE
    );
    
    -- Function to decrypt CTC values
    FUNCTION f_decrypt_ctc (
        p_encrypted_ctc RAW
    ) RETURN NUMBER;
    
    -- Use a proper 32-byte key for AES-256
    g_key RAW(32) := UTL_RAW.cast_to_raw(RPAD('thesecretofyash', 32, 'x'));
END margin_calc_pkg_02;
/

-- Create the package body
CREATE OR REPLACE PACKAGE BODY margin_calc_pkg_02 IS
    
    -- Function to decrypt CTC values
    FUNCTION f_decrypt_ctc (
        p_encrypted_ctc RAW
    ) RETURN NUMBER IS
        v_decrypted_raw RAW(2000);
        v_decrypted_varchar VARCHAR2(4000);
        v_decrypted_number NUMBER;
    BEGIN
        -- Decrypt the encrypted CTC
        v_decrypted_raw := DBMS_CRYPTO.decrypt(
            src => p_encrypted_ctc,
            typ => DBMS_CRYPTO.AES_CBC_PKCS5,
            key => g_key
        );
        
        -- Convert RAW to VARCHAR2
        v_decrypted_varchar := UTL_RAW.cast_to_varchar2(v_decrypted_raw);
        
        -- Convert VARCHAR2 to NUMBER
        v_decrypted_number := TO_NUMBER(v_decrypted_varchar);
        
        RETURN v_decrypted_number;
    EXCEPTION
        WHEN OTHERS THEN
            -- Return 0 or NULL in case of decryption error
            RETURN 0;
    END f_decrypt_ctc;
    
    -- MODIFIED FUNCTION WITH DECRYPTION
    FUNCTION f_get_gross_margin (
        p_name project.project_name%TYPE
    ) RETURN NUMBER IS
        v_gross NUMBER;
    BEGIN
        WITH project_costs AS (
            SELECT 
                t.project_name,
                -- Decrypt CTC and calculate hourly rate, then multiply by time worked
                SUM(t.time_worked * (f_decrypt_ctc(e.ctc) / 2112)) AS total_cost
            FROM timecard t
            JOIN employee e ON t.employee_id = e.employee_id
            GROUP BY t.project_name
        )
        SELECT ROUND(((p.sow - SUM(pc.total_cost)) / p.sow) * 100, 2)
        INTO v_gross
        FROM project_costs pc
        JOIN project p ON pc.project_name = p.project_name
        WHERE pc.project_name = p_name
        GROUP BY pc.project_name, p.sow;
        
        RETURN v_gross;
    END f_get_gross_margin;
    
    -- CALLING THE FUNCTION USING PROCEDURE
    PROCEDURE p_get_gross_percent (
        p_project_name project.project_name%TYPE
    ) IS
        v_gross NUMBER;
        v_project_name VARCHAR2(100) := p_project_name;
        v_sugg_name VARCHAR2(2000);
    BEGIN
        IF v_project_name IS NULL OR TRIM(v_project_name) = '' THEN
            DBMS_OUTPUT.put_line('ERROR: Project name cannot be empty');
            RETURN;
        END IF;
        
        v_gross := f_get_gross_margin(v_project_name);
        
        IF v_gross IS NOT NULL THEN
            DBMS_OUTPUT.put_line('GROSS MARGIN : ' || v_gross || '%');
        END IF;
        
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            DBMS_OUTPUT.put_line('Status: Project does not exist in the database.');
            DBMS_OUTPUT.put_line('Action: Please verify the project name and try again!');
            
            -- INNER BLOCK
            BEGIN
                DECLARE
                    v_cnt NUMBER := 0;
                BEGIN
                    DBMS_OUTPUT.put_line('SUGGESTED NAME: ');
                    FOR i IN (
                        SELECT project_name
                        FROM project
                        WHERE UPPER(project_name) LIKE '%' || UPPER(v_project_name) || '%'
                    ) LOOP
                        v_cnt := v_cnt + 1;
                        DBMS_OUTPUT.put_line(v_cnt || '. ' || i.project_name);
                    END LOOP;
                    
                    IF v_cnt = 0 THEN
                        FOR i IN (
                            SELECT project_name
                            FROM project
                            WHERE UPPER(project_name) LIKE '%' || UPPER(v_project_name) || '%'
                        ) LOOP
                            v_cnt := v_cnt + 1;
                            DBMS_OUTPUT.put_line(v_cnt || '. ' || i.project_name);
                        END LOOP;
                    END IF;
                    
                    IF v_cnt = 0 THEN
                        RAISE NO_DATA_FOUND;
                    END IF;
                    
                EXCEPTION
                    WHEN NO_DATA_FOUND THEN
                        DBMS_OUTPUT.put_line('No similar project names found.');
                    WHEN OTHERS THEN
                        DBMS_OUTPUT.put_line('Unable to suggest alternative names.');
                END;
            -- INNER BLOCK END
            END;
            
        WHEN OTHERS THEN
            DBMS_OUTPUT.put_line('Status: An unexpected system error occurred.');
            DBMS_OUTPUT.put_line('Action: Please try again later!');
            DBMS_OUTPUT.put_line('Error Code: ' || SQLCODE || ' - ' || SQLERRM);
    END p_get_gross_percent;
    
END margin_calc_pkg_02;
/

-- Create trigger for encrypting CTC before insert
CREATE OR REPLACE TRIGGER encrypt_ctc_before_insert
    BEFORE INSERT ON employee
    FOR EACH ROW
BEGIN
    :NEW.ctc := DBMS_CRYPTO.encrypt(
        src => UTL_RAW.cast_to_raw(TO_CHAR(:NEW.ctc)),
        typ => DBMS_CRYPTO.AES_CBC_PKCS5,
        key => margin_calc_pkg_02.g_key
    );
END;
/

-- Grant execute permissions (adjust as needed)
-- GRANT EXECUTE ON margin_calc_pkg_02 TO your_app_user;

-- Test the functions
-- SELECT margin_calc_pkg_02.f_get_gross_margin('Test Project') FROM DUAL;
-- EXEC margin_calc_pkg_02.p_get_gross_percent('Test Project');

COMMIT; 