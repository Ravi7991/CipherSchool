const express = require('express');
const Assignment = require('../models/Assignment');
const connectDB = require('../config/database');
const { pgPool } = require('../config/database');
const { mockTables } = require('../services/mockDataService');

const router = express.Router();

// Get all assignments
router.get('/', async (req, res) => {
  try {
    const assignments = await Assignment.find({ isActive: true })
      .select('title description difficulty question expectedTables')
      .sort({ difficulty: 1, createdAt: -1 });
    
    res.json(assignments);
  } catch (error) {
    console.error('Error fetching assignments:', error);
    res.status(500).json({ error: 'Failed to fetch assignments' });
  }
});

// Get specific assignment with sample data
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate ObjectId format
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'Invalid assignment ID format' });
    }

    const assignment = await Assignment.findById(id);
    
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    // Get sample data for expected tables
    const sampleData = {};
    
    for (const table of assignment.expectedTables) {
      try {
        // Try PostgreSQL first, fallback to mock data
        let result;
        try {
          result = await pgPool.query(`SELECT * FROM ${table.name} LIMIT 10`);
          sampleData[table.name] = {
            columns: result.fields.map(field => field.name),
            rows: result.rows,
            description: table.description
          };
        } catch (pgError) {
          console.log(`PostgreSQL not available, using mock data for ${table.name}`);
          // Use mock data
          if (mockTables[table.name]) {
            sampleData[table.name] = {
              columns: mockTables[table.name].columns,
              rows: mockTables[table.name].rows.slice(0, 10),
              description: table.description
            };
          } else {
            sampleData[table.name] = {
              columns: [],
              rows: [],
              description: table.description,
              error: 'Sample data not available'
            };
          }
        }
      } catch (error) {
        console.error(`Error fetching sample data for ${table.name}:`, error);
        sampleData[table.name] = {
          columns: [],
          rows: [],
          description: table.description,
          error: 'Unable to fetch sample data'
        };
      }
    }

    res.json({
      assignment,
      sampleData
    });
  } catch (error) {
    console.error('Error fetching assignment:', error);
    res.status(500).json({ error: 'Failed to fetch assignment' });
  }
});

module.exports = router;