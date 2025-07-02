/**
 * Home page with bulletproof tab system
 */
import React from 'react';
import SimpleDashboard from '../components/SimpleDashboard';
import StudentsPage from '../components/StudentsPage';
import TeachersPage from '../components/TeachersPage';
import ClassesPage from '../components/ClassesPage';
import SubjectsPage from '../components/SubjectsPage';
import ScoresPage from '../components/ScoresPage';
import CommentsPage from '../components/CommentsPage';
import AttendancePage from '../components/AttendancePage';
import ReportsPage from '../components/ReportsPage';
import ClassReportPage from '../components/ClassReportPage';
import MyClassesPage from '../components/MyClassesPage';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/button';
import { 
  GraduationCap, 
  LogOut, 
  Users, 
  BookOpen, 
  ClipboardList, 
  MessageSquare, 
  Calendar,
  FileText,
  BarChart3,
  Home as HomeIcon
} from 'lucide-react';

/**
 * Safe Home component with comprehensive error protection
 */
export default function Home() {
  const { user, logout } = useAuthStore();
  
  // Use bulletproof state management for active tab
  const [activeTab, setActiveTab] = React.useState<string>('overview');
  
  // Create bulletproof tab change handler with explicit function assignment
  const handleTabChange: (value: string) => void = React.useCallback(function handleTabChange(value: string) {
    console.log('Home: handleTabChange called with value:', value);
    
    try {
      // Validate input
      if (typeof value !== 'string' || value.trim() === '') {
        console.warn('Home: Invalid tab value provided:', value);
        return;
      }
      
      // Update state safely
      setActiveTab(value);
      console.log('Home: Tab changed successfully to:', value);
      
    } catch (error) {
      console.error('Home: Tab change failed:', error);
      // Fallback to default tab
      setActiveTab('overview');
    }
  }, []);
  
  // Verify the handler is a function
  React.useEffect(() => {
    if (typeof handleTabChange !== 'function') {
      console.error('CRITICAL: handleTabChange is not a function in Home component!');
    } else {
      console.log('Home: handleTabChange verified as function');
    }
  }, [handleTabChange]);
  
  // Ensure global handlers are available
  React.useEffect(() => {
    // Assign safe global handlers
    (window as any).onTabChange = handleTabChange;
    (window as any).handleTabChange = handleTabChange;
    
    console.log('Home: Global tab handlers assigned');
  }, [handleTabChange]);

  // Safe logout handler
  const handleLogout = React.useCallback(() => {
    try {
      console.log('Home: Logout clicked');
      
      if (logout && typeof logout === 'function') {
        console.log('Home: Calling logout function');
        logout();
      } else {
        console.error('Home: logout is not a function', typeof logout);
        // Fallback - clear localStorage manually
        localStorage.removeItem('rombless_current_user');
        window.location.reload();
      }
    } catch (error) {
      console.error('Home: Logout failed:', error);
      // Emergency fallback
      localStorage.clear();
      window.location.reload();
    }
  }, [logout]);

  // Verify logout function on mount
  React.useEffect(() => {
    console.log('Home: Verifying logout function:', typeof logout);
    if (typeof logout !== 'function') {
      console.error('Home: logout from useAuthStore is not a function!');
    }
  }, [logout]);

  // Define navigation tabs based on user role
  const adminTabs = [
    { id: 'overview', label: 'Dashboard', icon: BarChart3 },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'teachers', label: 'Teachers', icon: GraduationCap },
    { id: 'classes', label: 'Classes', icon: BookOpen },
    { id: 'subjects', label: 'Subjects', icon: ClipboardList },
    { id: 'scores', label: 'Scores', icon: ClipboardList },
    { id: 'comments', label: 'Comments', icon: MessageSquare },
    { id: 'attendance', label: 'Attendance', icon: Calendar },
    { id: 'reports', label: 'Report Cards', icon: FileText },
    { id: 'class-reports', label: 'Class Reports', icon: BarChart3 },
  ];

  const teacherTabs = [
    { id: 'overview', label: 'Dashboard', icon: BarChart3 },
    { id: 'my-classes', label: 'My Classes', icon: Users },
    { id: 'scores', label: 'Enter Scores', icon: ClipboardList },
    { id: 'comments', label: 'Comments', icon: MessageSquare },
    { id: 'attendance', label: 'Attendance', icon: Calendar },
  ];

  const tabs = user?.role === 'admin' ? adminTabs : teacherTabs;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Rombless Academy</h1>
              <p className="text-sm text-gray-600">Student Management System</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user?.fullName || 'User'}</p>
              <p className="text-xs text-gray-600 capitalize">{user?.role || 'Student'}</p>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center space-x-2 px-3 py-1.5 text-sm font-medium border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <nav className="w-64 bg-white shadow-sm min-h-screen border-r">
          <div className="p-4 space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {tabs.find(tab => tab.id === activeTab)?.label || 'Dashboard'}
              </h1>
              <p className="text-muted-foreground">
                {activeTab === 'overview' 
                  ? 'Overview of your student management system'
                  : `Manage ${tabs.find(tab => tab.id === activeTab)?.label?.toLowerCase() || 'items'} efficiently`}
              </p>
            </div>

            {/* Content based on active tab */}
            {activeTab === 'overview' && <SimpleDashboard />}
            {activeTab === 'students' && <StudentsPage />}
            {activeTab === 'teachers' && <TeachersPage />}
            {activeTab === 'classes' && <ClassesPage />}
            {activeTab === 'subjects' && <SubjectsPage />}
            {activeTab === 'scores' && <ScoresPage />}
            {activeTab === 'comments' && <CommentsPage />}
            {activeTab === 'attendance' && <AttendancePage />}
            {activeTab === 'reports' && <ReportsPage />}
            {activeTab === 'class-reports' && <ClassReportPage />}
            {activeTab === 'my-classes' && <MyClassesPage />}
          </div>
        </main>
      </div>
    </div>
  );
}
