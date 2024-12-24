
'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { PlusCircle, Trash2, Download } from 'lucide-react'
import { Toast } from "@/components/ui/toast"



type Department = 'CSE(AI&ML)' | 'IT' | 'ME'

type SubjectTeacher = {
  subject: string
  teacher: string
}

type TimeSlot = {
  startTime: string
  endTime: string
}

type Timetable = {
  _id?: string
  departmentName: Department
  daysOpen: string[]
  numberOfPeriods: number
  timeSlots: TimeSlot[]
  breakTime: TimeSlot
  schedule: Record<string, SubjectTeacher[]>
  createdAt: Date
}

const departments: Department[] = ['CSE(AI&ML)', 'IT', 'ME']
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const subjectTeacherPairs = {
  'CSE(AI&ML)': [
    { subject: "Physics", teacher: "Prof. Dibyendu Mal" },
    { subject: "Chemistry", teacher: "Prof. Priya Sharma" },
    { subject: "Mathematics", teacher: "Prof. Ananya Das" },
    { subject: "Computer Science", teacher: "Prof. Arjun Patel" },
    { subject: "English", teacher: "Prof. Nisha Gupta" }
  ],
  'IT': [
    { subject: "Programming", teacher: "Prof. Rakesh Verma" },
    { subject: "Database", teacher: "Prof. Anjali Desai" },
    { subject: "Networking", teacher: "Prof. Maya Shah" },
    { subject: "Web Development", teacher: "Prof. Sanjay Kumar" },
    { subject: "Data Structures", teacher: "Prof. Ritu Patel" }
  ],
  'ME': [
    { subject: "Thermodynamics", teacher: "Prof. Ajay Gupta" },
    { subject: "Mechanics", teacher: "Prof. Pooja Shah" },
    { subject: "Machine Design", teacher: "Prof. Sameer Verma" },
    { subject: "Fluid Mechanics", teacher: "Prof. Rajesh Kumar" },
    { subject: "Manufacturing", teacher: "Prof. Pradeep Singh" }
  ]
} as const

export default function TimetablePage() {
  const [selectedDept, setSelectedDept] = useState<Department>('CSE(AI&ML)')
  const [selectedDays, setSelectedDays] = useState<string[]>([])
  const [periods, setPeriods] = useState(6)
  const [startTime, setStartTime] = useState('09:00')
  const [endTime, setEndTime] = useState('17:00')
  const [breakStart, setBreakStart] = useState('13:00')
  const [breakEnd, setBreakEnd] = useState('14:00')
  const [selectedPairs, setSelectedPairs] = useState<SubjectTeacher[]>([])
  const [timetables, setTimetables] = useState<Timetable[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [toast, setToast] = useState<{
    message: string, 
    variant?: "default" | "destructive", 
    visible: boolean
  }>({
    message: "",
    variant: "default",
    visible: false
  })

  const showToast = (message: string, variant: "default" | "destructive" = "destructive") => {
    setToast({ message, variant, visible: true })
    
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }))
    }, 3000)
  }

  
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

