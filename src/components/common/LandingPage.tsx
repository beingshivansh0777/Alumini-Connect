// src/components/common/LandingPage.tsx
import React, { useState } from 'react';
import { User as UserType } from '../../types';
import { LoginPage } from '../auth/LoginPage';
import Alumini from '../assets/alumini.png'; 
interface LandingPageProps {
  onLogin: (user: UserType) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div className="flex flex-col flex-1 min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-20 bg-gradient-to-r from-blue-400 to-indigo-600 text-white">
        <div className="md:w-1/2 mb-10 md:mb-0">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Connect. Engage. Grow with Your Alma Mater
          </h1>
          <p className="text-lg md:text-xl mb-6">
            Join our Alumni Network to stay connected with fellow graduates,
            access exclusive events, and explore career opportunities.
          </p>
          <button
            onClick={() => setShowLogin(true)}
            className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition"
          >
            Login
          </button>
        </div>

        <div className="md:w-1/2 flex justify-center">
          <img
            src={Alumini}
            alt="Alumni Network"
            className="w-full max-w-md rounded-lg shadow-lg"
          />
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-6 md:px-20 bg-white text-gray-800 flex-1">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why Join Our Alumni Platform?
        </h2>
        <div className="grid md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl mb-4">🤝</div>
            <h3 className="font-semibold mb-2">Networking</h3>
            <p>Connect with alumni across batches and industries.</p>
          </div>
          <div>
            <div className="text-4xl mb-4">🎓</div>
            <h3 className="font-semibold mb-2">Events & Workshops</h3>
            <p>Stay updated with webinars, meetups, and alumni events.</p>
          </div>
          <div>
            <div className="text-4xl mb-4">💼</div>
            <h3 className="font-semibold mb-2">Career Opportunities</h3>
            <p>Get exclusive job postings and mentorship.</p>
          </div>
          <div>
            <div className="text-4xl mb-4">📩</div>
            <h3 className="font-semibold mb-2">Stay Updated</h3>
            <p>Receive newsletters and updates from your alma mater.</p>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md h-auto p-6 relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={() => setShowLogin(false)}
            >
              ✕
            </button>

            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="w-full max-h-[650px] overflow-y-auto">
                <LoginPage
                  onLogin={(user) => {
                    onLogin(user);
                    setShowLogin(false);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};