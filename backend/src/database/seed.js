const mongoose = require('mongoose');
const connectDB = require('../config/database');
const { pgPool } = require('../config/database');
const Assignment = require('../models/Assignment');
require('dotenv').config();

// Sample assignments data
const sampleAssignments = [
  {
    title: "Basic SELECT Query",
    description: "Learn to retrieve data from a single table",
    difficulty: "Easy",
    question: "Write a query to select all columns from the 'employees' table where the salary is greater than 50000.",
    expectedTables: [
      { name: "employees", description: "Contains employee information including id, name, department, salary, and hire_date" }
    ],
    sampleQuery: "SELECT * FROM employees WHERE salary > 50000;",
    hints: [
      { level: 1, content: "Use SELECT * to get all columns" },
      { level: 2, content: "Use WHERE clause to filter by salary" }
    ]
  },
  {
    title: "JOIN Operations",
    description: "Combine data from multiple tables using JOIN",
    difficulty: "Medium",
    question: "Write a query to show employee names along with their department names. Include only employees who have a department assigned.",
    expectedTables: [
      { name: "employees", description: "Contains employee information" },
      { name: "departments", description: "Contains department information including id and name" }
    ],
    hints: [
      { level: 1, content: "You need to JOIN two tables" },
      { level: 2, content: "Look for the common column between employees and departments" }
    ]
  },
  {
    title: "Aggregate Functions",
    description: "Use GROUP BY and aggregate functions",
    difficulty: "Hard",
    question: "Write a query to find the average salary by department, showing only departments with more than 2 employees.",
    expectedTables: [
      { name: "employees", description: "Contains employee information" },
      { name: "departments", description: "Contains department information" }
    ],
    hints: [
      { level: 1, content: "Use GROUP BY to group by department" },
      { level: 2, content: "Use HAVING clause to filter groups" },
      { level: 3, content: "Use COUNT() and AVG() functions" }
    ]
  }
];

// PostgreSQL sample data setup
const setupPostgreSQLData = async () => {
  const client = await pgPool.connect();
  
  try {
    // Create departments table
    await client.query(`
      CREATE TABLE IF NOT EXISTS departments (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        location VARCHAR(100)
      )
    `);

    // Create employees table
    await client.query(`
      CREATE TABLE IF NOT EXISTS employees (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        department_id INTEGER REFERENCES departments(id),
        salary DECIMAL(10,2),
        hire_date DATE,
        email VARCHAR(100)
      )
    `);

    // Clear existing data
    await client.query('DELETE FROM employees');
    await client.query('DELETE FROM departments');
    await client.query('ALTER SEQUENCE departments_id_seq RESTART WITH 1');
    await client.query('ALTER SEQUENCE employees_id_seq RESTART WITH 1');

    // Insert sample departments
    await client.query(`
      INSERT INTO departments (name, location) VALUES
      ('Engineering', 'San Francisco'),
      ('Marketing', 'New York'),
      ('Sales', 'Chicago'),
      ('HR', 'Austin')
    `);

    // Insert sample employees
    await client.query(`
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
      ('Emma White', 2, 62000, '2023-03-15', 'emma.white@company.com')
    `);

    console.log('PostgreSQL sample data created successfully');
    
  } finally {
    client.release();
  }
};

// MongoDB assignments setup
const setupMongoDBData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing assignments
    await Assignment.deleteMany({});

    // Insert sample assignments
    await Assignment.insertMany(sampleAssignments);
    
    console.log('MongoDB sample assignments created successfully');
    
  } catch (error) {
    console.error('MongoDB setup error:', error);
  }
};

// Main seed function
const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');
    
    await setupPostgreSQLData();
    await setupMongoDBData();
    
    console.log('Database seeding completed successfully!');
    process.exit(0);
    
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

// Run seeding if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };