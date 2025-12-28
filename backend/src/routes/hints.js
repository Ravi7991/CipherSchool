const express = require('express');
const OpenAI = require('openai');
const Joi = require('joi');
const Assignment = require('../models/Assignment');
const UserAttempt = require('../models/UserAttempt');

const router = express.Router();

// Initialize OpenAI only if API key is provided and not a placeholder
let openai = null;
if (process.env.OPENAI_API_KEY && 
    process.env.OPENAI_API_KEY !== 'your_openai_api_key_here' && 
    process.env.OPENAI_API_KEY !== 'demo_key_placeholder') {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

// Hint request validation
const hintSchema = Joi.object({
  assignmentId: Joi.string().required(),
  sessionId: Joi.string().required(),
  userQuery: Joi.string().allow('').max(5000),
  errorMessage: Joi.string().allow('').max(1000)
});

// Fallback hints for different scenarios
const getFallbackHint = (assignment, userQuery, errorMessage, hintsUsed) => {
  const hints = [
    "Think about which tables you need to query and how they might be related.",
    "Consider what columns you need in your SELECT statement.",
    "Check if you need to use WHERE clause to filter your results.",
    "Look at the sample data to understand the table structure better.",
    "Consider if you need to use JOIN to combine data from multiple tables.",
    "Remember that SQL keywords are not case-sensitive, but it's good practice to use uppercase.",
    "Check your syntax - make sure you have proper commas and parentheses.",
    "Think about whether you need aggregate functions like COUNT, AVG, or SUM."
  ];

  // Assignment-specific hints
  if (assignment.title.toLowerCase().includes('join')) {
    return "For JOIN operations, you need to identify the common column between tables. Look for columns like 'id' and 'department_id' that link the tables together.";
  }
  
  if (assignment.title.toLowerCase().includes('aggregate')) {
    return "For aggregate queries, you'll need GROUP BY to group rows and HAVING to filter groups. Don't forget to use functions like AVG() and COUNT().";
  }
  
  if (assignment.title.toLowerCase().includes('basic') || assignment.title.toLowerCase().includes('simple')) {
    return "Start with a basic SELECT statement. Use WHERE clause to filter rows based on conditions like salary > 50000.";
  }

  // Error-specific hints
  if (errorMessage) {
    if (errorMessage.toLowerCase().includes('syntax')) {
      return "There's a syntax error in your query. Check for missing commas, incorrect keywords, or unmatched parentheses.";
    }
    if (errorMessage.toLowerCase().includes('column')) {
      return "It looks like you're referencing a column that doesn't exist. Check the sample data to see the available column names.";
    }
    if (errorMessage.toLowerCase().includes('table')) {
      return "The table name might be incorrect. Make sure you're using the exact table names shown in the sample data.";
    }
  }

  // Return a random general hint
  return hints[hintsUsed % hints.length];
};

// Generate intelligent hint
router.post('/generate', async (req, res) => {
  try {
    // Validate request
    const { error, value } = hintSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { assignmentId, sessionId, userQuery, errorMessage } = value;

    // Get assignment details
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    // Get user's previous attempts
    const previousAttempts = await UserAttempt.find({
      sessionId,
      assignmentId
    }).sort({ createdAt: -1 }).limit(3);

    // Count hints used
    const hintsUsed = previousAttempts.reduce((count, attempt) => count + attempt.hintsUsed, 0);

    let hint;
    let usingFallback = false;

    // Try OpenAI if available
    if (openai) {
      try {
        // Create context for LLM
        const systemPrompt = `You are a SQL learning assistant. Your job is to provide helpful hints for SQL practice problems, NOT complete solutions.

IMPORTANT RULES:
1. NEVER provide the complete SQL query solution
2. Give conceptual hints and guidance only
3. Help users understand what they need to think about
4. Point them toward the right SQL concepts or clauses
5. If they have an error, explain what type of error it might be
6. Encourage step-by-step thinking
7. Keep hints concise and educational

Assignment: ${assignment.title}
Question: ${assignment.question}
Expected tables: ${assignment.expectedTables.map(t => t.name).join(', ')}`;

        let userContext = `The user is working on this SQL assignment. `;
        
        if (userQuery) {
          userContext += `Their current query attempt is: "${userQuery}". `;
        }
        
        if (errorMessage) {
          userContext += `They got this error: "${errorMessage}". `;
        }
        
        if (previousAttempts.length > 0) {
          userContext += `They have made ${previousAttempts.length} previous attempts. `;
        }

        userContext += `Please provide a helpful hint (not the solution) to guide them in the right direction.`;

        const completion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userContext }
          ],
          max_tokens: 200,
          temperature: 0.7,
        });

        hint = completion.choices[0].message.content;

      } catch (openaiError) {
        console.error('OpenAI API error:', openaiError);
        usingFallback = true;
        hint = getFallbackHint(assignment, userQuery, errorMessage, hintsUsed);
      }
    } else {
      // Use fallback hints
      usingFallback = true;
      hint = getFallbackHint(assignment, userQuery, errorMessage, hintsUsed);
    }

    // Update hints used count for the latest attempt
    if (previousAttempts.length > 0) {
      await UserAttempt.findByIdAndUpdate(
        previousAttempts[0]._id,
        { $inc: { hintsUsed: 1 } }
      );
    }

    res.json({
      hint,
      hintsUsed: hintsUsed + 1,
      usingFallback
    });

  } catch (error) {
    console.error('Hint generation error:', error);
    res.status(500).json({ error: 'Failed to generate hint' });
  }
});

module.exports = router;