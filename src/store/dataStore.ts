/**
 * Data store for managing students, teachers, classes, subjects, scores, etc.
 */
import { create } from 'zustand';
import { Student, Teacher, Class, Subject, Score, StudentComment, Attendance } from '../types';
import { safeExecute, isValidId, isValidObject } from '../utils/safeFunction';

interface DataState {
  students: Student[];
  teachers: Teacher[];
  classes: Class[];
  subjects: Subject[];
  scores: Score[];
  comments: StudentComment[];
  attendance: Attendance[];
  
  // Student methods
  addStudent: (student: Omit<Student, 'id'>) => void;
  updateStudent: (id: string, student: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  getStudentsByClass: (className: string) => Student[];
  
  // Teacher methods
  addTeacher: (teacher: Omit<Teacher, 'id'>) => void;
  updateTeacher: (id: string, teacher: Partial<Teacher>) => void;
  deleteTeacher: (id: string) => void;
  
  // Class methods
  addClass: (cls: Omit<Class, 'id'>) => void;
  updateClass: (id: string, cls: Partial<Class>) => void;
  deleteClass: (id: string) => void;
  
  // Subject methods
  addSubject: (subject: Omit<Subject, 'id'>) => void;
  updateSubject: (id: string, subject: Partial<Subject>) => void;
  deleteSubject: (id: string) => void;
  
  // Score methods
  addScore: (score: Omit<Score, 'id' | 'convertedClassScore' | 'convertedExamScore' | 'total' | 'grade'>) => void;
  updateScore: (id: string, score: Partial<Score>) => void;
  getScoresByStudent: (studentId: string, term?: string, academicYear?: string) => Score[];
  getScoresByClass: (className: string) => Score[];
  getGrade: (score: number) => string;
  
  // Comment methods
  addComment: (comment: Omit<StudentComment, 'id'>) => void;
  updateComment: (id: string, comment: Partial<StudentComment>) => void;
  
  // Attendance methods
  addAttendance: (attendance: Omit<Attendance, 'id' | 'percentage'>) => void;
  updateAttendance: (id: string, attendance: Partial<Attendance>) => void;
  
  // Load data
  loadData: () => void;
}

// Helper function to calculate grade
const calculateGrade = (total: number): string => {
  if (total >= 80) return 'A1';
  if (total >= 70) return 'B2';
  if (total >= 65) return 'B3';
  if (total >= 60) return 'C4';
  if (total >= 55) return 'C5';
  if (total >= 50) return 'C6';
  if (total >= 45) return 'D7';
  if (total >= 40) return 'E8';
  return 'F9';
};

// Helper functions for localStorage
const getStoredData = <T>(key: string, defaultValue: T[]): T[] => {
  try {
    const stored = localStorage.getItem(`rombless_${key}`);
    if (!stored) return defaultValue;
    
    const parsed = JSON.parse(stored);
    // Ensure the parsed data is an array
    if (!Array.isArray(parsed)) {
      console.warn(`Stored ${key} is not an array, using default value`);
      return defaultValue;
    }
    
    return parsed;
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
    return defaultValue;
  }
};

const saveData = <T>(key: string, data: T[]) => {
  try {
    if (!Array.isArray(data)) {
      console.error(`Attempting to save non-array data for ${key}`);
      return;
    }
    localStorage.setItem(`rombless_${key}`, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

// Initialize store with safe empty arrays
const initializeStore = () => ({
  students: [] as Student[],
  teachers: [] as Teacher[],
  classes: [] as Class[],
  subjects: [] as Subject[],
  scores: [] as Score[],
  comments: [] as StudentComment[],
  attendance: [] as Attendance[],
});

export const useDataStore = create<DataState>((set, get) => ({
  ...initializeStore(),

  // Student methods
  addStudent: (student) => {
    return safeExecute(() => {
      if (!isValidObject(student, ['fullName'])) {
        throw new Error('Invalid student data provided');
      }
      
      const currentStudents = get().students || [];
      const newStudent: Student = { ...student, id: Date.now().toString() };
      const students = [...currentStudents, newStudent];
      set({ students });
      saveData('students', students);
    }, [], null);
  },

  updateStudent: (id, student) => {
    return safeExecute(() => {
      if (!isValidId(id) || !student) {
        throw new Error('Invalid parameters for updating student');
      }
      
      const currentStudents = get().students || [];
      const students = currentStudents.map(s => s && s.id === id ? { ...s, ...student } : s);
      set({ students });
      saveData('students', students);
    }, [], null);
  },

  deleteStudent: (id) => {
    return safeExecute(() => {
      if (!isValidId(id)) {
        throw new Error('No valid ID provided for deleting student');
      }
      
      const currentStudents = get().students || [];
      const students = currentStudents.filter(s => s && s.id !== id);
      set({ students });
      saveData('students', students);
    }, [], null);
  },

  getStudentsByClass: (className) => {
    const students = get().students || [];
    return students.filter(s => s.class === className);
  },

  // Teacher methods
  addTeacher: (teacher) => {
    const newTeacher: Teacher = { ...teacher, id: Date.now().toString() };
    const teachers = [...get().teachers, newTeacher];
    set({ teachers });
    saveData('teachers', teachers);
  },

  updateTeacher: (id, teacher) => {
    const teachers = get().teachers.map(t => t.id === id ? { ...t, ...teacher } : t);
    set({ teachers });
    saveData('teachers', teachers);
  },

  deleteTeacher: (id) => {
    const teachers = get().teachers.filter(t => t.id !== id);
    set({ teachers });
    saveData('teachers', teachers);
  },

  // Class methods
  addClass: (cls) => {
    const newClass: Class = { ...cls, id: Date.now().toString() };
    const classes = [...get().classes, newClass];
    set({ classes });
    saveData('classes', classes);
  },

  updateClass: (id, cls) => {
    const classes = get().classes.map(c => c.id === id ? { ...c, ...cls } : c);
    set({ classes });
    saveData('classes', classes);
  },

  deleteClass: (id) => {
    const classes = get().classes.filter(c => c.id !== id);
    set({ classes });
    saveData('classes', classes);
  },

  // Subject methods
  addSubject: (subject) => {
    const newSubject: Subject = { ...subject, id: Date.now().toString() };
    const subjects = [...get().subjects, newSubject];
    set({ subjects });
    saveData('subjects', subjects);
  },

  updateSubject: (id, subject) => {
    const subjects = get().subjects.map(s => s.id === id ? { ...s, ...subject } : s);
    set({ subjects });
    saveData('subjects', subjects);
  },

  deleteSubject: (id) => {
    const subjects = get().subjects.filter(s => s.id !== id);
    set({ subjects });
    saveData('subjects', subjects);
  },

  // Score methods
  addScore: (score) => {
    const convertedClassScore = Math.round((score.classScore * 40) / 100);
    const convertedExamScore = Math.round((score.examScore * 60) / 100);
    const total = convertedClassScore + convertedExamScore;
    const grade = calculateGrade(total);
    
    const newScore: Score = {
      ...score,
      id: Date.now().toString(),
      convertedClassScore,
      convertedExamScore,
      total,
      grade,
    };
    
    const scores = [...get().scores, newScore];
    set({ scores });
    saveData('scores', scores);
  },

  updateScore: (id, score) => {
    const scores = get().scores.map(s => {
      if (s.id === id) {
        const updated = { ...s, ...score };
        if (score.classScore !== undefined || score.examScore !== undefined) {
          updated.convertedClassScore = Math.round((updated.classScore * 40) / 100);
          updated.convertedExamScore = Math.round((updated.examScore * 60) / 100);
          updated.total = updated.convertedClassScore + updated.convertedExamScore;
          updated.grade = calculateGrade(updated.total);
        }
        return updated;
      }
      return s;
    });
    set({ scores });
    saveData('scores', scores);
  },

  getScoresByStudent: (studentId, term, academicYear) => {
    const scores = get().scores || [];
    return scores.filter(s => {
      if (s.studentId !== studentId) return false;
      if (term && s.term !== term) return false;
      if (academicYear && s.academicYear !== academicYear) return false;
      return true;
    });
  },

  getGrade: (score) => {
    return calculateGrade(score);
  },

  getScoresByClass: (className) => {
    const students = get().students || [];
    const scores = get().scores || [];
    const classStudents = students.filter(s => s.class === className);
    const studentIds = classStudents.map(s => s.id);
    return scores.filter(s => studentIds.includes(s.studentId));
  },

  // Comment methods
  addComment: (comment) => {
    const newComment: StudentComment = { ...comment, id: Date.now().toString() };
    const comments = [...get().comments, newComment];
    set({ comments });
    saveData('comments', comments);
  },

  updateComment: (id, comment) => {
    const comments = get().comments.map(c => c.id === id ? { ...c, ...comment } : c);
    set({ comments });
    saveData('comments', comments);
  },

  // Attendance methods
  addAttendance: (attendance) => {
    const percentage = Math.round((attendance.totalDaysPresent / attendance.totalDaysInTerm) * 100);
    const newAttendance: Attendance = {
      ...attendance,
      id: Date.now().toString(),
      percentage,
    };
    const attendanceList = [...get().attendance, newAttendance];
    set({ attendance: attendanceList });
    saveData('attendance', attendanceList);
  },

  updateAttendance: (id, attendance) => {
    const attendanceList = get().attendance.map(a => {
      if (a.id === id) {
        const updated = { ...a, ...attendance };
        if (attendance.totalDaysPresent !== undefined || attendance.totalDaysInTerm !== undefined) {
          updated.percentage = Math.round((updated.totalDaysPresent / updated.totalDaysInTerm) * 100);
        }
        return updated;
      }
      return a;
    });
    set({ attendance: attendanceList });
    saveData('attendance', attendanceList);
  },

  // Load data
  cleanupData: () => {
    // Clean up any existing data with empty values
    const state = get();
    
    // Clean students
    const cleanStudents = state.students.filter(s => 
      s && s.id && s.id.trim() !== '' && 
      s.fullName && s.fullName.trim() !== '' && 
      s.className && s.className.trim() !== ''
    ).map(s => ({
      ...s,
      id: s.id.trim(),
      fullName: s.fullName.trim(),
      className: s.className.trim()
    }));
    
    // Clean teachers  
    const cleanTeachers = state.teachers.filter(t =>
      t && t.id && t.id.trim() !== '' &&
      t.username && t.username.trim() !== '' &&
      t.fullName && t.fullName.trim() !== ''
    ).map(t => ({
      ...t,
      id: t.id.trim(),
      username: t.username.trim(),
      fullName: t.fullName.trim(),
      assignedClasses: (t.assignedClasses || []).filter(c => c && c.trim() !== ''),
      assignedSubjects: (t.assignedSubjects || []).filter(s => s && s.trim() !== '')
    }));
    
    // Clean classes
    const cleanClasses = state.classes.filter(c =>
      c && c.id && c.id.trim() !== '' &&
      c.name && c.name.trim() !== '' &&
      c.level && c.level.trim() !== ''
    ).map(c => ({
      ...c,
      id: c.id.trim(),
      name: c.name.trim(),
      level: c.level.trim()
    }));
    
    // Clean subjects
    const cleanSubjects = state.subjects.filter(s =>
      s && s.id && s.id.trim() !== '' &&
      s.name && s.name.trim() !== ''
    ).map(s => ({
      ...s,
      id: s.id.trim(),
      name: s.name.trim(),
      code: s.code ? s.code.trim() : s.code
    }));
    
    // Clean scores
    const cleanScores = state.scores.filter(s =>
      s && s.id && s.id.trim() !== '' &&
      s.studentId && s.studentId.trim() !== '' &&
      s.subjectId && s.subjectId.trim() !== ''
    );
    
    // Clean comments
    const cleanComments = state.comments.filter(c =>
      c && c.id && c.id.trim() !== '' &&
      c.studentId && c.studentId.trim() !== ''
    );
    
    set({
      students: cleanStudents,
      teachers: cleanTeachers,
      classes: cleanClasses,
      subjects: cleanSubjects,
      scores: cleanScores,
      comments: cleanComments
    });
    
    console.log('Data cleanup completed', {
      students: cleanStudents.length,
      teachers: cleanTeachers.length,
      classes: cleanClasses.length,
      subjects: cleanSubjects.length
    });
  },

  // Load data
  cleanupData: () => {
    // Clean up any existing data with empty values
    const state = get();
    
    // Clean students
    const cleanStudents = state.students.filter(s => 
      s && s.id && s.id.trim() !== '' && 
      s.fullName && s.fullName.trim() !== '' && 
      s.className && s.className.trim() !== ''
    ).map(s => ({
      ...s,
      id: s.id.trim(),
      fullName: s.fullName.trim(),
      className: s.className.trim()
    }));
    
    // Clean teachers  
    const cleanTeachers = state.teachers.filter(t =>
      t && t.id && t.id.trim() !== '' &&
      t.username && t.username.trim() !== '' &&
      t.fullName && t.fullName.trim() !== ''
    ).map(t => ({
      ...t,
      id: t.id.trim(),
      username: t.username.trim(),
      fullName: t.fullName.trim(),
      assignedClasses: (t.assignedClasses || []).filter(c => c && c.trim() !== ''),
      assignedSubjects: (t.assignedSubjects || []).filter(s => s && s.trim() !== '')
    }));
    
    // Clean classes
    const cleanClasses = state.classes.filter(c =>
      c && c.id && c.id.trim() !== '' &&
      c.name && c.name.trim() !== '' &&
      c.level && c.level.trim() !== ''
    ).map(c => ({
      ...c,
      id: c.id.trim(),
      name: c.name.trim(),
      level: c.level.trim()
    }));
    
    // Clean subjects
    const cleanSubjects = state.subjects.filter(s =>
      s && s.id && s.id.trim() !== '' &&
      s.name && s.name.trim() !== ''
    ).map(s => ({
      ...s,
      id: s.id.trim(),
      name: s.name.trim(),
      code: s.code ? s.code.trim() : s.code
    }));
    
    // Clean scores
    const cleanScores = state.scores.filter(s =>
      s && s.id && s.id.trim() !== '' &&
      s.studentId && s.studentId.trim() !== '' &&
      s.subjectId && s.subjectId.trim() !== ''
    );
    
    // Clean comments
    const cleanComments = state.comments.filter(c =>
      c && c.id && c.id.trim() !== '' &&
      c.studentId && c.studentId.trim() !== ''
    );
    
    set({
      students: cleanStudents,
      teachers: cleanTeachers,
      classes: cleanClasses,
      subjects: cleanSubjects,
      scores: cleanScores,
      comments: cleanComments
    });
    
    console.log('Data cleanup completed', {
      students: cleanStudents.length,
      teachers: cleanTeachers.length,
      classes: cleanClasses.length,
      subjects: cleanSubjects.length
    });
  },

  loadData: () => {
    const loadedData = {
      students: getStoredData('students', []),
      teachers: getStoredData('teachers', []),
      classes: getStoredData('classes', []),
      subjects: getStoredData('subjects', []),
      scores: getStoredData('scores', []),
      comments: getStoredData('comments', []),
      attendance: getStoredData('attendance', []),
    };
    
    // Ensure all loaded data are arrays
    Object.keys(loadedData).forEach(key => {
      if (!Array.isArray(loadedData[key as keyof typeof loadedData])) {
        console.warn(`${key} is not an array, resetting to empty array`);
        (loadedData as any)[key] = [];
      }
    });
    
    set(loadedData);
  },
}));
