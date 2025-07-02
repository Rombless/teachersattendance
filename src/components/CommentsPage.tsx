/**
 * Comments management page for student interests and teacher comments
 */
import { useState, useMemo } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { useDataStore } from '../store/dataStore';
import { useAuthStore } from '../store/authStore';
import { StudentComment } from '../types';
import { MessageSquare, Plus, Edit, Search } from 'lucide-react';

export default function CommentsPage() {
  const { user } = useAuthStore();
  const { 
    students, 
    classes, 
    comments, 
    addComment, 
    updateComment, 
    getStudentsByClass 
  } = useDataStore();

  const [selectedClass, setSelectedClass] = useState('none');
  const [selectedTerm, setSelectedTerm] = useState('First Term');
  const [selectedYear, setSelectedYear] = useState('2024/2025');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingComment, setEditingComment] = useState<StudentComment | null>(null);
  const [selectedStudent, setSelectedStudent] = useState('none');
  const [formData, setFormData] = useState({
    interest: 'none',
    classTeacherComment: '',
    headmasterComment: '',
  });

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

  // Filter students by search term
  const filteredStudents = useMemo(() => {
    return classStudents.filter(student =>
      student.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [classStudents, searchTerm]);

  // Get existing comments for students
  const existingComments = useMemo(() => {
    const commentsMap: Record<string, StudentComment> = {};
    comments.forEach(comment => {
      if (comment.term === selectedTerm && comment.academicYear === selectedYear) {
        commentsMap[comment.studentId] = comment;
      }
    });
    return commentsMap;
  }, [comments, selectedTerm, selectedYear]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || selectedStudent === 'none') return;

    const existingComment = existingComments[selectedStudent];
    const submitData = {
      ...formData,
      interest: formData.interest === 'none' ? '' : formData.interest
    };
    
    if (existingComment) {
      updateComment(existingComment.id, submitData);
    } else {
      addComment({
        studentId: selectedStudent,
        term: selectedTerm,
        academicYear: selectedYear,
        ...submitData,
      });
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      interest: 'none',
      classTeacherComment: '',
      headmasterComment: '',
    });
    setSelectedStudent('none');
    setEditingComment(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (studentId: string, comment?: StudentComment) => {
    setSelectedStudent(studentId);
    if (comment) {
      setEditingComment(comment);
      setFormData({
        interest: comment.interest || 'none',
        classTeacherComment: comment.classTeacherComment,
        headmasterComment: comment.headmasterComment,
      });
    } else {
      setFormData({
        interest: 'none',
        classTeacherComment: '',
        headmasterComment: '',
      });
    }
    setIsDialogOpen(true);
  };

  const getStudentName = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    return student ? student.fullName : 'Unknown Student';
  };

  // Suggested interests for students
  const suggestedInterests = [
    'Sports and Athletics',
    'Arts and Crafts',
    'Music and Dance',
    'Reading and Literature',
    'Science and Technology',
    'Mathematics and Problem Solving',
    'Public Speaking and Debate',
    'Drama and Theater',
    'Environmental Studies',
    'Computer Programming',
    'Community Service',
    'Leadership Activities',
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Comments Management</h2>
        <p className="text-gray-600">Manage student interests and teacher comments</p>
      </div>

      {/* Selection Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Select Class and Term</CardTitle>
          <CardDescription>Choose the class, term, and academic year to manage comments</CardDescription>
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

      {/* Search */}
      {selectedClass && selectedClass !== 'none' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="h-5 w-5" />
              <span>Search Students</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="Search students by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </CardContent>
        </Card>
      )}

      {/* Students Comments Table */}
      {selectedClass && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5" />
              <span>Student Comments - {selectedClass}</span>
            </CardTitle>
            <CardDescription>
              Add interests, class teacher comments, and headmaster comments for students
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Interest</TableHead>
                  <TableHead>Class Teacher Comment</TableHead>
                  <TableHead>Headmaster Comment</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => {
                  const comment = existingComments[student.id];
                  return (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.fullName}</TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate">
                          {comment?.interest || 'Not set'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate">
                          {comment?.classTeacherComment || 'Not set'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate">
                          {comment?.headmasterComment || 'Not set'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(student.id, comment)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Comment Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingComment ? 'Edit' : 'Add'} Comments - {getStudentName(selectedStudent)}
            </DialogTitle>
            <DialogDescription>
              Add student interests and teacher comments
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4 max-h-96 overflow-y-auto">
              <div className="space-y-2">
                <Label htmlFor="interest">Student Interest</Label>
                <Select
                  value={formData.interest}
                  onValueChange={(value) => setFormData({ ...formData, interest: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select or type student interest" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Select interest</SelectItem>
                    {suggestedInterests.map((interest) => (
                      <SelectItem key={interest} value={interest}>
                        {interest}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Or type custom interest..."
                  value={formData.interest}
                  onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="classTeacherComment">Class Teacher Comment</Label>
                <Textarea
                  id="classTeacherComment"
                  value={formData.classTeacherComment}
                  onChange={(e) => setFormData({ ...formData, classTeacherComment: e.target.value })}
                  placeholder="Enter class teacher's comment about the student's performance and behavior..."
                  rows={4}
                />
              </div>

              {user?.role === 'admin' && (
                <div className="space-y-2">
                  <Label htmlFor="headmasterComment">Headmaster Comment</Label>
                  <Textarea
                    id="headmasterComment"
                    value={formData.headmasterComment}
                    onChange={(e) => setFormData({ ...formData, headmasterComment: e.target.value })}
                    placeholder="Enter headmaster's comment about the student..."
                    rows={4}
                  />
                </div>
              )}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button type="submit">
                {editingComment ? 'Update' : 'Add'} Comments
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {!selectedClass && (
        <Card>
          <CardContent className="text-center py-8">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Select a class to start managing student comments</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
