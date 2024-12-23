'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type Application = {
  id: number
  user: string
  averageScore: number
  status: 'pending' | 'approved' | 'rejected'
}

export default function ApproveApplications() {
  const [applications, setApplications] = useState<Application[]>([
    { id: 1, user: 'John Doe', averageScore: 92, status: 'pending' },
    { id: 2, user: 'Jane Smith', averageScore: 88, status: 'pending' },
  ])

  const updateStatus = (id: number, newStatus: 'approved' | 'rejected') => {
    setApplications(applications.map(app => 
      app.id === id ? { ...app, status: newStatus } : app
    ))
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Approve Applications</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Average Score</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((application) => (
            <TableRow key={application.id}>
              <TableCell>{application.user}</TableCell>
              <TableCell>{application.averageScore}</TableCell>
              <TableCell>{application.status}</TableCell>
              <TableCell>
                {application.status === 'pending' && (
                  <div className="space-x-2">
                    <Button onClick={() => updateStatus(application.id, 'approved')} variant="default">
                      Approve
                    </Button>
                    <Button onClick={() => updateStatus(application.id, 'rejected')} variant="destructive">
                      Reject
                    </Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}