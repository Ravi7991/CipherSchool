const mongoose = require('mongoose');

const userAttemptSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true
  },
  assignmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment',
    required: true
  },
  query: {
    type: String,
    required: true
  },
  isSuccessful: {
    type: Boolean,
    required: true
  },
  executionTime: {
    type: Number, // in milliseconds
    required: false
  },
  errorMessage: {
    type: String,
    required: false
  },
  hintsUsed: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('UserAttempt', userAttemptSchema);