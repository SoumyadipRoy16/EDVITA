// src/app/api/test-performance/route.ts

import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Submission from '@/models/Submission';

export async function GET() {
  try {
    await connectDB();
    const submissions = await Submission.find()
      .sort({ timestamp: -1 })
      .select('username questionTitle code score timestamp');
    
    return NextResponse.json(submissions);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch submissions' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { id, score } = await request.json();
    await connectDB();
    
    const submission = await Submission.findByIdAndUpdate(
      id,
      { score },
      { new: true }
    );
    
    if (!submission) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(submission);
  } catch (error) {
    console.error('Error updating submission score:', error);
    return NextResponse.json(
      { error: 'Failed to update submission score' },
      { status: 500 }
    );
  }
}