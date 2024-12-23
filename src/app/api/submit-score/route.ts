// /api/submit-score.ts

import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Results from '@/models/Results' // Assuming you have a Results model

export async function POST(request: Request) {
  const { username, questionId, marks } = await request.json()

  try {
    const db = await connectDB()

    // Create a new result entry
    const newResult = new Results({
      username,
      questionId,
      marks,
      timestamp: new Date()
    })

    // Save it to the database
    await newResult.save()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error submitting score:', error)
    return NextResponse.json(
      { success: false, message: 'Error submitting score' },
      { status: 500 }
    )
  }
}
