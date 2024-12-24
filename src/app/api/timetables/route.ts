

import { NextRequest, NextResponse } from 'next/server'
import { MongoClient, ObjectId } from 'mongodb'

const uri = process.env.MONGODB_URI
const client = new MongoClient(uri!)

async function connectToDb() {
  try {
    await client.connect()
    return client.db('timetable')
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error)
    throw error
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const db = await connectToDb()
    const timetables = await db
      .collection('timetables')
      .find()
      .sort({ createdAt: -1 })
      .toArray()
    
    return NextResponse.json(timetables)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch timetables' }, { status: 500 })
  } finally {
    await client.close()
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const timetable = await request.json()
    const db = await connectToDb()
    
    const result = await db.collection('timetables').insertOne({
      ...timetable,
      createdAt: new Date()
    })
    
    return NextResponse.json({ id: result.insertedId })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save timetable' }, { status: 500 })
  } finally {
    await client.close()
  }
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    const db = await connectToDb()
    await db.collection('timetables').deleteOne({ _id: new ObjectId(id) })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete timetable' }, { status: 500 })
  } finally {
    await client.close()
  }
}