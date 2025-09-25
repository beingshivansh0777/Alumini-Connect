import React, { useState, useEffect } from 'react';
import { Users, Calendar, MessageCircle, TrendingUp, Search, Filter } from 'lucide-react';
import { User, AlumniProfile, Event, MentorshipRequest } from '../../types';
import { getApprovedAlumniProfiles, getEvents, getMentorshipRequests, getStudentProfileByUserId, saveStudentProfile } from '../../utils/localStorage';
import { AlumniDirectory } from './AlumniDirectory';
import { EventList } from '../events/EventList';

interface StudentDashboardProps {
  user: User;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [alumniProfiles, setAlumniProfiles] = useState<AlumniProfile[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [mentorshipRequests, setMentorshipRequests] = useState<MentorshipRequest[]>([]);
  const [studentProfile, setStudentProfile] = useState(null);

  useEffect(() => {
    setAlumniProfiles(getApprovedAlumniProfiles());
    setEvents(getEvents());
    setMentorshipRequests(getMentorshipRequests().filter(req => req.studentId === user.id));
    
    const profile = getStudentProfileByUserId(user.id);
    if (!profile) {
      // Create default profile for first-time users
      const newProfile = {
        id: `student-profile-${user.id}`,
        userId: user.id,
        name: user.email.split('@')[0],
        email: user.email,
        year: new Date().getFullYear(),
        branch: 'Computer Science',
        rollNumber: `CS${new Date().getFullYear()}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        interests: [],
        createdAt: new Date().toISOString(),
      };
      saveStudentProfile(newProfile);
      setStudentProfile(newProfile);
    } else {
      setStudentProfile(profile);
    }
  }, [user.id]);

  const availableMentors = alumniProfiles.filter(profile => profile.isAvailableAsMentor);
  const upcomingEvents = events.filter(event => new Date(event.date) > new Date()).slice(0, 3);

  const stats = [
    {
      title: 'Available Mentors',
      value: availableMentors.length,
      icon: Users,
      color: 'bg-blue-500',
      change: '+12%',
    },
    {
      title: 'Upcoming Events',
      value: upcomingEvents.length,
      icon: Calendar,
      color: 'bg-teal-500',
      change: '+5%',
    },
    {
      title: 'Active Requests',
      value: mentorshipRequests.filter(req => req.status === 'pending').length,
      icon: MessageCircle,
      color: 'bg-orange-500',
      change: '0%',
    },
    {
      title: 'Total Alumni',
      value: alumniProfiles.length,
      icon: TrendingUp,
      color: 'bg-purple-500',
      change: '+8%',
    },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'directory', label: 'Alumni Directory' },
    { id: 'events', label: 'Events' },
    { id: 'mentorship', label: 'My Requests' },
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <span className="text-sm text-green-600 font-medium">{stat.change}</span>
                    <span className="text-sm text-gray-500 ml-1">vs last month</span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Mentors</h3>
          <div className="space-y-4">
            {availableMentors.slice(0, 3).map((mentor) => (
              <div key={mentor.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {mentor.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{mentor.name}</p>
                  <p className="text-sm text-gray-500">{mentor.company}</p>
                  <p className="text-xs text-gray-400">Class of {mentor.year}</p>
                </div>
                <button className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full hover:bg-blue-200 transition-colors duration-200">
                  Connect
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h3>
          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="p-3 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors duration-200">
                <h4 className="font-medium text-gray-900">{event.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                <div className="flex items-center justify-between mt-2">
                  <div className="text-xs text-gray-500">
                    {new Date(event.date).toLocaleDateString()} at {event.time}
                  </div>
                  <button className="px-2 py-1 bg-teal-100 text-teal-700 text-xs font-medium rounded hover:bg-teal-200 transition-colors duration-200">
                    RSVP
                  </button>
                </div>
              </div>
            ))}
            {upcomingEvents.length === 0 && (
              <p className="text-gray-500 text-sm">No upcoming events</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderMentorshipRequests = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">My Mentorship Requests</h3>
      </div>
      <div className="divide-y divide-gray-200">
        {mentorshipRequests.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <MessageCircle className="h-12 w-12 mx-auto text-gray-300 mb-3" />
            <p>No mentorship requests yet</p>
            <p className="text-sm">Browse the alumni directory to connect with mentors</p>
          </div>
        ) : (
          mentorshipRequests.map((request) => (
            <div key={request.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{request.alumniName}</h4>
                  <p className="text-sm text-gray-600 mt-1">{request.message}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    Sent on {new Date(request.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  request.status === 'pending' 
                    ? 'bg-yellow-100 text-yellow-800'
                    : request.status === 'approved'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {request.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {studentProfile?.name || user.email}</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200">
            <Filter className="h-4 w-4 mr-2 inline" />
            Filters
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
            Find Mentor
          </button>
        </div>
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'directory' && <AlumniDirectory user={user} />}
      {activeTab === 'events' && <EventList user={user} />}
      {activeTab === 'mentorship' && renderMentorshipRequests()}
    </div>
  );
};