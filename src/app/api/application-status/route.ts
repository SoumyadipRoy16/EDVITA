import { NextResponse } from 'next/server'

export async function GET() {
  // In a real application, this data would come from a database
  const applicationStatus = [
    { name: 'Application Submitted', status: 'complete' },
    { name: 'Resume Review', status: 'complete' },
    { name: 'Coding Test', status: 'current' },
    { name: 'Interview', status: 'upcoming' },
    { name: 'Final Decision', status: 'upcoming' },
  ]

  return NextResponse.json(applicationStatus)
}

