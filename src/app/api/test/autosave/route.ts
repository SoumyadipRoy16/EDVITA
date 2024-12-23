// app/api/test/autosave/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Submission from '@/models/Submission';
import Question from '@/models/Question';
import User from '@/models/User';

export async function POST(req: NextRequest) {
  try {
    // Connect to the database
    await connectDB();

    // Parse the request body
    const { 
      questionId, 
      code, 
      language 
    } = await req.json();

    // Get user from headers
    const userEmail = req.headers.get('x-user-email');
    
    if (!userEmail) {
      return NextResponse.json({ 
        success: false, 
        message: 'User not authenticated' 
      }, { status: 401 });
    }

    // Find the user and question
    const user = await User.findOne({ email: userEmail });
    const question = await Question.findById(questionId);

    if (!user || !question) {
      return NextResponse.json({ 
        success: false, 
        message: 'User or Question not found' 
      }, { status: 404 });
    }

    // Create or update the submission
    const submission = await Submission.findOneAndUpdate(
      { 
        userId: user._id, 
        questionId: question._id 
      },
      {
        code,
        language,
        username: `${user.firstName} ${user.lastName}`,
        questionTitle: question.title,
        timestamp: new Date()
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ 
      success: true, 
      message: 'Code autosaved successfully',
      submissionId: submission._id
    });

  } catch (error) {
    console.error('Autosave route error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'An error occurred while autosaving' 
    }, { status: 500 });
  }
}