// src/models/User.ts
import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  education: { type: String },
  skills: { 
    type: String,  // Comma-separated skills string
    default: ''
  },
  resumeLink: { 
    type: String,
    validate: {
      validator: function(v: string) {
        const urlRegex = /^(https?:\/\/)?(drive\.google\.com|www\.dropbox\.com|docs\.google\.com)\/.*$/i;
        return urlRegex.test(v);
      },
      message: 'Please provide a valid Google Drive or Dropbox link'
    }
  },
  // New test-related fields
  testAttempts: {
    type: Number,
    default: 0,
    max: 2  // Allow maximum 2 attempts
  },
  testCompleted: {
    type: Boolean,
    default: false
  },
  lastTestDate: {
    type: Date,
    default: null
  },
  testDisqualified: {
    type: Boolean,
    default: false
  },
  disqualificationReason: {
    type: String,
    enum: [
      null, 
      'Multiple Tab Switches', 
      'Suspected Cheating', 
      'Violation of Test Guidelines'
    ],
    default: null
  },
  testPerformance: {
    type: {
      totalTests: Number,
      passedTests: Number,
      averageMarks: Number
    },
    default: {
      totalTests: 0,
      passedTests: 0,
      averageMarks: 0
    }
  }
}, { timestamps: true })

export default mongoose.models.User || mongoose.model('User', UserSchema)
