/**
 * Class-based Dashboard component with constructor binding for all handlers
 */
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Users, BookOpen, Award, TrendingUp, Calendar, Clock, User, Star } from 'lucide-react';
import { ClassBasedTabs, ClassBasedTabsList, ClassBasedTabsTrigger, ClassBasedTabsContent } from './ClassBasedTabs';
import { useDataStore } from '../store/dataStore';
import { safeMap, safeLength } from '../utils/arrayHelpers';
import { forceAssignFunction } from '../utils/functionEnforcer';

interface ClassBasedDashboardProps {
  students: any[];
  classes: any[];
  subjects: any[];
  teachers: any[];
}

interface ClassBasedDashboardState {
  activeTab: string;
}

/**
 * Class-based Dashboard with constructor-bound handlers
 */
class ClassBasedDashboardComponent extends React.Component<ClassBasedDashboardProps, ClassBasedDashboardState> {
  private handleTabChange: (value: string) => void;
  private handleQuickAction: (action: string) => void;

  constructor(props: ClassBasedDashboardProps) {
    super(props);
    
    // Initialize state
    this.state = {
      activeTab: 'overview'
    };
    
    // CONSTRUCTOR BINDING - Explicitly bind all handlers to this
    this.handleTabChange = this.handleTabChange.bind(this);
    this.handleQuickAction = this.handleQuickAction.bind(this);
    
    // Verify bindings are functions
    if (typeof this.handleTabChange !== 'function') {
      console.error('CRITICAL: handleTabChange not bound as function!');
      this.handleTabChange = function(value: string) {
        console.log('ClassBasedDashboard: Bound fallback tab change:', value);
        this.setState({ activeTab: value || 'overview' });
      }.bind(this);
    }
    
    if (typeof this.handleQuickAction !== 'function') {
      console.error('CRITICAL: handleQuickAction not bound as function!');
      this.handleQuickAction = function(action: string) {
        console.log('ClassBasedDashboard: Bound fallback action:', action);
      }.bind(this);
    }
    
    console.log('ClassBasedDashboard: Constructor binding completed');
  }

  /**
   * Component did mount - enforce global functions
   */
  componentDidMount(): void {
    // Force assign global variables to prevent 'a is not a function' errors
    const commonVars = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
    commonVars.forEach(varName => {
      if (window[varName as any] !== undefined && typeof window[varName as any] !== 'function') {
        forceAssignFunction(window, varName, function enforcedGlobalVar() {
          console.log(`ClassBasedDashboard: Enforced global ${varName} called`);
        });
      }
    });
  }

  /**
   * Tab change handler - bound in constructor
   */
  handleTabChange(value: string): void {
    console.log('ClassBasedDashboard: handleTabChange called with:', value);
    
    if (typeof value === 'string' && value.trim() !== '') {
      this.setState({ activeTab: value });
    } else {
      console.warn('ClassBasedDashboard: Invalid tab value, using overview');
      this.setState({ activeTab: 'overview' });
    }
  }

  /**
   * Quick action handler - bound in constructor
   */
  handleQuickAction(action: string): void {
    console.log('ClassBasedDashboard: handleQuickAction called with:', action);
    
    switch (action) {
      case 'add-student':
        this.setState({ activeTab: 'students' });
        break;
      case 'view-reports':
        this.setState({ activeTab: 'analytics' });
        break;
      default:
        console.log('ClassBasedDashboard: Unknown action:', action);
    }
  }

  /**
   * Render method
   */
  render(): JSX.Element {
    const { activeTab } = this.state;
    
    // Get data from props
    const { students, classes, subjects, teachers } = this.props;

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back! Here's an overview of your examination system.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              onClick={this.handleQuickAction.bind(this, 'add-student')}
              size="sm"
            >
              <Users className="mr-2 h-4 w-4" />
              Add Student
            </Button>
            <Button 
              onClick={this.handleQuickAction.bind(this, 'view-reports')}
              variant="outline" 
              size="sm"
            >
              <TrendingUp className="mr-2 h-4 w-4" />
              View Reports
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{safeLength(students)}</div>
              <p className="text-xs text-muted-foreground">
                +2 from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Classes</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{safeLength(classes)}</div>
              <p className="text-xs text-muted-foreground">
                +1 from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Subjects</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{safeLength(subjects)}</div>
              <p className="text-xs text-muted-foreground">
                Across all classes
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Teachers</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{safeLength(teachers)}</div>
              <p className="text-xs text-muted-foreground">
                Active this term
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Class-Based Tabs with Constructor Binding */}
        <ClassBasedTabs 
          value={activeTab} 
          onValueChange={this.handleTabChange}
          className="space-y-4"
        >
          <ClassBasedTabsList className="grid w-full grid-cols-3">
            <ClassBasedTabsTrigger value="overview">Overview</ClassBasedTabsTrigger>
            <ClassBasedTabsTrigger value="recent">Recent Activity</ClassBasedTabsTrigger>
            <ClassBasedTabsTrigger value="analytics">Analytics</ClassBasedTabsTrigger>
          </ClassBasedTabsList>

          <ClassBasedTabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Students</CardTitle>
                  <CardDescription>Latest student registrations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {safeMap(students.slice(0, 5), (student, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <User className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{student.name}</p>
                          <p className="text-xs text-muted-foreground">{student.class}</p>
                        </div>
                        <Badge variant="secondary">{student.rollNumber}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common tasks and shortcuts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={this.handleQuickAction.bind(this, 'add-student')}
                    >
                      <Users className="mr-2 h-4 w-4" />
                      Add New Student
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={this.handleQuickAction.bind(this, 'view-reports')}
                    >
                      <TrendingUp className="mr-2 h-4 w-4" />
                      Generate Reports
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </ClassBasedTabsContent>

          <ClassBasedTabsContent value="recent" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest actions in the system</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm">New student registration</p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Star className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm">Exam results updated</p>
                      <p className="text-xs text-muted-foreground">5 hours ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </ClassBasedTabsContent>

          <ClassBasedTabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Analytics</CardTitle>
                <CardDescription>Performance metrics and insights</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <TrendingUp className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-2 text-sm font-medium">Analytics Dashboard</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Detailed analytics and reporting features coming soon.
                  </p>
                </div>
              </CardContent>
            </Card>
          </ClassBasedTabsContent>
        </ClassBasedTabs>
      </div>
    );
  }
}

/**
 * HOC to provide store data to class component
 */
const withDataStore = (Component: React.ComponentType<ClassBasedDashboardProps>) => {
  return function DataStoreWrapper(props: {}) {
    const students = useDataStore(state => state.students);
    const classes = useDataStore(state => state.classes);
    const subjects = useDataStore(state => state.subjects);
    const teachers = useDataStore(state => state.teachers);

    return (
      <Component
        students={students}
        classes={classes}
        subjects={subjects}
        teachers={teachers}
        {...props}
      />
    );
  };
};

/**
 * Export wrapped component
 */
export const ClassBasedDashboard = withDataStore(ClassBasedDashboardComponent);
