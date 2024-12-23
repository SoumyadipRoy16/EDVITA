// app/api/test/submit/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Submission from '@/models/Submission';
import Results from '@/models/Results';
import Question from '@/models/Question';
import User from '@/models/User';
import { SubmissionType } from '@/types/submission';

export async function POST(req: NextRequest) {
  try {
    // Connect to the database
    await connectDB();

    // Parse the request body
    const { 
      questionId, 
      code, 
      language,
      testCaseResults,
      totalMarks
    }: SubmissionType = await req.json();

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

    // Create the final submission
    const submission = await Submission.create({
      userId: user._id,
      questionId: question._id,
      code,
      language,
      username: `${user.firstName} ${user.lastName}`,
      questionTitle: question.title,
      timestamp: new Date()
    });

    // Create the result
    const result = await Results.create({
      username: `${user.firstName} ${user.lastName}`,
      questionId: question._id,
      marks: totalMarks,
      timestamp: new Date(),
      testCaseResults,
      passed: totalMarks >= (question.testCases.length * 0.6) // Assuming 60% pass threshold
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Test submitted successfully',
      submissionId: submission._id,
      resultId: result._id,
      passed: result.passed
    });

  } catch (error) {
    console.error('Test submit route error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'An error occurred while submitting the test' 
    }, { status: 500 });
  }
}