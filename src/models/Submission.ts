// src/models/Submission.ts

import mongoose, { Schema, Document } from 'mongoose';

interface Submission extends Document {
  userId: string;
  questionId: string;
  code: string;
  language: string;
  username: string;
  questionTitle: string;
  timestamp: Date;
}

const submissionSchema = new Schema<Submission>({
  userId: { type: String, required: true },
  questionId: { type: String, required: true },
  code: { type: String, required: true },
  language: { type: String, required: true },
  username: { type: String, required: true },
  questionTitle: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Submission = mongoose.models.Submission || mongoose.model<Submission>('Submission', submissionSchema);

export default Submission;
