import React, { useState } from 'react';
import { User, GraduationCap, Shield } from 'lucide-react';
import { login } from '../../utils/auth';
import { User as UserType } from '../../types';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';

interface LoginPageProps {
  onLogin: (user: UserType) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState<'alumni' | 'student' | 'admin'>('student');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    
    setTimeout(() => {
      const user = login(email, selectedRole);
      if (user) onLogin(user);
      setIsLoading(false);
    }, 800);
  };

  const handleGoogleSuccess = (credentialResponse: CredentialResponse) => {
    if (credentialResponse.credential) {
      // Normally backend verification hoti hai, abhi frontend demo ke liye simple
      const googleUser: UserType = {
        id: 'google_' + Date.now(),
        name: 'Google User',
        email: 'googleuser@example.com',
        role: 'alumni', // default role Google login ke liye
      };
      onLogin(googleUser);
    }
  };

  const roleOptions = [
    { id: 'student', label: 'Student', description: 'Current student seeking mentorship', icon: User, color: 'bg-blue-500' },
    { id: 'alumni', label: 'Alumni', description: 'Graduate ready to give back', icon: GraduationCap, color: 'bg-teal-500' },
    { id: 'admin', label: 'Admin', description: 'System administrator', icon: Shield, color: 'bg-purple-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-600 to-teal-600 rounded-full flex items-center justify-center mb-4">
            <GraduationCap className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
          <p className="text-gray-600">Sign in to your alumni portal account</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          {/* Email Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select your role
              </label>
              <div className="space-y-2">
                {roleOptions.map((role) => {
                  const Icon = role.icon;
                  return (
                    <div
                      key={role.id}
                      className={`relative flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                        selectedRole === role.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedRole(role.id as any)}
                    >
                      <input type="radio" name="role" value={role.id} checked={selectedRole === role.id} onChange={() => {}} className="sr-only" />
                      <div className={`flex-shrink-0 w-10 h-10 ${role.color} rounded-lg flex items-center justify-center`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="ml-3 flex-1">
                        <p className="text-sm font-medium text-gray-900">{role.label}</p>
                        <p className="text-xs text-gray-500">{role.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-teal-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-teal-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          {/* Google Login Button */}
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => console.log('Google Login Failed')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};