function randomizeSchedule(selectedPairs: SubjectTeacher[], periods: number): SubjectTeacher[] {
  const schedule: SubjectTeacher[] = []
  const shuffledPairs = shuffleArray([...selectedPairs])
  
  for (let i = 0; i < periods; i++) {
    schedule.push(shuffledPairs[i % shuffledPairs.length])
  }
  
  return shuffleArray(schedule)
}

  useEffect(() => {
    fetchTimetables()
  }, [])

  const fetchTimetables = async () => {
    try {
      const response = await fetch('/api/timetables')
      if (response.ok) {
        const data = await response.json()
        setTimetables(data)
      }
    } catch (error) {
      showToast("Failed to fetch timetables", "destructive")
    }
  }

  const generateTimeSlots = () => {
    const slots: TimeSlot[] = []
    const start = new Date(`2024-01-01T${startTime}`)
    const end = new Date(`2024-01-01T${endTime}`)
    const duration = (end.getTime() - start.getTime()) / periods
    
    let current = start
    for (let i = 0; i < periods; i++) {
      const slotEnd = new Date(current.getTime() + duration)
      slots.push({
        startTime: current.toTimeString().slice(0, 5),
        endTime: slotEnd.toTimeString().slice(0, 5)
      })
      current = slotEnd
    }
    return slots
  }

  const generateSchedule = () => {
    const schedule: Record<string, SubjectTeacher[]> = {}
    selectedDays.forEach(day => {
      schedule[day] = Array(periods).fill(null).map((_, i) => {
        return selectedPairs[i % selectedPairs.length]
      })
    })
    return schedule
  }

  const handleSubmit = async () => {
    if (selectedDays.length === 0 || selectedPairs.length === 0) {
      showToast("Please select days and subject-teacher pairs","destructive")
      return
    }

    setIsLoading(true)
    const timeSlots = generateTimeSlots()
    const schedule = generateSchedule()

    const timetable: Omit<Timetable, '_id' | 'createdAt'> = {
      departmentName: selectedDept,
      daysOpen: selectedDays,
      numberOfPeriods: periods,
      timeSlots,
      breakTime: { startTime: breakStart, endTime: breakEnd },
      schedule
    }

    try {
      const response = await fetch('/api/timetables', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(timetable)
      })

      if (response.ok) {
        showToast("Timetable saved successfully", "default")
        fetchTimetables()
      } else {
        throw new Error('Failed to save timetable')
      }
    } catch (error) {
      showToast("Failed to save timetable")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div className="space-y-2">
          <Label>Department</Label>
          <Select value={selectedDept} onValueChange={(value: Department) => setSelectedDept(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              {departments.map(dept => (
                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Working Days</Label>
          <div className="flex flex-wrap gap-2">
            {days.map(day => (
              <Button
                key={day}
                variant={selectedDays.includes(day) ? "default" : "outline"}
                onClick={() => {
                  setSelectedDays(prev =>
                    prev.includes(day)
                      ? prev.filter(d => d !== day)
                      : [...prev, day]
                  )
                }}
              >
                {day}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Number of Periods</Label>
            <Input
              type="number"
              value={periods}
              onChange={e => setPeriods(Number(e.target.value))}
              min={1}
            />
          </div>
          <div>
            <Label>Times</Label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="time"
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
              />
              <Input
                type="time"
                value={endTime}
                onChange={e => setEndTime(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div>
          <Label>Break Time</Label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="time"
              value={breakStart}
              onChange={e => setBreakStart(e.target.value)}
            />
            <Input
              type="time"
              value={breakEnd}
              onChange={e => setBreakEnd(e.target.value)}
            />
          </div>
        </div>

        <div>
          <Label>Subject-Teacher Pairs</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
            {subjectTeacherPairs[selectedDept].map((pair, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedPairs.some(p => 
                        p.subject === pair.subject && p.teacher === pair.teacher
                      )}
                      onChange={e => {
                        setSelectedPairs(prev =>
                          e.target.checked
                            ? [...prev, pair]
                            : prev.filter(p => 
                                p.subject !== pair.subject || p.teacher !== pair.teacher
                              )
                        )
                      }}
                    />
                    <span>
                      {pair.subject} - {pair.teacher}
                    </span>
                  </label>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Button 
          onClick={handleSubmit} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Generating...' : 'Generate Timetable'}
        </Button>

        <div className="space-y-4">
          {timetables.map((timetable) => (
            <Card key={timetable._id}>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-2">
                  {timetable.departmentName} - {new Date(timetable.createdAt).toLocaleDateString()}
                </h3>
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="border p-2">Day</th>
                      {timetable.timeSlots.map((slot, i) => (
                        <th key={i} className="border p-2">
                          {slot.startTime}-{slot.endTime}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {timetable.daysOpen.map(day => (
                      <tr key={day}>
                        <td className="border p-2">{day}</td>
                        {timetable.schedule[day].map((pair, i) => (
                          <td key={i} className="border p-2">
                            {timetable.timeSlots[i].startTime === timetable.breakTime.startTime
                              ? 'BREAK'
                              : `${pair.subject}\n${pair.teacher}`}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
