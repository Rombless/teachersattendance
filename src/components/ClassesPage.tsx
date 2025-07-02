/**
 * Classes management page
 */
import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { useDataStore } from '../store/dataStore';
import { Class } from '../types';
import { Plus, Edit, Trash2, School } from 'lucide-react';

export default function ClassesPage() {
  const { classes, addClass, updateClass, deleteClass, teachers } = useDataStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    level: 'none',
    classTeacher: 'none',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.level === 'none') {
      alert('Please select a level');
      return;
    }
    const submitData = {
      ...formData,
      classTeacher: formData.classTeacher === 'none' ? undefined : formData.classTeacher
    };
    if (editingClass) {
      updateClass(editingClass.id, submitData);
    } else {
      addClass(submitData);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      level: 'none',
      classTeacher: 'none',
    });
    setEditingClass(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (cls: Class) => {
    setEditingClass(cls);
    setFormData({
      name: cls.name,
      level: cls.level || 'none',
      classTeacher: cls.classTeacher || 'none',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this class?')) {
      deleteClass(id);
    }
  };

  const getClassTeacherName = (teacherId: string) => {
    const teacher = teachers.find(t => t.id === teacherId);
    return teacher ? teacher.fullName : 'Not assigned';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Classes Management</h2>
          <p className="text-gray-600">Manage class information and assignments</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add Class</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingClass ? 'Edit Class' : 'Add New Class'}</DialogTitle>
              <DialogDescription>
                {editingClass ? 'Update class information' : 'Create a new class'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Class Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., JSS 1A, SS 2B"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="level">Level</Label>
                  <Select
                    value={formData.level}
                    onValueChange={(value) => setFormData({ ...formData, level: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Select level</SelectItem>
                      <SelectItem value="JSS 1">Pre-school</SelectItem>
                      <SelectItem value="JSS 2">Kindergarten</SelectItem>
                      <SelectItem value="JSS 3">lower primary</SelectItem>
                      <SelectItem value="SS 1">Upper primary</SelectItem>
                      <SelectItem value="SS 2">Junior High</SelectItem>
                      <SelectItem value="SS 3">Candidate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="classTeacher">Class Teacher (Optional)</Label>
                  <Select
                    value={formData.classTeacher}
                    onValueChange={(value) => setFormData({ ...formData, classTeacher: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select class teacher" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No teacher assigned</SelectItem>
                      {teachers.filter(teacher => teacher.id && teacher.id.trim() !== '').map((teacher) => (
                        <SelectItem key={teacher.id} value={teacher.id}>
                          {teacher.fullName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingClass ? 'Update' : 'Add'} Class
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Classes Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <School className="h-5 w-5" />
            <span>Classes List</span>
          </CardTitle>
          <CardDescription>{classes.length} class{classes.length !== 1 ? 'es' : ''} created</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Class Name</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Class Teacher</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classes.map((cls) => (
                <TableRow key={cls.id}>
                  <TableCell className="font-medium">{cls.name}</TableCell>
                  <TableCell>{cls.level}</TableCell>
                  <TableCell>
                    {cls.classTeacher ? getClassTeacherName(cls.classTeacher) : 'Not assigned'}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(cls)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(cls.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {classes.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-gray-500 py-8">
                    No classes found. Add some classes to get started.
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
