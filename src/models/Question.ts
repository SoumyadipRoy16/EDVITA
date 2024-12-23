// src/models/Question.ts

import mongoose, { Schema, Document } from 'mongoose';

// Define the TestCase type (which represents the individual test cases for the question)
type TestCase = {
  input: string;
  output: string;
};

interface IQuestion extends Document {
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  testCases: TestCase[];
}

const TestCaseSchema = new Schema<TestCase>({
  input: { type: String, required: true },
  output: { type: String, required: true },
});

const QuestionSchema = new Schema<IQuestion>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
  testCases: { type: [TestCaseSchema], required: true }, // Array of TestCase objects
}, { timestamps: true });

// Create the Mongoose model
const Question = mongoose.models.Question || mongoose.model<IQuestion>('Question', QuestionSchema);

export default Question;
