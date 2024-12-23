'use client';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import html2canvas from 'html2canvas';

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
    };

    const toggleDepartment = (dept: string) => {
        setDepartments(prev => 
            prev.includes(dept) 
                ? prev.filter(d => d !== dept) 
                : [...prev, dept]
        );
    };

    const downloadTableAsImage = (floorIndex: number, roomIndex: number) => {
        const tableElement = document.getElementById(`table-floor-${floorIndex}-room-${roomIndex}`);
        if (tableElement) {
            html2canvas(tableElement).then(canvas => {
                const link = document.createElement('a');
                link.download = `Floor${floorIndex + 1}_Room${roomIndex + 1}.png`;
                link.href = canvas.toDataURL('image/png');
                link.click();
            });
        }
    };

    return (
        <div style={styles.container}>
            <Card style={styles.card}>
                <CardContent>
                    <Label>Floors</Label>
                    <Input 
                        type="number" 
                        onChange={e => setFloors(Number(e.target.value))} 
                        placeholder="Enter number of floors" 
                        style={styles.input}
                    />

                    <Label>Classrooms per Floor</Label>
                    <Input 
                        type="number" 
                        onChange={e => setClassroomsPerFloor(Number(e.target.value))} 
                        placeholder="Enter classrooms per floor" 
                        style={styles.input}
                    />

                    <Label>Seats per Class</Label>
                    <Input 
                        type="number" 
                        onChange={e => setSeatsPerClass(Number(e.target.value))} 
                        placeholder="Enter seats per class" 
                        style={styles.input}
                    />

                    <Label>Departments</Label>
                    <div style={styles.checkboxWrapper}>
                        {departmentOptions.map(dept => (
                            <Button 
                                key={dept}
                                style={styles.deptButton}
                                onClick={() => toggleDepartment(dept)}
                            >
                                {dept}
                            </Button>
                        ))}
                    </div>

                    {departments.map(dept => (
                        <div key={dept} style={styles.inputWrapper}>
                            <Label>{dept} Students</Label>
                            <Input
                                type="number"
                                onChange={e => 
                                    setStudentsPerDepartment(prev => ({ ...prev, [dept]: Number(e.target.value) }))
                                }
                                placeholder={`Enter number of students for ${dept}`}
                                style={styles.input}
                            />
                        </div>
                    ))}

                    <Button 
                        style={styles.button} 
                        onClick={handleAllocation}
                    >
                        Allocate Students
                    </Button>
                </CardContent>
            </Card>

            {seatAllocation.length > 0 && (
                <div style={styles.allocationWrapper}>
                    {seatAllocation.map((floor, i) => (
                        <div key={`floor-${i}`}>
                            <h3 style={styles.allocationHeading}>Floor {i + 1}</h3>
                            {floor.map((room, j) => (
                                <div key={`room-${j}`}>
                                    <h4>Room {j + 1}</h4>
                                    <table id={`table-floor-${i}-room-${j}`} style={styles.table}>
                                        <tbody>
                                            {room.map((seat, k) => (
                                                <tr key={`seat-${k}`}>
                                                    <td style={styles.tableCell}>{seat}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <Button 
                                        style={styles.button} 
                                        onClick={() => downloadTableAsImage(i, j)}
                                    >
                                        Download as Image
                                    </Button>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};


const styles = {
    container: {
        margin: '0 auto',
        padding: '20px',
        maxWidth: '800px',
    },
    card: {
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        transition: 'box-shadow 0.3s ease',
        marginBottom: '20px',
    },
    input: {
        padding: '10px',
        borderRadius: '8px',
        border: '1px solid #ddd',
        width: '100%',
        marginTop: '8px',
        transition: 'border 0.3s ease',
    },
    checkboxWrapper: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        marginTop: '8px',
    },
    deptButton: {
        background: 'linear-gradient(45deg, #4A90E2, rgb(195, 71, 219))',
        color: '#fff',
        padding: '10px 20px',
        borderRadius: '20px',
        border: 'none',
        cursor: 'pointer',
        fontSize: '14px',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        marginTop: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    deptButtonHover: {
        transform: 'scale(1.05)',
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
    },
    inputWrapper: {
        marginTop: '16px',
    },
    button: {
        background: 'linear-gradient(45deg, #4A90E2,rgb(195, 71, 219))',
        color: '#fff',
        padding: '10px 20px',
        borderRadius: '8px',
        border: 'none',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease, transform 0.3s ease',
        marginTop: '16px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    buttonHover: {
        background: 'linear-gradient(45deg,rgb(195, 71, 219), #4A90E2)',
        transform: 'scale(1.05)',
    },
    allocationWrapper: {
        marginTop: '20px',
    },
    allocationHeading: {
        fontSize: '20px',
        fontWeight: 'bold',
    },
    allocationResult: {
        backgroundColor: '#f7f7f7',
        padding: '20px',
        borderRadius: '8px',
        whiteSpace: 'pre-wrap',
    },
};

export default RoutineGenerator;
