/**
 * Main layout component with navigation
 */
import { ReactNode } from 'react';
import { Button } from './ui/button';
import { useAuthStore } from '../store/authStore';
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
  Settings
} from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Layout({ children, activeTab, onTabChange }: LayoutProps) {
  const { user, logout } = useAuthStore();

  const adminTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'teachers', label: 'Teachers', icon: GraduationCap },
    { id: 'classes', label: 'Classes', icon: BookOpen },
    { id: 'subjects', label: 'Subjects', icon: ClipboardList },
    { id: 'scores', label: 'Scores', icon: ClipboardList },
    { id: 'comments', label: 'Comments', icon: MessageSquare },
    { id: 'attendance', label: 'Attendance', icon: Calendar },
    { id: 'reports', label: 'Report Cards', icon: FileText },
    { id: 'class-report', label: 'Class Reports', icon: BarChart3 },
  ];

  const teacherTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
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
              <p className="text-sm text-gray-600">Examination Management System</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user?.fullName}</p>
              <p className="text-xs text-gray-600 capitalize">{user?.role}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="flex items-center space-x-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-white shadow-sm min-h-screen border-r">
          <div className="p-4 space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
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
          {children}
        </main>
      </div>
    </div>
  );
}
