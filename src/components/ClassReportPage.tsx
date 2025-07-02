/**
 * Class report generation page showing all students in a class with their total scores and positions
 */
import { useState, useMemo } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { useDataStore } from '../store/dataStore';
import { FileText, Download, Trophy } from 'lucide-react';

export default function ClassReportPage() {
  const { 
    classes, 
    getStudentsByClass,
    getScoresByStudent,
    getGrade
  } = useDataStore();

  const [selectedClass, setSelectedClass] = useState('none');
  const [selectedTerm, setSelectedTerm] = useState('First Term');
  const [selectedYear, setSelectedYear] = useState('2024/2025');

  const classStudents = useMemo(() => {
    return selectedClass && selectedClass !== 'none' ? getStudentsByClass(selectedClass) : [];
  }, [selectedClass, getStudentsByClass]);

  // Calculate class performance data
  const classPerformanceData = useMemo(() => {
    if (!selectedClass || selectedClass === 'none') return [];

    const studentsWithScores = classStudents.map(student => {
      const scores = getScoresByStudent(student.id, selectedTerm, selectedYear);
      const totalScore = scores.reduce((sum, score) => sum + score.total, 0);
      const averageScore = scores.length > 0 ? totalScore / scores.length : 0;
      
      return {
        id: student.id,
        fullName: student.fullName,
        totalScore,
        averageScore,
        subjectCount: scores.length,
        grade: getGrade(averageScore),
        scores: scores
      };
    });

    // Sort by total score in descending order (highest first)
    return studentsWithScores
      .sort((a, b) => b.totalScore - a.totalScore)
      .map((student, index) => ({
        ...student,
        position: index + 1
      }));
  }, [classStudents, selectedTerm, selectedYear, getScoresByStudent, getGrade]);

  const generateClassReport = () => {
    if (!selectedClass || selectedClass === 'none' || classPerformanceData.length === 0) return;

    // Create a new window for the class report
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const classInfo = classes.find(c => c.name === selectedClass);
    const highestScore = classPerformanceData[0]?.totalScore || 0;
    const averageScore = classPerformanceData.reduce((sum, s) => sum + s.totalScore, 0) / classPerformanceData.length;

    const reportHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Class Report - ${selectedClass}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: Arial, sans-serif; padding: 20px; background: white; }
          .report { max-width: 1000px; margin: 0 auto; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
          .school-name { font-size: 28px; font-weight: bold; color: #1a365d; margin-bottom: 10px; }
          .report-title { font-size: 20px; color: #2d3748; margin-bottom: 20px; }
          .class-info { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin-bottom: 30px; }
          .info-card { background: #f7fafc; padding: 15px; border-radius: 8px; text-align: center; }
          .info-title { font-weight: bold; color: #2d3748; margin-bottom: 10px; }
          .info-value { font-size: 24px; font-weight: bold; color: #1a365d; }
          .students-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          .students-table th, .students-table td { border: 1px solid #e2e8f0; padding: 12px; text-align: center; }
          .students-table th { background: #edf2f7; font-weight: bold; color: #2d3748; }
          .students-table tr:nth-child(even) { background: #f8f9fa; }
          .position-1 { background: #ffd700 !important; color: #744210; font-weight: bold; }
          .position-2 { background: #c0c0c0 !important; color: #2d3748; font-weight: bold; }
          .position-3 { background: #cd7f32 !important; color: #744210; font-weight: bold; }
          .grade-a { color: #22543d; font-weight: bold; }
          .grade-b { color: #1a365d; font-weight: bold; }
          .grade-c { color: #744210; font-weight: bold; }
          .grade-d { color: #822727; font-weight: bold; }
          .grade-f { color: #822727; font-weight: bold; }
          @media print { body { padding: 0; } }
        </style>
      </head>
      <body>
        <div class="report">
          <div class="header">
            <div class="school-name">ROMBLESS ACADEMY</div>
            <div class="report-title">CLASS PERFORMANCE REPORT</div>
          </div>

          <div class="class-info">
            <div class="info-card">
              <div class="info-title">Class Information</div>
              <div class="info-value">${selectedClass}</div>
              <div style="margin-top: 10px;">
                <div><strong>Term:</strong> ${selectedTerm}</div>
                <div><strong>Academic Year:</strong> ${selectedYear}</div>
                <div><strong>Total Students:</strong> ${classPerformanceData.length}</div>
              </div>
            </div>
            <div class="info-card">
              <div class="info-title">Highest Score</div>
              <div class="info-value">${highestScore.toFixed(1)}</div>
              <div style="margin-top: 10px;">
                <div><strong>Top Student:</strong></div>
                <div>${classPerformanceData[0]?.fullName || 'N/A'}</div>
              </div>
            </div>
            <div class="info-card">
              <div class="info-title">Class Average</div>
              <div class="info-value">${averageScore.toFixed(1)}</div>
              <div style="margin-top: 10px;">
                <div><strong>Overall Grade:</strong> ${getGrade(averageScore)}</div>
              </div>
            </div>
          </div>

          <table class="students-table">
            <thead>
              <tr>
                <th>Position</th>
                <th>Student Name</th>
                <th>Total Score</th>
                <th>Average Score</th>
                <th>Grade</th>
                <th>Subjects Count</th>
              </tr>
            </thead>
            <tbody>
              ${classPerformanceData.map(student => {
                const positionClass = student.position === 1 ? 'position-1' :
                                     student.position === 2 ? 'position-2' :
                                     student.position === 3 ? 'position-3' : '';
                
                const gradeClass = student.grade.startsWith('A') ? 'grade-a' : 
                                  student.grade.startsWith('B') ? 'grade-b' :
                                  student.grade.startsWith('C') ? 'grade-c' :
                                  student.grade.startsWith('D') ? 'grade-d' : 'grade-f';
                
                return `
                  <tr class="${positionClass}">
                    <td>${student.position}${student.position <= 3 ? ' 🏆' : ''}</td>
                    <td style="text-align: left;">${student.fullName}</td>
                    <td>${student.totalScore.toFixed(1)}</td>
                    <td>${student.averageScore.toFixed(1)}</td>
                    <td class="${gradeClass}">${student.grade}</td>
                    <td>${student.subjectCount}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>

          <div style="margin-top: 30px; padding: 20px; background: #f7fafc; border-radius: 8px;">
            <h3 style="margin-bottom: 15px; color: #2d3748;">Performance Analysis</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
              <div>
                <h4 style="color: #2d3748; margin-bottom: 10px;">Grade Distribution:</h4>
                <ul style="list-style: none;">
                  ${['A1', 'B2', 'B3', 'C4', 'C5', 'C6', 'D7', 'E8', 'F9'].map(grade => {
                    const count = classPerformanceData.filter(s => s.grade === grade).length;
                    return count > 0 ? `<li>${grade}: ${count} students</li>` : '';
                  }).filter(Boolean).join('')}
                </ul>
              </div>
              <div>
                <h4 style="color: #2d3748; margin-bottom: 10px;">Top 5 Students:</h4>
                <ol>
                  ${classPerformanceData.slice(0, 5).map(student => 
                    `<li>${student.fullName} - ${student.totalScore.toFixed(1)}</li>`
                  ).join('')}
                </ol>
              </div>
            </div>
          </div>

          <div style="margin-top: 40px; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 20px;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 100px;">
              <div>
                <div style="border-top: 1px solid #333; margin-top: 30px; padding-top: 10px;">
                  Class Teacher's Signature
                </div>
              </div>
              <div>
                <div style="border-top: 1px solid #333; margin-top: 30px; padding-top: 10px;">
                  Headmaster's Signature
                </div>
              </div>
            </div>
            <div style="margin-top: 20px; color: #666;">
              Generated on: ${new Date().toLocaleDateString()}
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
        <h2 className="text-2xl font-bold text-gray-900">Class Performance Report</h2>
        <p className="text-gray-600">Generate class-wide performance reports with student rankings</p>
      </div>

      {/* Selection Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Select Parameters</CardTitle>
          <CardDescription>Choose class, term, and academic year for class report generation</CardDescription>
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

      {/* Class Performance Summary */}
      {selectedClass && classPerformanceData.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Trophy className="h-8 w-8 text-yellow-500" />
                  <div>
                    <p className="text-sm text-gray-600">Top Student</p>
                    <p className="font-bold">{classPerformanceData[0]?.fullName}</p>
                    <p className="text-sm text-gray-500">{classPerformanceData[0]?.totalScore.toFixed(1)} points</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <FileText className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-600">Class Average</p>
                    <p className="font-bold">{(classPerformanceData.reduce((sum, s) => sum + s.totalScore, 0) / classPerformanceData.length).toFixed(1)}</p>
                    <p className="text-sm text-gray-500">Total Students: {classPerformanceData.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 flex items-center justify-center">
                <Button 
                  onClick={generateClassReport}
                  className="flex items-center space-x-2"
                  size="lg"
                >
                  <Download className="h-5 w-5" />
                  <span>Generate Report</span>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Students Rankings Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="h-5 w-5" />
                <span>Class Rankings - {selectedClass}</span>
              </CardTitle>
              <CardDescription>
                Students ranked by total score in descending order
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-20">Position</TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead className="text-center">Total Score</TableHead>
                    <TableHead className="text-center">Average Score</TableHead>
                    <TableHead className="text-center">Grade</TableHead>
                    <TableHead className="text-center">Subjects</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {classPerformanceData.map((student) => {
                    const positionColor = 
                      student.position === 1 ? 'bg-yellow-100 text-yellow-800' :
                      student.position === 2 ? 'bg-gray-100 text-gray-800' :
                      student.position === 3 ? 'bg-orange-100 text-orange-800' : '';
                    
                    const gradeColor = 
                      student.grade.startsWith('A') ? 'text-green-700 font-bold' :
                      student.grade.startsWith('B') ? 'text-blue-700 font-bold' :
                      student.grade.startsWith('C') ? 'text-yellow-700 font-bold' :
                      student.grade.startsWith('D') ? 'text-orange-700 font-bold' :
                      'text-red-700 font-bold';

                    return (
                      <TableRow key={student.id} className={positionColor}>
                        <TableCell className="font-bold text-center">
                          {student.position}
                          {student.position <= 3 && ' 🏆'}
                        </TableCell>
                        <TableCell className="font-medium">{student.fullName}</TableCell>
                        <TableCell className="text-center font-bold">{student.totalScore.toFixed(1)}</TableCell>
                        <TableCell className="text-center">{student.averageScore.toFixed(1)}</TableCell>
                        <TableCell className={`text-center ${gradeColor}`}>{student.grade}</TableCell>
                        <TableCell className="text-center">{student.subjectCount}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}

      {selectedClass && selectedClass !== 'none' && classPerformanceData.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Available</h3>
            <p className="text-gray-600">No scores found for {selectedClass} in {selectedTerm} {selectedYear}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
