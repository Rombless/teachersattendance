/**
 * Teacher's classes page - shows only assigned classes and students
 */
import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { useDataStore } from '../store/dataStore';
import { useAuthStore } from '../store/authStore';
import { Users, BookOpen } from 'lucide-react';

export default function MyClassesPage() {
  const { user } = useAuthStore();
  const { students, classes, scores, subjects } = useDataStore();

  // Get teacher's assigned classes
  const myClasses = useMemo(() => {
    if (!user?.assignedClasses) return [];
    return classes.filter(cls => user.assignedClasses?.includes(cls.name));
  }, [classes, user?.assignedClasses]);

  // Get students in teacher's classes
  const myStudents = useMemo(() => {
    if (!user?.assignedClasses) return [];
    return students.filter(student => user.assignedClasses?.includes(student.class));
  }, [students, user?.assignedClasses]);

  // Get students grouped by class
  const studentsByClass = useMemo(() => {
    const grouped: Record<string, typeof students> = {};
    myStudents.forEach(student => {
      if (!grouped[student.class]) {
        grouped[student.class] = [];
      }
      grouped[student.class].push(student);
    });
    return grouped;
  }, [myStudents]);

  // Get performance summary for each student
  const getStudentPerformance = (studentId: string) => {
    const studentScores = scores.filter(score => score.studentId === studentId);
    if (studentScores.length === 0) return null;

    const totalScore = studentScores.reduce((sum, score) => sum + score.total, 0);
    const averageScore = totalScore / studentScores.length;
    
    return {
      totalSubjects: studentScores.length,
      averageScore: Math.round(averageScore),
      totalScore,
    };
  };

  const getSubjectName = (subjectId: string) => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject ? subject.name : 'Unknown';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">My Classes</h2>
        <p className="text-gray-600">View your assigned classes and students</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Classes</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myClasses.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myStudents.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Subjects</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user?.subjects?.length || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Classes and Students */}
      {myClasses.map((classInfo) => (
        <Card key={classInfo.id}>
          <CardHeader>
            <CardTitle>{classInfo.name}</CardTitle>
            <CardDescription>
              {studentsByClass[classInfo.name]?.length || 0} students in this class
            </CardDescription>
          </CardHeader>
          <CardContent>
            {studentsByClass[classInfo.name]?.length ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Subjects Taken</TableHead>
                    <TableHead>Average Score</TableHead>
                    <TableHead>Total Score</TableHead>
                    <TableHead>Performance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {studentsByClass[classInfo.name].map((student) => {
                    const performance = getStudentPerformance(student.id);
                    return (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.fullName}</TableCell>
                        <TableCell>
                          {performance ? performance.totalSubjects : 0} subjects
                        </TableCell>
                        <TableCell>
                          {performance ? `${performance.averageScore}%` : 'No scores'}
                        </TableCell>
                        <TableCell>
                          {performance ? performance.totalScore : 'N/A'}
                        </TableCell>
                        <TableCell>
                          {performance ? (
                            <span className={`px-2 py-1 rounded text-sm font-medium ${
                              performance.averageScore >= 70
                                ? 'bg-green-100 text-green-800'
                                : performance.averageScore >= 50
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {performance.averageScore >= 70 ? 'Excellent' : 
                               performance.averageScore >= 50 ? 'Good' : 'Needs Improvement'}
                            </span>
                          ) : (
                            <span className="px-2 py-1 rounded text-sm bg-gray-100 text-gray-500">
                              No data
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No students found in this class
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      {myClasses.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No classes assigned to you yet</p>
            <p className="text-sm text-gray-400">Contact the administrator to get class assignments</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
