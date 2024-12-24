'use client';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const RoutineGenerator: React.FC = () => {
    const [floors, setFloors] = useState<number>(0);
    const [classroomsPerFloor, setClassroomsPerFloor] = useState<number>(0);
    const [seatsPerClass, setSeatsPerClass] = useState<number>(0);
    const [departments, setDepartments] = useState<string[]>([]);
    const [studentsPerDepartment, setStudentsPerDepartment] = useState<{ [key: string]: number }>({});
    const [seatAllocation, setSeatAllocation] = useState<string[][][]>([]);

    const departmentOptions = ["CSE(AI&ML)", "IT", "ME", "ECE", "Civil", "EEE"];

    const handleAllocation = () => {
        const totalSeats = floors * classroomsPerFloor * seatsPerClass;
        const totalStudents = Object.values(studentsPerDepartment).reduce((sum, count) => sum + count, 0);

        if (totalStudents > totalSeats) {
            alert("Error: Not enough seats to allocate students.");
            return;
        }

        const sortedDepartments = departments.map(dept => ({
            name: dept,
            students: studentsPerDepartment[dept] || 0
        })).sort((a, b) => b.students - a.students);

        let allocation: string[][][] = [];
        let currentSeat = 0;

        for (let floor = 0; floor < floors; floor++) {
            allocation[floor] = [];
            for (let room = 0; room < classroomsPerFloor; room++) {
                allocation[floor][room] = [];
                for (let seat = 0; seat < seatsPerClass; seat++) {
                    if (currentSeat < totalStudents) {
                        const dept = sortedDepartments.find(d => d.students > 0);
                        if (dept) {
                            allocation[floor][room].push(dept.name);
                            dept.students--;
                            currentSeat++;
                        }
                    }
                }
            }
        }

        setSeatAllocation(allocation);
        savePDF(allocation);
    };

    const toggleDepartment = (dept: string) => {
        setDepartments(prev => 
            prev.includes(dept) 
                ? prev.filter(d => d !== dept) 
                : [...prev, dept]
        );
    };
    
    // Update the savePDF function in your RoutineGenerator component
    const savePDF = async (allocation: string[][][]) => {
        try {
            console.log('Client: Starting PDF generation');
            const doc = new jsPDF();
            
            const rows = allocation.flatMap((floor, floorIndex) =>
                floor.flatMap((room, roomIndex) =>
                    room.map((seat, seatIndex) => [
                        (floorIndex + 1).toString(),
                        (roomIndex + 1).toString(),
                        (seatIndex + 1).toString(),
                        seat
                    ])
                )
            );

            autoTable(doc, {
                head: [['Floor', 'Room', 'Seat', 'Department']],
                body: rows,
                styles: { fontSize: 8 },
                headStyles: { fillColor: [41, 128, 185] }
            });

            console.log('Client: PDF generated, creating blob');
            const pdfBlob = doc.output('blob');
            const formData = new FormData();
            formData.append('file', pdfBlob, 'allocation.pdf');

            console.log('Client: Sending PDF to API, size:', pdfBlob.size, 'bytes');
            const response = await fetch('/api/save-pdf', {
                method: 'POST',
                body: formData
            });
            
            const responseData = await response.json();
            
            if (!response.ok) {
                throw new Error(`Server error: ${responseData.error} - ${responseData.details || ''}`);
            }
            
            console.log('Client: PDF successfully saved to Supabase:', responseData.filepath);
            
            // Always download in browser
            doc.save('Seat_Allocation.pdf');
            
            return responseData.filepath;
            
        } catch (error: any) {
            console.error('Client: Error in PDF handling:', error);
            
            // More specific error message for the user
            let errorMessage = 'Error saving PDF to server. ';
            if (error.message.includes('Supabase')) {
                errorMessage += 'There was a problem with the storage service. ';
            }
            errorMessage += 'The PDF has been downloaded to your browser only.';
            
            alert(errorMessage);
            return null;
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-4xl">
            <Card className="shadow-lg mb-6">
                <CardContent className="space-y-4">
                    <div>
                        <Label>Floors</Label>
                        <Input 
                            type="number" 
                            onChange={e => setFloors(Number(e.target.value))} 
                            placeholder="Enter number of floors" 
                            className="mt-2"
                        />
                    </div>

                    <div>
                        <Label>Classrooms per Floor</Label>
                        <Input 
                            type="number" 
                            onChange={e => setClassroomsPerFloor(Number(e.target.value))} 
                            placeholder="Enter classrooms per floor" 
                            className="mt-2"
                        />
                    </div>

                    <div>
                        <Label>Seats per Class</Label>
                        <Input 
                            type="number" 
                            onChange={e => setSeatsPerClass(Number(e.target.value))} 
                            placeholder="Enter seats per class" 
                            className="mt-2"
                        />
                    </div>

                    <div>
                        <Label>Departments</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {departmentOptions.map(dept => (
                                <Button 
                                    key={dept}
                                    onClick={() => toggleDepartment(dept)}
                                    className={`rounded-full ${departments.includes(dept) ? 'bg-blue-600' : 'bg-gray-400'}`}
                                >
                                    {dept}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {departments.map(dept => (
                        <div key={dept}>
                            <Label>{dept} Students</Label>
                            <Input
                                type="number"
                                onChange={e => 
                                    setStudentsPerDepartment(prev => ({ ...prev, [dept]: Number(e.target.value) }))
                                }
                                placeholder={`Enter number of students for ${dept}`}
                                className="mt-2"
                            />
                        </div>
                    ))}

                    <Button 
                        onClick={handleAllocation}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                    >
                        Allocate Students
                    </Button>
                </CardContent>
            </Card>

            {seatAllocation.length > 0 && (
                <div className="mt-8">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead className="bg-blue-500 text-white">
                                <tr>
                                    <th className="p-2 border">Floor</th>
                                    <th className="p-2 border">Room</th>
                                    <th className="p-2 border">Seat</th>
                                    <th className="p-2 border">Department</th>
                                </tr>
                            </thead>
                            <tbody>
                                {seatAllocation.flatMap((floor, floorIndex) =>
                                    floor.flatMap((room, roomIndex) =>
                                        room.map((seat, seatIndex) => (
                                            <tr key={`${floorIndex}-${roomIndex}-${seatIndex}`}
                                                className="even:bg-gray-50">
                                                <td className="p-2 border">{floorIndex + 1}</td>
                                                <td className="p-2 border">{roomIndex + 1}</td>
                                                <td className="p-2 border">{seatIndex + 1}</td>
                                                <td className="p-2 border">{seat}</td>
                                            </tr>
                                        ))
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RoutineGenerator;