const express = require('express');
const Joi = require('joi');
const connectDB = require('../config/database');
const { pgPool } = require('../config/database');
const UserAttempt = require('../models/UserAttempt');
const { parseSimpleSQL } = require('../services/mockDataService');

const router = express.Router();

// Query validation schema
const querySchema = Joi.object({
  query: Joi.string().required().max(5000),
  assignmentId: Joi.string().required(),
  sessionId: Joi.string().required()
});

// Sanitize SQL query - basic protection
const sanitizeQuery = (query) => {
  // Remove dangerous keywords and patterns
  const dangerousPatterns = [
    /\b(DROP|DELETE|INSERT|UPDATE|ALTER|CREATE|TRUNCATE)\b/gi,
    /--/g,
    /\/\*/g,
    /\*\//g,
    /;.*$/g // Remove anything after semicolon
  ];
  
  let sanitized = query.trim();
  
  dangerousPatterns.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '');
  });
  
  return sanitized;
};

// Execute SQL query
router.post('/execute', async (req, res) => {
  try {
    // Validate request
    const { error, value } = querySchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { query, assignmentId, sessionId } = value;
    
    // Sanitize query
    const sanitizedQuery = sanitizeQuery(query);
    
    if (!sanitizedQuery || sanitizedQuery.length === 0) {
      return res.status(400).json({ 
        error: 'Invalid query. Only SELECT statements are allowed.' 
      });
    }

    // Ensure it's a SELECT query
    if (!sanitizedQuery.toUpperCase().trim().startsWith('SELECT')) {
      return res.status(400).json({ 
        error: 'Only SELECT queries are allowed in this environment.' 
      });
    }

    const startTime = Date.now();
    let result;
    let usingMockData = false;
    
    try {
      // Try PostgreSQL first
      const client = await pgPool.connect();
      
      try {
        // Set query timeout
        await client.query('SET statement_timeout = 10000'); // 10 seconds
        
        result = await client.query(sanitizedQuery);
        
      } finally {
        client.release();
      }
      
    } catch (pgError) {
      console.log('PostgreSQL not available, using mock data service');
      usingMockData = true;
      
      try {
        // Use mock data service
        const mockResult = parseSimpleSQL(sanitizedQuery);
        result = {
          fields: mockResult.columns.map(col => ({ name: col })),
          rows: mockResult.rows,
          rowCount: mockResult.rowCount
        };
      } catch (mockError) {
        const executionTime = Date.now() - startTime;
        
        // Save failed attempt
        try {
          await new UserAttempt({
            sessionId,
            assignmentId,
            query: sanitizedQuery,
            isSuccessful: false,
            executionTime,
            errorMessage: mockError.message
          }).save();
        } catch (saveError) {
          console.error('Error saving failed attempt:', saveError);
        }

        return res.status(400).json({
          success: false,
          error: mockError.message,
          executionTime,
          usingMockData: true
        });
      }
    }
    
    const executionTime = Date.now() - startTime;
    
    // Save successful attempt
    try {
      await new UserAttempt({
        sessionId,
        assignmentId,
        query: sanitizedQuery,
        isSuccessful: true,
        executionTime
      }).save();
    } catch (saveError) {
      console.error('Error saving successful attempt:', saveError);
    }

    res.json({
      success: true,
      columns: result.fields.map(field => field.name),
      rows: result.rows,
      rowCount: result.rowCount,
      executionTime,
      usingMockData
    });
    
  } catch (error) {
    console.error('Query execution error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;