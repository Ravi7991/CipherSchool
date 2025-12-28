-- PostgreSQL Database Setup for CipherSQLStudio
-- Run this script after installing PostgreSQL

-- Create the database
CREATE DATABASE cipher_sql_sandbox;

-- Connect to the database
\c cipher_sql_sandbox;

-- Create departments table
CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(100)
);

-- Create employees table
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    department_id INTEGER REFERENCES departments(id),
    salary DECIMAL(10,2),
    hire_date DATE,
    email VARCHAR(100)
);

-- Insert sample departments
INSERT INTO departments (name, location) VALUES
('Engineering', 'San Francisco'),
('Marketing', 'New York'),
('Sales', 'Chicago'),
('HR', 'Austin');

-- Insert sample employees
INSERT INTO employees (name, department_id, salary, hire_date, email) VALUES
('John Doe', 1, 75000, '2022-01-15', 'john.doe@company.com'),
('Jane Smith', 1, 82000, '2021-03-20', 'jane.smith@company.com'),
('Mike Johnson', 2, 65000, '2022-06-10', 'mike.johnson@company.com'),
('Sarah Wilson', 2, 58000, '2023-02-28', 'sarah.wilson@company.com'),
('David Brown', 3, 72000, '2021-11-05', 'david.brown@company.com'),
('Lisa Davis', 3, 68000, '2022-09-12', 'lisa.davis@company.com'),
('Tom Miller', 1, 95000, '2020-07-18', 'tom.miller@company.com'),
('Amy Taylor', 4, 55000, '2023-01-30', 'amy.taylor@company.com'),
('Chris Anderson', 1, 78000, '2022-04-25', 'chris.anderson@company.com'),
('Emma White', 2, 62000, '2023-03-15', 'emma.white@company.com');

-- Verify the data
SELECT 'Departments:' as info;
SELECT * FROM departments;

SELECT 'Employees:' as info;
SELECT * FROM employees;

SELECT 'Employee count by department:' as info;
SELECT d.name, COUNT(e.id) as employee_count
FROM departments d
LEFT JOIN employees e ON d.id = e.department_id
GROUP BY d.id, d.name
ORDER BY employee_count DESC;