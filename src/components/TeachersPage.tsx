/**
 * Teachers management page - only accessible by admin
 */
import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Checkbox } from './ui/checkbox';
import { useDataStore } from '../store/dataStore';
import { addTeacherUser } from '../store/authStore';
import { Teacher } from '../types';
import { Plus, Edit, Trash2, Users } from 'lucide-react';

export default function TeachersPage() {
  const { teachers, addTeacher, updateTeacher, deleteTeacher, classes, subjects } = useDataStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    password: '',
    assignedClasses: [] as string[],
    subjects: [] as string[],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingTeacher) {
      updateTeacher(editingTeacher.id, formData);
    } else {
      // Add to teacher list
      addTeacher(formData);
      // Also add to user authentication system
      addTeacherUser({
        username: formData.username,
        password: formData.password,
        fullName: formData.fullName,
        role: 'teacher',
        assignedClasses: formData.assignedClasses,
        subjects: formData.subjects,
      });
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      username: '',
      password: '',
      assignedClasses: [],
      subjects: [],
    });
    setEditingTeacher(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setFormData({
      fullName: teacher.fullName,
      username: teacher.username,
      password: teacher.password,
      assignedClasses: teacher.assignedClasses,
      subjects: teacher.subjects,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this teacher?')) {
      deleteTeacher(id);
    }
  };

  const handleClassChange = (className: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        assignedClasses: [...formData.assignedClasses, className],
      });
    } else {
      setFormData({
        ...formData,
        assignedClasses: formData.assignedClasses.filter(c => c !== className),
      });
    }
  };

  const handleSubjectChange = (subjectName: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        subjects: [...formData.subjects, subjectName],
      });
    } else {
      setFormData({
        ...formData,
        subjects: formData.subjects.filter(s => s !== subjectName),
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Teachers Management</h2>
          <p className="text-gray-600">Manage teacher accounts and assignments</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add Teacher</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingTeacher ? 'Edit Teacher' : 'Add New Teacher'}</DialogTitle>
              <DialogDescription>
                {editingTeacher ? 'Update teacher information' : 'Create a new teacher account'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 py-4 max-h-96 overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Assigned Classes</Label>
                  <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border rounded p-2">
                    {classes.map((cls) => (
                      <div key={cls.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`class-${cls.id}`}
                          checked={formData.assignedClasses.includes(cls.name)}
                          onCheckedChange={(checked) => handleClassChange(cls.name, checked as boolean)}
                        />
                        <Label htmlFor={`class-${cls.id}`} className="text-sm">
                          {cls.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Teaching Subjects</Label>
                  <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border rounded p-2">
                    {subjects.map((subject) => (
                      <div key={subject.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`subject-${subject.id}`}
                          checked={formData.subjects.includes(subject.name)}
                          onCheckedChange={(checked) => handleSubjectChange(subject.name, checked as boolean)}
                        />
                        <Label htmlFor={`subject-${subject.id}`} className="text-sm">
                          {subject.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingTeacher ? 'Update' : 'Create'} Teacher
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Teachers Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Teachers List</span>
          </CardTitle>
          <CardDescription>{teachers.length} teacher{teachers.length !== 1 ? 's' : ''} registered</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Full Name</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Assigned Classes</TableHead>
                <TableHead>Subjects</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teachers.map((teacher) => (
                <TableRow key={teacher.id}>
                  <TableCell className="font-medium">{teacher.fullName}</TableCell>
                  <TableCell>{teacher.username}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {teacher.assignedClasses.length > 0
                        ? teacher.assignedClasses.join(', ')
                        : 'No classes assigned'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {teacher.subjects.length > 0
                        ? teacher.subjects.join(', ')
                        : 'No subjects assigned'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(teacher)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(teacher.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {teachers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                    No teachers found. Add some teachers to get started.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
