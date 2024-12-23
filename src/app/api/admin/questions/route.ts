// /api/admin/questions/route.ts

import { NextResponse } from 'next/server'
import { ObjectId, WithId, Document } from 'mongodb'
import connectDB from '@/lib/mongodb'

// Types to match the page component
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

type QuestionDB = Omit<Question, 'id'> & {
  _id: ObjectId
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const difficulty = searchParams.get('difficulty')
    
    const db = await connectDB()
    const questionsRaw = await db.collection('questions').find(
      difficulty ? { difficulty } : {}
    ).toArray()
    
    // Cast the raw documents to our QuestionDB type
    const questions = questionsRaw as WithId<Document>[] as QuestionDB[]
    
    // Transform _id to id for frontend compatibility
    const transformedQuestions: Question[] = questions.map(q => ({
      id: q._id.toString(),
      title: q.title,
      description: q.description,
      difficulty: q.difficulty,
      testCases: q.testCases
    }))
    
    return NextResponse.json(transformedQuestions)
  } catch (error) {
    console.error('GET Questions Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch questions' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const question = await request.json()
    
    // Validate required fields
    if (!question.title || !question.description || !question.difficulty || !question.testCases) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Validate test cases
    if (!Array.isArray(question.testCases) || question.testCases.length === 0) {
      return NextResponse.json(
        { error: 'At least one test case is required' },
        { status: 400 }
      )
    }

    // Validate test case format
    const validTestCases = question.testCases.every(
      (tc: any) => typeof tc.input === 'string' && typeof tc.output === 'string'
    )
    if (!validTestCases) {
      return NextResponse.json(
        { error: 'Invalid test case format' },
        { status: 400 }
      )
    }

    // Validate difficulty
    if (!['Easy', 'Medium', 'Hard'].includes(question.difficulty)) {
      return NextResponse.json(
        { error: 'Invalid difficulty level' },
        { status: 400 }
      )
    }
    
    const db = await connectDB()
    const result = await db.collection('questions').insertOne(question)
    
    return NextResponse.json({ 
      success: true, 
      id: result.insertedId.toString() 
    })
  } catch (error) {
    console.error('POST Question Error:', error)
    return NextResponse.json(
      { error: 'Failed to create question' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const { id, ...updateData } = await request.json()
    
    if (!id) {
      return NextResponse.json(
        { error: 'Question ID is required' },
        { status: 400 }
      )
    }

    // Validate update data
    if (updateData.difficulty && !['Easy', 'Medium', 'Hard'].includes(updateData.difficulty)) {
      return NextResponse.json(
        { error: 'Invalid difficulty level' },
        { status: 400 }
      )
    }

    if (updateData.testCases) {
      if (!Array.isArray(updateData.testCases) || updateData.testCases.length === 0) {
        return NextResponse.json(
          { error: 'At least one test case is required' },
          { status: 400 }
        )
      }

      const validTestCases = updateData.testCases.every(
        (tc: any) => typeof tc.input === 'string' && typeof tc.output === 'string'
      )
      if (!validTestCases) {
        return NextResponse.json(
          { error: 'Invalid test case format' },
          { status: 400 }
        )
      }
    }
    
    const db = await connectDB()
    const result = await db.collection('questions').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    )
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ 
      success: true, 
      modifiedCount: result.modifiedCount 
    })
  } catch (error) {
    console.error('PUT Question Error:', error)
    return NextResponse.json(
      { error: 'Failed to update question' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { error: 'Question ID is required' },
        { status: 400 }
      )
    }
    
    const db = await connectDB()
    const result = await db.collection('questions').deleteOne({
      _id: new ObjectId(id)
    })
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ 
      success: true, 
      deletedCount: result.deletedCount 
    })
  } catch (error) {
    console.error('DELETE Question Error:', error)
    return NextResponse.json(
      { error: 'Failed to delete question' },
      { status: 500 }
    )
  }
}