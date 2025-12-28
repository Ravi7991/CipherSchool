# CipherSQLStudio

A browser-based SQL learning platform where students can practice SQL queries against pre-configured assignments with real-time execution and intelligent hints.

## Features

- Assignment listing with difficulty levels
- Interactive SQL editor with Monaco Editor
- Real-time query execution against PostgreSQL
- Sample data viewer for each assignment
- LLM-powered intelligent hints (not solutions)
- Mobile-first responsive design

## Tech Stack

### Frontend
- React.js
- Vanilla SCSS (mobile-first responsive)
- Monaco Editor for SQL editing

### Backend
- Node.js / Express.js
- PostgreSQL (sandbox database)
- MongoDB Atlas (persistence)

### LLM Integration
- OpenAI API for intelligent hints

## Project Structure

```
cipher-sql-studio/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── styles/          # SCSS files
│   │   ├── services/        # API services
│   │   └── utils/           # Utility functions
│   └── public/
├── backend/                 # Express.js backend
│   ├── src/
│   │   ├── routes/          # API routes
│   │   ├── models/          # MongoDB models
│   │   ├── services/        # Business logic
│   │   └── middleware/      # Express middleware
│   └── database/
│       └── seeds/           # Sample data
└── docs/
    └── data-flow-diagram.md # Hand-drawn data flow
```

## Setup Instructions

### Prerequisites
- Node.js (v16+)
- PostgreSQL
- MongoDB Atlas account

### Environment Variables

Create `.env` files in both frontend and backend directories using the provided `.env.example` files.

### Installation

1. Clone the repository
2. Install backend dependencies: `cd backend && npm install`
3. Install frontend dependencies: `cd frontend && npm install`
4. Set up PostgreSQL database with sample data
5. Configure MongoDB connection
6. Start backend: `npm run dev`
7. Start frontend: `npm start`

## Data Flow

User clicks "Execute Query" → Frontend validates → API call to backend → Query sanitization → PostgreSQL execution → Results formatting → Response to frontend → State update → UI display

## Technology Choices

- **React.js**: Component-based architecture for maintainable UI
- **SCSS**: Advanced CSS features with mobile-first approach
- **Monaco Editor**: Professional code editing experience
- **PostgreSQL**: Robust SQL database for query execution
- **MongoDB**: Flexible document storage for user data
- **Express.js**: Lightweight, fast backend framework