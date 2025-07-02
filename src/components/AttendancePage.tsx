/**
 * Attendance management page
 */
import { useState, useMemo } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { useDataStore } from '../store/dataStore';
import { useAuthStore } from '../store/authStore';
import { Calendar, Save } from 'lucide-react';

export default function AttendancePage() {
  const { user } = useAuthStore();
  const { 
    students, 
    classes, 
    attendance, 
    addAttendance, 
    updateAttendance, 
    getStudentsByClass 
  } = useDataStore();

  const [selectedClass, setSelectedClass] = useState('none');
  const [selectedTerm, setSelectedTerm] = useState('First Term');
  const [selectedYear, setSelectedYear] = useState('2024/2025');
  const [attendanceData, setAttendanceData] = useState<Record<string, { present: string; total: string }>>({});

  // Filter classes based on user role
  const availableClasses = useMemo(() => {
    if (user?.role === 'admin') {
      return classes;
    } else if (user?.role === 'teacher' && user.assignedClasses) {
      return classes.filter(cls => user.assignedClasses?.includes(cls.name));
    }
    return [];
  }, [classes, user]);

  const classStudents = useMemo(() => {
    return selectedClass && selectedClass !== 'none' ? getStudentsByClass(selectedClass) : [];
  }, [selectedClass, getStudentsByClass]);

  // Get existing attendance for the selected class, term, and year
  const existingAttendance = useMemo(() => {
    if (!selectedClass) return {};
    
    const studentIds = classStudents.map(s => s.id);
    const relevantAttendance = attendance.filter(att => 
      studentIds.includes(att.studentId) && 
      att.term === selectedTerm &&
      att.academicYear === selectedYear
    );

    const attendanceMap: Record<string, typeof attendance[0]> = {};
    relevantAttendance.forEach(att => {
      attendanceMap[att.studentId] = att;
    });
    return attendanceMap;
  }, [attendance, classStudents, selectedTerm, selectedYear]);

  // Initialize attendance data when class changes
  useMemo(() => {
    const newAttendanceData: Record<string, { present: string; total: string }> = {};
    classStudents.forEach(student => {
      const existingAtt = existingAttendance[student.id];
      newAttendanceData[student.id] = {
        present: existingAtt ? existingAtt.totalDaysPresent.toString() : '',
        total: existingAtt ? existingAtt.totalDaysInTerm.toString() : '',
      };
    });
    setAttendanceData(newAttendanceData);
  }, [classStudents, existingAttendance]);

  const handleAttendanceChange = (
    studentId: string, 
    type: 'present' | 'total', 
    value: string
  ) => {
    // Validate positive numbers
    const numValue = parseInt(value);
    if (value !== '' && (isNaN(numValue) || numValue < 0)) {
      return;
    }

    setAttendanceData(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [type]: value,
      },
    }));
  };

  const handleSaveAttendance = () => {
    if (!selectedClass || selectedClass === 'none') {
      alert('Please select a class');
      return;
    }

    Object.entries(attendanceData).forEach(([studentId, data]) => {
      const present = parseInt(data.present);
      const total = parseInt(data.total);

      // Only save if both values are provided and valid
      if (!isNaN(present) && !isNaN(total) && total > 0 && present <= total) {
        const existingAtt = existingAttendance[studentId];
        
        if (existingAtt) {
          // Update existing attendance
          updateAttendance(existingAtt.id, {
            totalDaysPresent: present,
            totalDaysInTerm: total,
          });
        } else {
          // Add new attendance
          addAttendance({
            studentId,
            totalDaysPresent: present,
            totalDaysInTerm: total,
            term: selectedTerm,
            academicYear: selectedYear,
          });
        }
      }
    });

    alert('Attendance saved successfully!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Attendance Management</h2>
        <p className="text-gray-600">Record student attendance for each term</p>
      </div>

      {/* Selection Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Select Class and Term</CardTitle>
          <CardDescription>Choose the class, term, and academic year to record attendance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Class</Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Select class</SelectItem>
                  {availableClasses.filter(cls => cls.name && cls.name.trim() !== '').map((cls) => (
                    <SelectItem key={cls.id} value={cls.name}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Term</Label>
              <Select value={selectedTerm} onValueChange={setSelectedTerm}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="First Term">First Term</SelectItem>
                  <SelectItem value="Second Term">Second Term</SelectItem>
                  <SelectItem value="Third Term">Third Term</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Academic Year</Label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024/2025">2024/2025</SelectItem>
                  <SelectItem value="2025/2026">2025/2026</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Entry Table */}
      {selectedClass && selectedClass !== 'none' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Record Attendance - {selectedClass}</span>
            </CardTitle>
            <CardDescription>
              Enter the number of days present and total days in term for each student
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Days Present</TableHead>
                    <TableHead>Total Days in Term</TableHead>
                    <TableHead>Attendance %</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {classStudents.map((student) => {
                    const studentData = attendanceData[student.id] || { present: '', total: '' };
                    const present = parseInt(studentData.present) || 0;
                    const total = parseInt(studentData.total) || 0;
                    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
                    
                    const getStatus = (percentage: number) => {
                      if (percentage >= 95) return { text: 'Excellent', color: 'bg-green-100 text-green-800' };
                      if (percentage >= 85) return { text: 'Very Good', color: 'bg-blue-100 text-blue-800' };
                      if (percentage >= 75) return { text: 'Good', color: 'bg-yellow-100 text-yellow-800' };
                      if (percentage >= 65) return { text: 'Fair', color: 'bg-orange-100 text-orange-800' };
                      return { text: 'Poor', color: 'bg-red-100 text-red-800' };
                    };

                    const status = getStatus(percentage);

                    return (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.fullName}</TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            value={studentData.present}
                            onChange={(e) => handleAttendanceChange(student.id, 'present', e.target.value)}
                            className="w-20"
                            placeholder="0"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="1"
                            value={studentData.total}
                            onChange={(e) => handleAttendanceChange(student.id, 'total', e.target.value)}
                            className="w-20"
                            placeholder="0"
                          />
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">{percentage}%</span>
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                            {status.text}
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              <div className="flex justify-end">
                <Button onClick={handleSaveAttendance} className="flex items-center space-x-2">
                  <Save className="h-4 w-4" />
                  <span>Save Attendance</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
