import { User } from '../types';
import { getFromStorage, saveUser, setCurrentUser, getCurrentUser } from './localStorage';

export const login = (email: string, role: 'alumni' | 'student' | 'admin'): User | null => {
  const users = getFromStorage<User>('alumni_portal_users');
  let user = users.find(u => u.email === email && u.role === role);
  
  if (!user) {
    // Create new user if not exists
    user = {
      id: `${role}-${Date.now()}`,
      email,
      role,
      createdAt: new Date().toISOString(),
    };
    saveUser(user);
  }
  
  setCurrentUser(user);
  return user;
};

export const logout = (): void => {
  setCurrentUser(null);
};

export const isAuthenticated = (): boolean => {
  return getCurrentUser() !== null;
};

export const getAuthenticatedUser = (): User | null => {
  return getCurrentUser();
};

export const hasRole = (role: string): boolean => {
  const user = getCurrentUser();
  return user ? user.role === role : false;
};