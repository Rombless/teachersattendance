/**
 * Scores management page for entering class and exam scores
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
import { Student, Score } from '../types';
import { ClipboardList, Save } from 'lucide-react';

export default function ScoresPage() {
  const { user } = useAuthStore();
  const { 
    students, 
    subjects, 
    classes, 
    scores, 
    addScore, 
    updateScore, 
    getStudentsByClass 
  } = useDataStore();

  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('none');
  const [selectedTerm, setSelectedTerm] = useState('First Term');
  const [selectedYear, setSelectedYear] = useState('2024/2025');
  const [scoresData, setScoresData] = useState<Record<string, { classScore: string; examScore: string }>>({});

  // Filter classes based on user role
  const availableClasses = useMemo(() => {
    if (user?.role === 'admin') {
      return classes;
    } else if (user?.role === 'teacher' && user.assignedClasses) {
      return classes.filter(cls => user.assignedClasses?.includes(cls.name));
    }
    return [];
  }, [classes, user]);

  // Filter subjects based on user role
  const availableSubjects = useMemo(() => {
    if (user?.role === 'admin') {
      return subjects;
    } else if (user?.role === 'teacher' && user.subjects) {
      return subjects.filter(subject => user.subjects?.includes(subject.name));
    }
    return [];
  }, [subjects, user]);

  const classStudents = useMemo(() => {
    return selectedClass && selectedClass !== 'none' ? getStudentsByClass(selectedClass) : [];
  }, [selectedClass, getStudentsByClass]);

  // Get existing scores for the selected class, subject, term, and year
  const existingScores = useMemo(() => {
    if (!selectedClass || !selectedSubject) return {};
    
    const studentIds = classStudents.map(s => s.id);
    const relevantScores = scores.filter(score => 
      studentIds.includes(score.studentId) && 
      score.subjectId === selectedSubject &&
      score.term === selectedTerm &&
      score.academicYear === selectedYear
    );

    const scoresMap: Record<string, Score> = {};
    relevantScores.forEach(score => {
      scoresMap[score.studentId] = score;
    });
    return scoresMap;
  }, [scores, classStudents, selectedSubject, selectedTerm, selectedYear]);

  // Initialize scores data when class/subject changes
  useMemo(() => {
    const newScoresData: Record<string, { classScore: string; examScore: string }> = {};
    classStudents.forEach(student => {
      const existingScore = existingScores[student.id];
      newScoresData[student.id] = {
        classScore: existingScore ? existingScore.classScore.toString() : '',
        examScore: existingScore ? existingScore.examScore.toString() : '',
      };
    });
    setScoresData(newScoresData);
  }, [classStudents, existingScores]);

  const handleScoreChange = (studentId: string, type: 'classScore' | 'examScore', value: string) => {
    // Validate score is between 0-100
    const numValue = parseFloat(value);
    if (value !== '' && (isNaN(numValue) || numValue < 0 || numValue > 100)) {
      return;
    }

    setScoresData(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [type]: value,
      },
    }));
  };

  const handleSaveScores = () => {
    if (!selectedClass || selectedClass === 'none' || !selectedSubject || selectedSubject === 'none') {
      alert('Please select both class and subject');
      return;
    }

    Object.entries(scoresData).forEach(([studentId, data]) => {
      const classScore = parseFloat(data.classScore);
      const examScore = parseFloat(data.examScore);

      // Only save if both scores are provided
      if (!isNaN(classScore) && !isNaN(examScore)) {
        const existingScore = existingScores[studentId];
        
        if (existingScore) {
          // Update existing score
          updateScore(existingScore.id, {
            classScore,
            examScore,
          });
        } else {
          // Add new score
          addScore({
            studentId,
            subjectId: selectedSubject,
            classScore,
            examScore,
            term: selectedTerm,
            academicYear: selectedYear,
          });
        }
      }
    });

    alert('Scores saved successfully!');
  };

  const getSubjectName = (subjectId: string) => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject ? subject.name : subjectId;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Scores Management</h2>
        <p className="text-gray-600">Enter class scores and exam scores for students</p>
      </div>

      {/* Selection Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Select Class and Subject</CardTitle>
          <CardDescription>Choose the class, subject, term, and academic year to enter scores</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
              <Label>Subject</Label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {availableSubjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
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

      {/* Scores Entry Table */}
      {selectedClass && selectedClass !== 'none' && selectedSubject && selectedSubject !== 'none' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ClipboardList className="h-5 w-5" />
              <span>Enter Scores - {selectedClass} ({getSubjectName(selectedSubject)})</span>
            </CardTitle>
            <CardDescription>
              Enter class scores (0-100) and exam scores (0-100). System will automatically convert to 40% and 60% respectively.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Class Score (0-100)</TableHead>
                    <TableHead>Exam Score (0-100)</TableHead>
                    <TableHead>Converted Class (40%)</TableHead>
                    <TableHead>Converted Exam (60%)</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Grade</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {classStudents.map((student) => {
                    const studentData = scoresData[student.id] || { classScore: '', examScore: '' };
                    const classScore = parseFloat(studentData.classScore) || 0;
                    const examScore = parseFloat(studentData.examScore) || 0;
                    const convertedClass = Math.round((classScore * 40) / 100);
                    const convertedExam = Math.round((examScore * 60) / 100);
                    const total = convertedClass + convertedExam;
                    
                    const getGrade = (total: number) => {
                      if (total >= 80) return 'A1';
                      if (total >= 70) return 'B2';
                      if (total >= 65) return 'B3';
                      if (total >= 60) return 'C4';
                      if (total >= 55) return 'C5';
                      if (total >= 50) return 'C6';
                      if (total >= 45) return 'D7';
                      if (total >= 40) return 'E8';
                      return 'F9';
                    };

                    return (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.fullName}</TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={studentData.classScore}
                            onChange={(e) => handleScoreChange(student.id, 'classScore', e.target.value)}
                            className="w-20"
                            placeholder="0"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={studentData.examScore}
                            onChange={(e) => handleScoreChange(student.id, 'examScore', e.target.value)}
                            className="w-20"
                            placeholder="0"
                          />
                        </TableCell>
                        <TableCell>{studentData.classScore ? convertedClass : '-'}</TableCell>
                        <TableCell>{studentData.examScore ? convertedExam : '-'}</TableCell>
                        <TableCell className="font-medium">
                          {(studentData.classScore && studentData.examScore) ? total : '-'}
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded text-sm font-medium ${
                            (studentData.classScore && studentData.examScore) 
                              ? total >= 50 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-500'
                          }`}>
                            {(studentData.classScore && studentData.examScore) ? getGrade(total) : '-'}
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              <div className="flex justify-end">
                <Button onClick={handleSaveScores} className="flex items-center space-x-2">
                  <Save className="h-4 w-4" />
                  <span>Save All Scores</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {!selectedClass && (
        <Card>
          <CardContent className="text-center py-8">
            <ClipboardList className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Select a class and subject to start entering scores</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
