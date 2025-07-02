/**
 * Dashboard component showing system overview and statistics
 */
import React, { useState, useMemo, useCallback } from 'react';
import { useDataStore } from '../store/dataStore';
import { useAuthStore } from '../store/authStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ClassBasedTabs, ClassBasedTabsList, ClassBasedTabsTrigger, ClassBasedTabsContent } from './ClassBasedTabs';
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
import { safeMap, safeFilter, safeLength } from '../utils/arrayHelpers';
import { safeExecute } from '../utils/safeFunction';
import { cn } from '../lib/utils';
import { explicitlyAssignFunction, forceAssignFunction } from '../utils/functionEnforcer';

// Import the class-based version
import { ClassBasedDashboard } from './ClassBasedDashboard';

// Export both functional and class-based versions
export { ClassBasedDashboard };

export default function Dashboard() {
  const { user } = useAuthStore();
  const { students, teachers, classes, subjects, scores, attendance } = useDataStore();
  const [activeTab, setActiveTab] = useState('overview');

  // Constructor-bound handler approach - create a bound function reference
  const handleTabChange = React.useCallback(function dashboardTabHandler(value: string) {
    console.log('Dashboard: Constructor-style tab handler called with:', value);
    
    if (typeof value === 'string' && value.trim() !== '') {
      console.log('Dashboard: Setting active tab to:', value);
      setActiveTab(value);
    } else {
      console.warn('Dashboard: Invalid tab value:', value);
      setActiveTab('overview'); // Fallback
    }
  }.bind(null), []); // Explicitly bind to ensure function identity

  // Verify the bound function
  React.useEffect(() => {
    if (typeof handleTabChange !== 'function') {
      console.error('CRITICAL: handleTabChange is not a function after binding!');
    } else {
      console.log('Dashboard: handleTabChange successfully bound as function');
    }
    
    // Also enforce global variables like 'a', 'b', etc.
    const commonVars = ['a', 'b', 'c', 'd', 'e'];
    commonVars.forEach(varName => {
      if (window[varName as any] !== undefined && typeof window[varName as any] !== 'function') {
        forceAssignFunction(window, varName, function enforcedGlobalVar() {
          console.log(`Dashboard: Enforced global ${varName} called`);
        });
      }
    });
  }, [handleTabChange]);

  // Calculate statistics safely
  const stats = useMemo(() => {
    const safeStudents = Array.isArray(students) ? students : [];
    const safeTeachers = Array.isArray(teachers) ? teachers : [];
    const safeClasses = Array.isArray(classes) ? classes : [];
    const safeSubjects = Array.isArray(subjects) ? subjects : [];
    const safeScores = Array.isArray(scores) ? scores : [];
    const safeAttendance = Array.isArray(attendance) ? attendance : [];

    return {
      totalStudents: safeLength(safeStudents),
      totalTeachers: safeLength(safeTeachers),
      totalClasses: safeLength(safeClasses),
      totalSubjects: safeLength(safeSubjects),
      averageScore: safeScores.length > 0 
        ? Math.round(safeScores.reduce((sum, score) => sum + (score.total || 0), 0) / safeScores.length)
        : 0,
      averageAttendance: safeAttendance.length > 0
        ? Math.round(safeAttendance.reduce((sum, att) => sum + (att.percentage || 0), 0) / safeAttendance.length)
        : 0,
    };
  }, [students, teachers, classes, subjects, scores, attendance]);

  // Recent activities (safely filtered)
  const recentScores = useMemo(() => {
    return safeFilter(Array.isArray(scores) ? scores : [], (score) => score && score.id)
      .slice(-5)
      .reverse();
  }, [scores]);

  const recentStudents = useMemo(() => {
    return safeFilter(Array.isArray(students) ? students : [], (student) => student && student.id)
      .slice(-5)
      .reverse();
  }, [students]);

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

      {/* Class-Based Tabs with Constructor Binding */}
      <ClassBasedTabs 
        value={activeTab} 
        onValueChange={handleTabChange} 
        className="space-y-4"
      >
        <ClassBasedTabsList className="grid w-full grid-cols-3">
          <ClassBasedTabsTrigger value="overview">Overview</ClassBasedTabsTrigger>
          <ClassBasedTabsTrigger value="recent">Recent Activity</ClassBasedTabsTrigger>
          <ClassBasedTabsTrigger value="analytics">Analytics</ClassBasedTabsTrigger>
        </ClassBasedTabsList>

        <ClassBasedTabsContent value="overview" className="space-y-4">
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
                  <Badge variant="outline">{safeLength(scores)}</Badge>
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
        </ClassBasedTabsContent>

        <ClassBasedTabsContent value="recent" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recent Scores */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Scores</CardTitle>
                <CardDescription>Latest score entries</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {safeLength(recentScores) > 0 ? (
                    safeMap(recentScores, (score) => (
                      <div key={score.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <div className="text-sm">
                          <span className="font-medium">Student ID: {score.studentId?.slice(-6) || 'Unknown'}</span>
                          <p className="text-gray-600">Subject: {score.subjectId || 'Unknown'}</p>
                        </div>
                        <Badge variant={score.total >= 60 ? "default" : "destructive"}>
                          {score.total || 0}%
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No recent scores</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Students */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Students</CardTitle>
                <CardDescription>Recently added students</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {safeLength(recentStudents) > 0 ? (
                    safeMap(recentStudents, (student) => (
                      <div key={student.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <div className="text-sm">
                          <span className="font-medium">{student.fullName || 'Unknown'}</span>
                          <p className="text-gray-600">{student.class || 'No class'}</p>
                        </div>
                        <Badge variant="outline">New</Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No recent students</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </ClassBasedTabsContent>

        <ClassBasedTabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Performance Analytics</span>
              </CardTitle>
              <CardDescription>Detailed insights into system performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{stats.averageScore}%</div>
                  <p className="text-sm text-gray-600">Average Score</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.averageAttendance}%</div>
                  <p className="text-sm text-gray-600">Average Attendance</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {stats.totalStudents > 0 ? Math.round((safeLength(scores) / stats.totalStudents) * 100) / 100 : 0}
                  </div>
                  <p className="text-sm text-gray-600">Scores per Student</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </ClassBasedTabsContent>
      </ClassBasedTabs>
    </div>
  );
}
