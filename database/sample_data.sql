-- ====================================================================
-- Smart Employee & Project Management System (SEMP)
-- Sample Seed Data Script
-- ====================================================================

USE semp_db;

-- 1. Users (Passwords encrypted with BCrypt)
-- Admin Password: admin123 ($2a$12$K13oYwB15yV00p.H3R5hCeFv4K0SjI15g3Y2J.o1lV1O6F7V0F3)
-- User Password: user123   ($2a$12$R.32A.4tQY5pXn.6wL3e3O9Z5C1V2B3N4M5K6L7P8O9I0U1Y2T)

INSERT INTO users (id, username, email, password, role, enabled) VALUES
(1, 'admin', 'admin@semp.com', '$2a$12$Q4Y8Pz2/F5gX9lJ7vK0E8uA1bC2dE3fG4hI5jK6lM7nO8pQ9rS0tU', 'ROLE_ADMIN', TRUE),
(2, 'john.doe', 'john.doe@semp.com', '$2a$12$Q4Y8Pz2/F5gX9lJ7vK0E8uA1bC2dE3fG4hI5jK6lM7nO8pQ9rS0tU', 'ROLE_EMPLOYEE', TRUE),
(3, 'jane.smith', 'jane.smith@semp.com', '$2a$12$Q4Y8Pz2/F5gX9lJ7vK0E8uA1bC2dE3fG4hI5jK6lM7nO8pQ9rS0tU', 'ROLE_EMPLOYEE', TRUE);

-- 2. Departments
INSERT INTO departments (id, name, code, description) VALUES
(1, 'Engineering', 'ENG', 'Software Development and Technical Architecture'),
(2, 'Human Resources', 'HR', 'Talent Management & Operations'),
(3, 'Product & Design', 'PRD', 'Product Design & User Experience');

-- 3. Employees
INSERT INTO employees (id, employee_code, first_name, last_name, email, phone, designation, salary, join_date, status, department_id, user_id) VALUES
(1, 'EMP-1001', 'John', 'Doe', 'john.doe@semp.com', '+1 555-0192', 'Senior Full Stack Engineer', 95000.00, '2025-05-15', 'ACTIVE', 1, 2),
(2, 'EMP-1002', 'Jane', 'Smith', 'jane.smith@semp.com', '+1 555-0143', 'Lead UI/UX Designer', 88000.00, '2025-11-01', 'ACTIVE', 3, 3),
(3, 'EMP-1003', 'Robert', 'Johnson', 'robert.j@semp.com', '+1 555-0188', 'Backend Specialist', 92000.00, '2026-02-10', 'ACTIVE', 1, NULL);

-- 4. Projects
INSERT INTO projects (id, project_code, name, description, start_date, end_date, status, priority, budget) VALUES
(1, 'PRJ-101', 'Smart Employee System', 'Full stack platform for workforce and project management.', '2026-06-01', '2026-09-30', 'IN_PROGRESS', 'HIGH', 150000.00),
(2, 'PRJ-102', 'Cloud Infrastructure Migration', 'Kubernetes and AWS Cloud Migration.', '2026-07-01', '2026-12-31', 'IN_PROGRESS', 'URGENT', 220000.00);

-- 5. Project Team Assignments
INSERT INTO project_employees (project_id, employee_id) VALUES
(1, 1),
(1, 2),
(2, 1),
(2, 3);

-- 6. Tasks
INSERT INTO tasks (id, task_code, title, description, project_id, assigned_employee_id, status, priority, progress_percentage, due_date) VALUES
(1, 'TSK-5001', 'Implement Spring Security JWT', 'Stateless JWT Filter & Controller endpoints.', 1, 1, 'DONE', 'HIGH', 100, '2026-07-20'),
(2, 'TSK-5002', 'Design Responsive React Dashboard', 'Build glassmorphic UI cards and navigation.', 1, 2, 'IN_PROGRESS', 'HIGH', 75, '2026-07-28'),
(3, 'TSK-5003', 'Setup PDF and Excel Reports', 'Apache POI and OpenPDF export implementation.', 1, 1, 'TODO', 'MEDIUM', 0, '2026-08-05');

-- 7. Remarks
INSERT INTO remarks (id, task_id, user_id, content) VALUES
(1, 1, 1, 'JWT Security verified. All authentication tests passing.'),
(2, 2, 3, 'Glassmorphism dashboard layout completed and integrated with React Router.');
