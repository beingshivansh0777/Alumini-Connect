import React, { useState, useEffect } from 'react';
import { LandingPage } from './components/common/LandingPage';
import { Layout } from './components/common/Layout';
import { StudentDashboard } from './components/student/StudentDashboard';
import { AlumniDashboard } from './components/alumni/AlumniDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { User } from './types';
import { logout } from './utils/auth';
import { useAuth } from './hooks/useAuth';
import { initializeSampleData } from './utils/localStorage';

function App() {
  const { user, loading } = useAuth();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    // Initialize sample data on first load
    initializeSampleData();
    setCurrentUser(user);
  }, [user]);

  const handleLogin = (loggedInUser: User) => {
    setCurrentUser(loggedInUser);
  };

  const handleLogout = () => {
    logout();
    setCurrentUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // 🟢 If user not logged in, show Landing Page
  if (!currentUser) {
    return <LandingPage onLogin={handleLogin} />;
  }

  // 🟢 Render dashboard based on role
  const renderDashboard = () => {
    switch (currentUser.role) {
      case 'student':
        return <StudentDashboard user={currentUser} />;
      case 'alumni':
        return <AlumniDashboard user={currentUser} />;
      case 'admin':
        return <AdminDashboard user={currentUser} />;
      default:
        return <div>Unknown user role</div>;
    }
  };

  // 🟢 Logged in user sees Layout + Dashboard
  return (
    <Layout user={currentUser} onLogout={handleLogout}>
      {renderDashboard()}
    </Layout>
  );
}

export default App;