'use client'

import { useState, useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Toast } from "@/components/ui/toast"
import { Card, CardContent } from "@/components/ui/card"
import { PlusCircle, Trash2 } from 'lucide-react'

type TestCase = {
  input: string
  output: string
}

type Question = {
  id: string
  title: string
  description: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  testCases: TestCase[]
}

type QuestionFormData = Omit<Question, 'id'>

type ToastState = {
  visible: boolean
  message: string
  variant: 'default' | 'destructive'
}

export default function ManageQuestions() {
  const [questions, setQuestions] = useState<Question[]>([])
  const { register, control, handleSubmit, reset, setValue } = useForm<QuestionFormData>({
    defaultValues: {
      testCases: [{ input: '', output: '' }]
    }
  })
  const { fields, append, remove } = useFieldArray({
    control,
    name: "testCases"
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toast, setToast] = useState<ToastState>({
    visible: false,
    message: '',
    variant: 'default'
  })

  useEffect(() => {
    fetchQuestions()
  }, [])

  useEffect(() => {
    if (toast.visible) {
      const timer = setTimeout(() => {
        setToast(prev => ({ ...prev, visible: false }))
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [toast.visible])

  const showToast = (message: string, variant: 'default' | 'destructive') => {
    setToast({
      visible: true,
      message,
      variant
    })
  }

  const fetchQuestions = async () => {
    try {
      const response = await fetch('/api/admin/questions')
      if (response.ok) {
        const data = await response.json()
        // Ensure each question has a testCases array
        const validatedData = data.map((question: any) => ({
          ...question,
          testCases: Array.isArray(question.testCases) ? question.testCases : []
        }))
        setQuestions(validatedData)
      } else {
        showToast('Failed to fetch questions', 'destructive')
      }
    } catch (error) {
      console.error('Error fetching questions:', error)
      showToast('An unexpected error occurred while fetching questions', 'destructive')
    }
  }

  const onSubmit = async (data: QuestionFormData) => {
    setIsSubmitting(true)
    try {
      // Ensure testCases array exists
      const submitData = {
        ...data,
        testCases: data.testCases || []
      }

      const response = await fetch('/api/admin/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      })

      if (response.ok) {
        showToast('Question added successfully', 'default')
        reset()
        fetchQuestions()
      } else {
        showToast('Failed to add question', 'destructive')
      }
    } catch (error) {
      console.error('Error adding question:', error)
      showToast('An unexpected error occurred while adding the question', 'destructive')
    }
    setIsSubmitting(false)
  }

  const deleteQuestion = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/questions?id=${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        showToast('Question deleted successfully', 'default')
        fetchQuestions()
      } else {
        showToast('Failed to delete question', 'destructive')
      }
    } catch (error) {
      console.error('Error deleting question:', error)
      showToast('An unexpected error occurred while deleting the question', 'destructive')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {toast.visible && (
        <Toast
          message={toast.message}
          variant={toast.variant}
          state="visible"
        />
      )}
      <h1 className="text-3xl font-bold mb-6">Manage Questions</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="mb-8 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Question Title</Label>
          <Input
            id="title"
            {...register('title', { required: 'Title is required' })}
            placeholder="Enter question title"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Question Description</Label>
          <Textarea
            id="description"
            {...register('description', { required: 'Description is required' })}
            placeholder="Enter question description"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="difficulty">Difficulty</Label>
          <Select onValueChange={(value) => setValue('difficulty', value as 'Easy' | 'Medium' | 'Hard')}>
            <SelectTrigger>
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Easy">Easy</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-4">
          <Label>Test Cases</Label>
          {fields.map((field, index) => (
            <Card key={field.id}>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`testCases.${index}.input`}>Input</Label>
                    <Input
                      {...register(`testCases.${index}.input` as const, { required: true })}
                      placeholder="Enter test case input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`testCases.${index}.output`}>Output</Label>
                    <Input
                      {...register(`testCases.${index}.output` as const, { required: true })}
                      placeholder="Enter expected output"
                    />
                  </div>
                </div>
                {index > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Remove Test Case
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ input: '', output: '' })}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Test Case
          </Button>
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Adding...' : 'Add Question'}
        </Button>
      </form>
      <div className="space-y-4">
        {questions.map((question) => (
          <Card key={question.id}>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold">{question.title}</h3>
              <p className="text-gray-600">{question.description}</p>
              <p className="text-sm text-gray-500">Difficulty: {question.difficulty}</p>
              <div className="mt-4">
                <h4 className="font-semibold">Test Cases:</h4>
                {(question.testCases || []).map((testCase, index) => (
                  <div key={index} className="mt-2">
                    <p>Input: {testCase.input}</p>
                    <p>Output: {testCase.output}</p>
                  </div>
                ))}
              </div>
              <Button variant="destructive" onClick={() => deleteQuestion(question.id)} className="mt-4">
                Delete
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}