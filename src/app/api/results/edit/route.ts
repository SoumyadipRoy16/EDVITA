import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

type ResultEdit = {
  submissionId: string
  username: string
  score: number
  questionId: string
  timestamp: Date
}

export async function PUT(request: Request) {
  try {
    const { submissionId, username, score, questionId, timestamp }: ResultEdit = await request.json()

    // Validate input
    if (!submissionId || !username || score === undefined || !questionId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Connect to the database
    const db = await connectDB()

    // Convert submissionId string to ObjectId
    const objectId = new ObjectId(submissionId)

    // First check if the record exists
    const existingResult = await db.collection('results').findOne({ _id: objectId })

    if (!existingResult) {
      return NextResponse.json(
        { error: 'Result not found' },
        { status: 404 }
      )
    }

    // Update the result
    const updateResult = await db.collection('results').findOneAndUpdate(
      { _id: objectId },
      { 
        $set: { 
          score: score,
          username: username,
          questionId: questionId,
          timestamp: new Date(timestamp)
        } 
      },
      { returnDocument: 'after' }
    )

    // Handle the case where updateResult is null
    if (!updateResult?.value) {
      return NextResponse.json(
        { error: 'Failed to update result' },
        { status: 500 }
      )
    }

    // Format the updated result for response
    const formattedResult = {
      _id: updateResult.value._id.toString(),
      username: updateResult.value.username,
      score: updateResult.value.score,
      questionId: updateResult.value.questionId,
      timestamp: updateResult.value.timestamp
    }

    return NextResponse.json({ 
      message: 'Result updated successfully', 
      result: formattedResult 
    })

  } catch (error) {
    console.error('Error updating result:', error)
    if (error instanceof Error && error.message.includes('ObjectId')) {
      return NextResponse.json(
        { error: 'Invalid submission ID format' },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to update result' },
      { status: 500 }
    )
  }
}