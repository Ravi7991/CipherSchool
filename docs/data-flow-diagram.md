# Data Flow Diagram - CipherSQLStudio

## User clicks "Execute Query" → Result Display Flow

This diagram shows the complete data flow when a user executes a SQL query in CipherSQLStudio.

```
[User Interface - SQL Editor]
           |
           | 1. User clicks "Execute Query" button
           ↓
[Frontend - AssignmentAttempt Component]
           |
           | 2. Validate query input (not empty)
           | 3. Set loading state (queryLoading = true)
           | 4. Clear previous results/errors
           ↓
[Frontend - API Service Layer]
           |
           | 5. HTTP POST request to /api/queries/execute
           | 6. Request body: { query, assignmentId, sessionId }
           ↓
[Backend - Express.js Server]
           |
           | 7. Route: POST /api/queries/execute
           | 8. Validate request with Joi schema
           | 9. Extract { query, assignmentId, sessionId }
           ↓
[Backend - Query Sanitization]
           |
           | 10. Remove dangerous SQL keywords (DROP, DELETE, etc.)
           | 11. Remove comments and multiple statements
           | 12. Validate it's a SELECT query only
           ↓
[Backend - PostgreSQL Connection]
           |
           | 13. Get connection from pool
           | 14. Set query timeout (10 seconds)
           | 15. Execute sanitized SQL query
           ↓
[PostgreSQL Database]
           |
           | 16. Process SQL query against sample data
           | 17. Return result set or error
           ↓
[Backend - Result Processing]
           |
           | 18. Calculate execution time
           | 19. Format results (columns, rows, rowCount)
           | 20. Save attempt to MongoDB (UserAttempt model)
           ↓
[Backend - MongoDB]
           |
           | 21. Store user attempt with:
           |     - sessionId, assignmentId, query
           |     - isSuccessful, executionTime, errorMessage
           ↓
[Backend - Response Formation]
           |
           | 22. Create response object:
           |     Success: { success: true, columns, rows, rowCount, executionTime }
           |     Error: { success: false, error: errorMessage, executionTime }
           ↓
[Frontend - API Response Handler]
           |
           | 23. Receive HTTP response
           | 24. Check response.data.success
           | 25. Update component state
           ↓
[Frontend - State Update]
           |
           | 26. Set queryLoading = false
           | 27. If success: setQueryResults(response.data)
           | 28. If error: setQueryError(response.data.error)
           ↓
[Frontend - UI Re-render]
           |
           | 29. QueryResults component receives new props
           | 30. Conditional rendering based on results/error
           ↓
[User Interface - Results Display]
           |
           | 31. Show results table with columns and rows
           | 32. Display execution stats (row count, time)
           | 33. OR show error message with details
           | 34. Provide "Clear" button for new queries
```

## Key Components Involved:

### Frontend Components:
- **AssignmentAttempt**: Main container managing query execution flow
- **SQLEditor**: Monaco editor for SQL input with keyboard shortcuts
- **QueryResults**: Results display with table formatting and error handling
- **API Service**: Axios-based HTTP client with interceptors

### Backend Services:
- **Express Router**: `/api/queries/execute` endpoint
- **Joi Validation**: Request schema validation
- **Query Sanitizer**: Security layer preventing dangerous SQL
- **PostgreSQL Pool**: Connection management for query execution
- **MongoDB Models**: UserAttempt tracking for analytics

### Database Layer:
- **PostgreSQL**: Sandbox database with pre-loaded sample data
- **MongoDB**: Persistence layer for user attempts and assignments

## Security Measures:
1. Query sanitization removes dangerous SQL operations
2. Only SELECT statements allowed
3. Query timeout prevents long-running queries
4. Rate limiting on API endpoints
5. Input validation with Joi schemas

## Error Handling:
- Frontend: Network errors, validation errors, loading states
- Backend: Database connection errors, SQL syntax errors, timeout errors
- User Experience: Clear error messages, retry mechanisms

## Performance Optimizations:
- PostgreSQL connection pooling
- Query timeout limits
- Result set size limitations
- Efficient state management in React
- Responsive table design for large result sets

---

*Note: This diagram was hand-drawn conceptually and then documented in text format to demonstrate understanding of the complete data flow architecture.*