/**
 * Report card generation page
 */
import { useState, useMemo } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { useDataStore } from '../store/dataStore';
import { FileText, Download, Eye } from 'lucide-react';

export default function ReportsPage() {
  const { 
    students, 
    classes, 
    subjects,
    scores,
    comments,
    attendance,
    getStudentsByClass,
    getScoresByStudent,
    getGrade,
    calculateGradePoints
  } = useDataStore();

  const [selectedClass, setSelectedClass] = useState('none');
  const [selectedTerm, setSelectedTerm] = useState('First Term');
  const [selectedYear, setSelectedYear] = useState('2024/2025');
  const [selectedStudent, setSelectedStudent] = useState('none');

  const classStudents = useMemo(() => {
    return selectedClass && selectedClass !== 'none' ? getStudentsByClass(selectedClass) : [];
  }, [selectedClass, getStudentsByClass]);

  const generateReportCard = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return null;

    // Get student scores for the selected term and year
    const studentScores = getScoresByStudent(studentId, selectedTerm, selectedYear);
    
    // Get student comments
    const studentComments = comments.find(c => 
      c.studentId === studentId && 
      c.term === selectedTerm && 
      c.academicYear === selectedYear
    );

    // Get student attendance
    const studentAttendance = attendance.find(a => 
      a.studentId === studentId && 
      a.term === selectedTerm && 
      a.academicYear === selectedYear
    );

    // Calculate total score and position
    const totalScore = studentScores.reduce((sum, score) => sum + score.total, 0);
    
    // Calculate position in class
    const allClassScores = classStudents.map(s => {
      const scores = getScoresByStudent(s.id, selectedTerm, selectedYear);
      return {
        studentId: s.id,
        totalScore: scores.reduce((sum, score) => sum + score.total, 0)
      };
    }).sort((a, b) => b.totalScore - a.totalScore);

    const position = allClassScores.findIndex(s => s.studentId === studentId) + 1;

    return {
      student,
      scores: studentScores,
      comments: studentComments,
      attendance: studentAttendance,
      totalScore,
      position,
      totalStudents: allClassScores.length
    };
  };

  const generatePDF = (studentId: string) => {
    const reportData = generateReportCard(studentId);
    if (!reportData) return;

    // Create a new window for the report card
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const reportHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Report Card - ${reportData.student.fullName}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: Arial, sans-serif; padding: 20px; background: white; }
          .report-card { max-width: 800px; margin: 0 auto; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
          .school-name { font-size: 28px; font-weight: bold; color: #1a365d; margin-bottom: 10px; }
          .report-title { font-size: 20px; color: #2d3748; margin-bottom: 20px; }
          .student-info { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
          .info-section { background: #f7fafc; padding: 15px; border-radius: 8px; }
          .info-title { font-weight: bold; color: #2d3748; margin-bottom: 10px; }
          .info-item { margin-bottom: 8px; }
          .scores-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          .scores-table th, .scores-table td { border: 1px solid #e2e8f0; padding: 12px; text-align: center; }
          .scores-table th { background: #edf2f7; font-weight: bold; color: #2d3748; }
          .scores-table tr:nth-child(even) { background: #f8f9fa; }
          .grade-a { background: #c6f6d5 !important; color: #22543d; }
          .grade-b { background: #bee3f8 !important; color: #1a365d; }
          .grade-c { background: #fef5e7 !important; color: #744210; }
          .grade-d { background: #fed7d7 !important; color: #822727; }
          .grade-f { background: #feb2b2 !important; color: #822727; }
          .comments-section { margin-bottom: 30px; }
          .comment-box { background: #f7fafc; padding: 15px; border-radius: 8px; margin-bottom: 15px; }
          .comment-title { font-weight: bold; color: #2d3748; margin-bottom: 8px; }
          .signatures { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 40px; }
          .signature-box { text-align: center; border-top: 1px solid #e2e8f0; padding-top: 10px; }
          .total-row { background: #e2e8f0 !important; font-weight: bold; }
          @media print { body { padding: 0; } }
        </style>
      </head>
      <body>
        <div class="report-card">
          <div class="header">
            <div class="school-name">ROMBLESS ACADEMY</div>
            <div class="report-title">STUDENT REPORT CARD</div>
          </div>

          <div class="student-info">
            <div class="info-section">
              <div class="info-title">Student Information</div>
              <div class="info-item"><strong>Name:</strong> ${reportData.student.fullName}</div>
              <div class="info-item"><strong>Class:</strong> ${reportData.student.className}</div>
              <div class="info-item"><strong>Term:</strong> ${selectedTerm}</div>
              <div class="info-item"><strong>Academic Year:</strong> ${selectedYear}</div>
            </div>
            <div class="info-section">
              <div class="info-title">Performance Summary</div>
              <div class="info-item"><strong>Total Score:</strong> ${reportData.totalScore.toFixed(1)}</div>
              <div class="info-item"><strong>Position:</strong> ${reportData.position} of ${reportData.totalStudents}</div>
              <div class="info-item"><strong>Attendance:</strong> ${reportData.attendance ? 
                `${reportData.attendance.totalDaysPresent}/${reportData.attendance.totalDaysInTerm} (${Math.round((reportData.attendance.totalDaysPresent / reportData.attendance.totalDaysInTerm) * 100)}%)` : 
                'N/A'}</div>
              <div class="info-item"><strong>Re-opening Date:</strong> Next Term Date</div>
            </div>
          </div>

          <table class="scores-table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Class Score (40%)</th>
                <th>Exam Score (60%)</th>
                <th>Total (100%)</th>
                <th>Grade</th>
                <th>Position</th>
              </tr>
            </thead>
            <tbody>
              ${reportData.scores.map(score => {
                const grade = getGrade(score.total);
                const gradeClass = grade.startsWith('A') ? 'grade-a' : 
                                  grade.startsWith('B') ? 'grade-b' :
                                  grade.startsWith('C') ? 'grade-c' :
                                  grade.startsWith('D') ? 'grade-d' : 'grade-f';
                return `
                  <tr class="${gradeClass}">
                    <td>${subjects.find(s => s.id === score.subjectId)?.name || 'Unknown'}</td>
                    <td>${score.classScore.toFixed(1)}</td>
                    <td>${score.examScore.toFixed(1)}</td>
                    <td>${score.total.toFixed(1)}</td>
                    <td>${grade}</td>
                    <td>${score.position || 'N/A'}</td>
                  </tr>
                `;
              }).join('')}
              <tr class="total-row">
                <td><strong>TOTAL</strong></td>
                <td colspan="2"></td>
                <td><strong>${reportData.totalScore.toFixed(1)}</strong></td>
                <td colspan="2"><strong>Position: ${reportData.position}/${reportData.totalStudents}</strong></td>
              </tr>
            </tbody>
          </table>

          <div class="comments-section">
            ${reportData.comments?.interests ? `
              <div class="comment-box">
                <div class="comment-title">Student Interests:</div>
                <div>${reportData.comments.interests}</div>
              </div>
            ` : ''}
            
            ${reportData.comments?.classTeacherComment ? `
              <div class="comment-box">
                <div class="comment-title">Class Teacher's Comment:</div>
                <div>${reportData.comments.classTeacherComment}</div>
              </div>
            ` : ''}
            
            ${reportData.comments?.headmasterComment ? `
              <div class="comment-box">
                <div class="comment-title">Headmaster's Comment:</div>
                <div>${reportData.comments.headmasterComment}</div>
              </div>
            ` : ''}
          </div>

          <div class="signatures">
            <div class="signature-box">
              <div>Class Teacher's Signature</div>
            </div>
            <div class="signature-box">
              <div>Headmaster's Signature</div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(reportHTML);
    printWindow.document.close();
    
    // Auto print/download as PDF
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Generate Report Cards</h2>
        <p className="text-gray-600">Generate and download individual student report cards</p>
      </div>

      {/* Selection Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Select Parameters</CardTitle>
          <CardDescription>Choose class, term, and academic year for report generation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Class</label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Select class</SelectItem>
                  {classes.filter(cls => cls.name && cls.name.trim() !== '').map((cls) => (
                    <SelectItem key={cls.id} value={cls.name}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Term</label>
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
              <label className="text-sm font-medium">Academic Year</label>
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

      {/* Students List */}
      {selectedClass && selectedClass !== 'none' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Students in {selectedClass}</span>
            </CardTitle>
            <CardDescription>
              Click on a student to preview or download their report card
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Total Score</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {classStudents.map((student) => {
                  const reportData = generateReportCard(student.id);
                  return (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.fullName}</TableCell>
                      <TableCell>{reportData?.totalScore.toFixed(1) || '0.0'}</TableCell>
                      <TableCell>{reportData?.position || 'N/A'} of {reportData?.totalStudents || 0}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => generatePDF(student.id)}
                            className="flex items-center space-x-1"
                          >
                            <Eye className="h-4 w-4" />
                            <span>Preview</span>
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => generatePDF(student.id)}
                            className="flex items-center space-x-1"
                          >
                            <Download className="h-4 w-4" />
                            <span>Download</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
