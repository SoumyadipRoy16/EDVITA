// /models/Results.ts

import { Schema, model, models } from 'mongoose'

const resultsSchema = new Schema(
  {
    username: { type: String, required: true },
    questionId: { type: String, required: true },
    marks: { type: Number, required: true },
    timestamp: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
)

const Results = models.Results || model('Results', resultsSchema)

export default Results
