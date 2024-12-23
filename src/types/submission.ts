// /types/submission.ts

export interface ITestCase {
    input: string;
    output: string;
  }
  
  export interface IQuestion {
    id: string;
    title: string;
    description: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    testCases: ITestCase[];
  }
  
  export interface ISubmission {
    _id: string;
    userId: string;
    username: string;
    questionTitle: string;
    code: string;
    language: string;
    score: number | null;
    timestamp: string;
  }

  export type TestCaseResult = {
    input: string;
    expectedOutput: string;
    actualOutput: string;
    passed: boolean;
  };
  
  // Define the submission type for the test submission
  export type SubmissionType = {
    questionId: string;
    code: string;
    language: string;
    testCaseResults: TestCaseResult[];
    totalMarks: number;
  };