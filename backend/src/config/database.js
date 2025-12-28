const mongoose = require('mongoose');
const { Pool } = require('pg');

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.log('MongoDB connection failed, continuing without it:', error.message);
    // Don't exit the process, just continue without MongoDB
  }
};

// PostgreSQL connection pool
const pgPool = new Pool({
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  database: process.env.PG_DATABASE,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  ssl: process.env.NODE_ENV === 'production' || process.env.PG_HOST?.includes('supabase.co') 
    ? { rejectUnauthorized: false } 
    : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test PostgreSQL connection
pgPool.on('connect', () => {
  console.log('PostgreSQL connected successfully');
});

pgPool.on('error', (err) => {
  console.error('PostgreSQL connection error:', err);
});

module.exports = connectDB;
module.exports.pgPool = pgPool;