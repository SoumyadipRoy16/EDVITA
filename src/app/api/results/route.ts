import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'

type Result = {
  _id?: string
  username: string
  userId: string
  score: number
  questionId: string
  timestamp?: Date  // Changed to Date type
}

export async function POST(request: Request) {
  try {
    const { username, userId, score, questionId }: Result = await request.json()

    // Validate input
    if (!username || score === undefined || !questionId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Connect to the database
    const db = await connectDB()

    // Create result object with current timestamp
    const currentTimestamp = new Date()
    const resultToInsert = {
      username,
      userId,
      score,
      questionId,
      timestamp: currentTimestamp,
    }

    // Insert and get the result
    const { insertedId } = await db.collection('results').insertOne(resultToInsert)
    
    // Get the inserted document
    const insertedResult = await db.collection('results').findOne({ _id: insertedId })

    if (!insertedResult) {
      throw new Error('Failed to retrieve inserted result')
    }

    // Format the result for response
    const formattedResult: Result = {
      _id: insertedResult._id.toString(),
      username: insertedResult.username,
      userId: insertedResult.userId,
      score: insertedResult.score,
      questionId: insertedResult.questionId,
      timestamp: insertedResult.timestamp, // Keep as Date object
    }

    return NextResponse.json({ 
      message: 'Result submitted successfully', 
      result: formattedResult 
    })

  } catch (error) {
    console.error('Error submitting result:', error)
    return NextResponse.json(
      { error: 'Failed to submit result' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const db = await connectDB()

    // Fetch all results from the "results" collection
    const results = await db.collection('results').find({}).toArray()

    // If there are no results
    if (results.length === 0) {
      return NextResponse.json({ message: 'No results found' }, { status: 404 })
    }

    // Map over the results to format the data
    const transformedResults: Result[] = results.map((result) => ({
      _id: result._id.toString(),
      username: result.username,
      userId: result.userId,
      score: result.score,
      questionId: result.questionId,
      timestamp: new Date(result.timestamp), // Ensure timestamp is a Date object
    }))

    return NextResponse.json(transformedResults)
  } catch (error) {
    console.error('Error fetching results:', error)
    return NextResponse.json({ error: 'Failed to fetch results' }, { status: 500 })
  }
}