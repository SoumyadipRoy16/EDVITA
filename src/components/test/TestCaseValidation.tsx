// src/components/test/TestCaseValidation.tsx

'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type TestCase = {
  input: string
  output: string
}

type TestCaseValidationProps = {
  testCases: TestCase[]
  isLoading?: boolean
}

export default function TestCaseValidation({ 
  testCases, 
  isLoading = false 
}: TestCaseValidationProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-7 w-32 bg-muted animate-pulse rounded"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border-b pb-4 last:border-b-0">
                <div className="h-4 bg-muted animate-pulse rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-muted animate-pulse rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Test Cases</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {testCases.map((testCase, index) => (
            <div key={index} className="border-b pb-4 last:border-b-0">
              <p>
                <span className="font-medium">Input:</span> {testCase.input}
              </p>
              <p>
                <span className="font-medium">Expected Output:</span>{' '}
                {testCase.output}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}