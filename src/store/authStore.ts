/**
 * Authentication store using Zustand for state management
 */
import { create } from 'zustand';
import { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => void;
}

// Mock users data - in real app, this would come from a backend
const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    fullName: 'System Administrator',
  },
];

// Get users from localStorage
const getStoredUsers = (): User[] => {
  try {
    const stored = localStorage.getItem('rombless_users');
    return stored ? JSON.parse(stored) : mockUsers;
  } catch {
    return mockUsers;
  }
};

// Save users to localStorage
const saveUsers = (users: User[]) => {
  localStorage.setItem('rombless_users', JSON.stringify(users));
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,

  login: async (username: string, password: string): Promise<boolean> => {
    const users = getStoredUsers();
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
      localStorage.setItem('rombless_current_user', JSON.stringify(user));
      set({ user, isAuthenticated: true });
      return true;
    }
    return false;
  },

  logout: () => {
    localStorage.removeItem('rombless_current_user');
    set({ user: null, isAuthenticated: false });
  },

  checkAuth: () => {
    try {
      const stored = localStorage.getItem('rombless_current_user');
      if (stored) {
        const user = JSON.parse(stored);
        set({ user, isAuthenticated: true });
      }
    } catch {
      // Invalid stored data, ignore
    }
  },
}));

// Function to add new teacher (only accessible by admin)
export const addTeacherUser = (teacher: Omit<User, 'id'>): boolean => {
  const users = getStoredUsers();
  const newUser: User = {
    ...teacher,
    id: Date.now().toString(),
    role: 'teacher',
  };
  
  // Check if username already exists
  if (users.some(u => u.username === teacher.username)) {
    return false;
  }
  
  users.push(newUser);
  saveUsers(users);
  return true;
};
