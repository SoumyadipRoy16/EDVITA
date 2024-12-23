'use client'

import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pencil } from 'lucide-react';
import EyeIcon from '@/components/ui/eye-icon';

type Submission = {
  _id: string;
  username: string;
  userId: string;
  questionId: string;
  code: string;
  timestamp: Date;
  submittedScore?: number;
};

export default function MonitorResults() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [scores, setScores] = useState<{ [key: string]: number }>({});
  const [editMode, setEditMode] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const storedScores = localStorage.getItem('scores');
    const initialScores = storedScores ? JSON.parse(storedScores) : {};

    const storedEditMode = localStorage.getItem('editMode');
    const initialEditMode = storedEditMode ? JSON.parse(storedEditMode) : {};

    async function fetchSubmissions() {
      try {
        const response = await fetch('/api/submissions');
        const data = await response.json();

        const transformedData = data.map((submission: any) => ({
          ...submission,
          timestamp: new Date(submission.timestamp),
          submittedScore: submission.score,
        }));

        const updatedScores: { [key: string]: number } = { ...initialScores };
        transformedData.forEach((submission: Submission) => {
          if (
            submission.submittedScore !== undefined &&
            updatedScores[submission._id] === undefined
          ) {
            updatedScores[submission._id] = submission.submittedScore;
          }
        });

        setSubmissions(transformedData);
        setScores(updatedScores);
        setEditMode((prev) => ({
          ...prev,
          ...transformedData.reduce(
            (acc: any, sub: { _id: string | number; }) => ({
              ...acc,
              [sub._id]: !!updatedScores[sub._id], // Enable edit if score exists
            }),
            {}
          ),
        }));
      } catch (error) {
        console.error('Error fetching submissions:', error);
      }
    }

    fetchSubmissions();
  }, []);

  useEffect(() => {
    localStorage.setItem('scores', JSON.stringify(scores));
    localStorage.setItem('editMode', JSON.stringify(editMode));
  }, [scores, editMode]);

  const handleScoreChange = (submissionId: string, score: number) => {
    setScores((prevScores) => ({
      ...prevScores,
      [submissionId]: score,
    }));
  };

  const handleSubmit = async (submissionId: string, username: string, userId: string, questionId: string) => {
    const score = scores[submissionId];

    if (score === undefined) {
      alert("Please enter a score before submitting.");
      return;
    }

    try {
      const response = await fetch('/api/results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          userId,
          score,
          questionId,
        }),
      });

      if (response.ok) {
        setSubmissions((prevSubmissions) =>
          prevSubmissions.map((sub) =>
            sub._id === submissionId ? { ...sub, submittedScore: score } : sub
          )
        );
        setEditMode((prev) => ({ ...prev, [submissionId]: true })); // Enable edit mode after submission
        alert('Result submitted successfully');
      } else {
        alert('Failed to submit result');
      }
    } catch (error) {
      console.error('Error submitting result:', error);
      alert('Error submitting result');
    }
  };

  const handleEdit = (submissionId: string) => {
    setEditMode((prev) => ({ ...prev, [submissionId]: false })); // Enable score editing
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Monitor Results</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">User</TableHead>
            <TableHead className="text-center">Student Id</TableHead>
            <TableHead className="text-center">Question Id</TableHead>
            <TableHead className="text-center">Code</TableHead>
            <TableHead className="text-center">Score</TableHead>
            <TableHead className="text-center">Timestamp</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {submissions.map((submission) => {
            const isEditing = !editMode[submission._id];
            const isSubmitted = editMode[submission._id];

            return (
              <TableRow key={submission._id}>
                <TableCell>{submission.username}</TableCell>
                <TableCell>{submission.userId}</TableCell>
                <TableCell>{submission.questionId}</TableCell>
                <TableCell className="text-center">
                  <EyeIcon code={submission.code} />
                </TableCell>
                <TableCell>
                  <input
                    type="number"
                    value={scores[submission._id] || ''}
                    onChange={(e) =>
                      handleScoreChange(submission._id, parseFloat(e.target.value))
                    }
                    className={`border dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 p-1 rounded w-full
                      ${!isEditing ? 'bg-gray-100 dark:bg-gray-900 cursor-not-allowed' : ''}`}
                    placeholder="Enter score"
                    disabled={!isEditing}
                  />
                </TableCell>
                <TableCell>{submission.timestamp.toLocaleString()}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        handleSubmit(submission._id, submission.username, submission.userId, submission.questionId)
                      }
                      disabled={!isEditing}
                      className={`px-4 py-2 rounded transition-colors flex-1 ${
                        isEditing
                          ? 'bg-blue-500 hover:bg-blue-600 text-white'
                          : 'bg-gray-300 cursor-not-allowed dark:bg-gray-700'
                      }`}
                    >
                      Submit
                    </button>
                    <button
                      onClick={() => handleEdit(submission._id)}
                      disabled={isEditing}
                      className={`p-2 rounded transition-colors ${
                        !isEditing
                          ? 'bg-gray-500 hover:bg-gray-600 text-white'
                          : 'bg-gray-300 cursor-not-allowed dark:bg-gray-700'
                      }`}
                      title="Edit score"
                    >
                      <Pencil className="h-5 w-5" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
