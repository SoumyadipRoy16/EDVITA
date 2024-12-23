'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function MobileTestRestriction() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Desktop Only Test</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-4">
            This coding test is only accessible on desktop browsers.
          </p>
          <p className="text-muted-foreground mb-6">
            Please use a laptop or desktop computer to take the test.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}