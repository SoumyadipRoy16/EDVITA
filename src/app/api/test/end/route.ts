// app/api/test/end/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Results from '@/models/Results';
import { getServerSession } from 'next-auth';

export async function POST(req: NextRequest) {
  try {
    // Connect to the database
    await connectDB();

    // Parse the request body
    const { 
      questionId, 
      totalMarks, 
      timeTaken, 
      passed 
    } = await req.json();

    // Get user from headers or session
    const userEmail = req.headers.get('x-user-email');
    
    if (!userEmail) {
      return NextResponse.json({ 
        success: false, 
        message: 'User not authenticated' 
      }, { status: 401 });
    }

    // Find the user
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return NextResponse.json({ 
        success: false, 
        message: 'User not found' 
      }, { status: 404 });
    }

    // Create a new result entry
    const newResult = await Results.create({
      username: user.firstName + ' ' + user.lastName,
      questionId,
      marks: totalMarks,
      timestamp: new Date(),
      timeTaken,
      passed
    });

    // Update user's test status (you might want to add these fields to your User model)
    user.testCompleted = true;
    user.lastTestDate = new Date();
    await user.save();

    return NextResponse.json({ 
      success: true, 
      message: 'Test completed successfully',
      result: newResult
    });

  } catch (error) {
    console.error('Test end route error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'An error occurred while ending the test' 
    }, { status: 500 });
  }
}