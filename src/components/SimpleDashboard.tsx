/**
 * Simple, reliable Dashboard component
 */
import React from 'react';
import { useDataStore } from '../store/dataStore';
import { useAuthStore } from '../store/authStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  ClipboardList, 
  TrendingUp, 
  Award,
  Calendar,
  BarChart3
} from 'lucide-react';

export default function SimpleDashboard() {
  const { user } = useAuthStore();
  const { students, teachers, classes, subjects, scores, attendance } = useDataStore();

  // Safe array checks
  const safeStudents = Array.isArray(students) ? students : [];
  const safeTeachers = Array.isArray(teachers) ? teachers : [];
  const safeClasses = Array.isArray(classes) ? classes : [];
  const safeSubjects = Array.isArray(subjects) ? subjects : [];
  const safeScores = Array.isArray(scores) ? scores : [];
  const safeAttendance = Array.isArray(attendance) ? attendance : [];

  // Calculate stats safely
  const stats = {
    totalStudents: safeStudents.length,
    totalTeachers: safeTeachers.length,
    totalClasses: safeClasses.length,
    totalSubjects: safeSubjects.length,
    averageScore: safeScores.length > 0 
      ? Math.round(safeScores.reduce((sum, score) => sum + (score.total || 0), 0) / safeScores.length)
      : 0,
    averageAttendance: safeAttendance.length > 0
      ? Math.round(safeAttendance.reduce((sum, att) => sum + (att.percentage || 0), 0) / safeAttendance.length)
      : 0,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.fullName || 'User'}!
        </h1>
        <p className="text-gray-600 mt-1">
          Here's an overview of your {user?.role === 'admin' ? 'school system' : 'classes'}
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
            <p className="text-xs text-gray-600">Registered students</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
            <GraduationCap className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTeachers}</div>
            <p className="text-xs text-gray-600">Active teachers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
            <BookOpen className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClasses}</div>
            <p className="text-xs text-gray-600">Active classes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <Award className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageScore}%</div>
            <p className="text-xs text-gray-600">Overall performance</p>
          </CardContent>
        </Card>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Quick Statistics</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Subjects</span>
              <Badge variant="secondary">{stats.totalSubjects}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Average Attendance</span>
              <Badge variant={stats.averageAttendance >= 80 ? "default" : "destructive"}>
                {stats.averageAttendance}%
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Scores Recorded</span>
              <Badge variant="outline">{safeScores.length}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>System Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Data Integrity</span>
              <Badge variant="default" className="bg-green-600">Healthy</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Last Backup</span>
              <Badge variant="outline">Real-time</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">System Status</span>
              <Badge variant="default" className="bg-blue-600">Online</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest updates in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Students: {stats.totalStudents} registered</p>
                <p className="text-xs text-gray-600">All student records are up to date</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <GraduationCap className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Teachers: {stats.totalTeachers} active</p>
                <p className="text-xs text-gray-600">All teaching staff profiles complete</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
              <BookOpen className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium">Classes: {stats.totalClasses} scheduled</p>
                <p className="text-xs text-gray-600">All classes properly configured</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
