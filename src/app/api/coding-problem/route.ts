// /api/coding-problem/route.ts

import { NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import connectDB from '@/lib/mongodb'

// Types
type TestCase = {
  input: string
  output: string
}

type Question = {
  id: string
  title: string
  description: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  testCases: TestCase[]
}

type Submission = {
  userId: string
  username: string  // New field
  questionId: string
  code: string
  language: string
  timestamp: Date
}

// Helper function to get user info from token
async function getUserFromToken(token: string) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as {
      userId: string
      email: string
    }
    
    const db = await connectDB()
    const user = await db.collection('users').findOne({ email: decoded.email })
    
    if (!user) {
      throw new Error('User not found')
    }
    
    return {
      userId: user._id.toString(),
      username: `${user.firstName} ${user.lastName}`.trim()
    }
  } catch (error) {
    throw new Error('Invalid token')
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const currentQuestionId = searchParams.get('currentQuestionId')
    
    const db = await connectDB()
    let query = {}
    
    if (currentQuestionId) {
      // Get the next question after the current one
      const currentQuestion = await db.collection('questions').findOne({
        _id: new ObjectId(currentQuestionId)
      })
      
      if (currentQuestion) {
        query = {
          _id: { $gt: new ObjectId(currentQuestionId) }
        }
      }
    }
    
    const question = await db.collection('questions')
      .findOne(query, { sort: { _id: 1 } })
    
    if (!question) {
      return NextResponse.json(
        { message: 'No more questions available' },
        { status: 404 }
      )
    }
    
    const transformedQuestion: Question = {
      id: question._id.toString(),
      title: question.title,
      description: question.description,
      difficulty: question.difficulty,
      testCases: question.testCases
    }
    
    return NextResponse.json(transformedQuestion)
  } catch (error) {
    console.error('GET Question Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch question' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const submission = await request.json()
    
    // Validate submission
    if (!submission.questionId || !submission.code || !submission.language) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Get token from cookies
    const token = cookies().get('token')
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    // Get user info from token
    const userInfo = await getUserFromToken(token.value)
    
    const db = await connectDB()
    
    // Save the submission with user info
    const submissionWithUserInfo: Submission = {
      ...submission,
      userId: userInfo.userId,
      username: userInfo.username,
      timestamp: new Date()
    }
    
    await db.collection('submissions').insertOne(submissionWithUserInfo)
    
    // Get the next question
    const nextQuestion = await db.collection('questions').findOne(
      { _id: { $gt: new ObjectId(submission.questionId) } },
      { sort: { _id: 1 } }
    )
    
    if (!nextQuestion) {
      return NextResponse.json(
        { message: 'No more questions available', isComplete: true },
        { status: 200 }
      )
    }
    
    const transformedQuestion: Question = {
      id: nextQuestion._id.toString(),
      title: nextQuestion.title,
      description: nextQuestion.description,
      difficulty: nextQuestion.difficulty,
      testCases: nextQuestion.testCases
    }
    
    return NextResponse.json({
      message: 'Submission successful',
      nextQuestion: transformedQuestion
    })
  } catch (error) {
    console.error('POST Submission Error:', error)
    return NextResponse.json(
      { error: 'Failed to submit code' },
      { status: 500 }
    )
  }
}