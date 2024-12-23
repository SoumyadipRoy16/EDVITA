// src/components/test/ProblemStatement.tsx

'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Example = {
  input: string
  output: string
  explanation: string
}

type ProblemProps = {
  title: string
  description: string
  examples?: Example[]
  isLoading?: boolean
}

export default function ProblemStatement({ 
  title, 
  description, 
  examples = [], 
  isLoading = false 
}: ProblemProps) {
  if (isLoading) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <div className="h-7 w-48 bg-muted animate-pulse rounded"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="h-4 bg-muted animate-pulse rounded"></div>
            <div className="h-4 bg-muted animate-pulse rounded w-3/4"></div>
            <div className="h-4 bg-muted animate-pulse rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="prose dark:prose-invert max-w-none">
          <p className="whitespace-pre-wrap">{description}</p>
          {examples.length > 0 && (
            <>
              <h3 className="text-lg font-semibold mt-4 mb-2">Examples:</h3>
              {examples.map((example, index) => (
                <div key={index} className="bg-muted p-4 rounded-md my-2">
                  <pre className="text-sm">
                    <code>
                      {`Input: ${example.input}
Output: ${example.output}${example.explanation ? `\nExplanation: ${example.explanation}` : ''}`}
                    </code>
                  </pre>
                </div>
              ))}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}