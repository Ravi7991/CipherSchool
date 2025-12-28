const mongoose = require('mongoose');
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
      { name: "employees", description: "Contains employee information including id, name, department_id, salary, hire_date, and email" }
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
      { name: "departments", description: "Contains department information including id, name, and location" }
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
  },
  {
    title: "Simple Data Exploration",
    description: "Explore the basic structure of our sample data",
    difficulty: "Easy",
    question: "Write a query to see all departments and their locations.",
    expectedTables: [
      { name: "departments", description: "Contains department information including id, name, and location" }
    ],
    hints: [
      { level: 1, content: "Use SELECT to choose specific columns" },
      { level: 2, content: "You need the name and location columns from departments table" }
    ]
  },
  {
    title: "Filtering and Sorting",
    description: "Learn to filter data and sort results",
    difficulty: "Easy",
    question: "Write a query to find all employees hired in 2022, sorted by hire date.",
    expectedTables: [
      { name: "employees", description: "Contains employee information including hire_date" }
    ],
    hints: [
      { level: 1, content: "Use WHERE clause to filter by year" },
      { level: 2, content: "Use ORDER BY to sort results" },
      { level: 3, content: "Date comparisons can use >= and < operators" }
    ]
  }
];

// MongoDB assignments setup
const seedMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing assignments
    await Assignment.deleteMany({});
    console.log('Cleared existing assignments');

    // Insert sample assignments
    const insertedAssignments = await Assignment.insertMany(sampleAssignments);
    
    console.log(`✅ Successfully created ${insertedAssignments.length} sample assignments:`);
    insertedAssignments.forEach((assignment, index) => {
      console.log(`   ${index + 1}. ${assignment.title} (${assignment.difficulty})`);
    });
    
  } catch (error) {
    console.error('MongoDB setup error:', error);
    throw error;
  }
};

// Main seed function
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting MongoDB seeding...');
    
    await seedMongoDB();
    
    console.log('🎉 Database seeding completed successfully!');
    console.log('');
    console.log('You can now:');
    console.log('1. Visit http://localhost:3000 to see the assignments');
    console.log('2. Try sample queries like:');
    console.log('   - SELECT * FROM employees WHERE salary > 60000');
    console.log('   - SELECT e.name, d.name FROM employees e JOIN departments d ON e.department_id = d.id');
    console.log('');
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

// Run seeding if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };