import React, { useState, useEffect } from 'react';
import { User, Settings, Heart, Calendar, MessageCircle, TrendingUp, CreditCard as Edit } from 'lucide-react';
import { User as UserType, AlumniProfile, Event, MentorshipRequest, Donation } from '../../types';
import { 
  getAlumniProfileByUserId, 
  saveAlumniProfile, 
  getEvents, 
  getMentorshipRequests,
  getDonations
} from '../../utils/localStorage';
import { AlumniProfile as AlumniProfileComponent } from './AlumniProfile';
import { EventList } from '../events/EventList';
import { DonationPage } from '../donations/DonationPage';

interface AlumniDashboardProps {
  user: UserType;
}

export const AlumniDashboard: React.FC<AlumniDashboardProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [profile, setProfile] = useState<AlumniProfile | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [mentorshipRequests, setMentorshipRequests] = useState<MentorshipRequest[]>([]);
  const [myDonations, setMyDonations] = useState<Donation[]>([]);

  useEffect(() => {
    const alumniProfile = getAlumniProfileByUserId(user.id);
    if (alumniProfile) {
      setProfile(alumniProfile);
    } else {
      // Create default profile for first-time users
      const newProfile: AlumniProfile = {
        id: `alumni-profile-${user.id}`,
        userId: user.id,
        name: user.email.split('@')[0],
        email: user.email,
        year: new Date().getFullYear() - 2,
        branch: 'Computer Science',
        company: 'Your Company',
        linkedinUrl: '',
        isApproved: false,
        isAvailableAsMentor: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      saveAlumniProfile(newProfile);
      setProfile(newProfile);
    }

    setEvents(getEvents());
    
    // Get mentorship requests for this alumni
    const requests = getMentorshipRequests().filter(req => req.alumniName === profile?.name);
    setMentorshipRequests(requests);

    // Get donations by this user
    const donations = getDonations().filter(donation => donation.donorId === user.id);
    setMyDonations(donations);
  }, [user.id, profile?.name]);

  const handleProfileUpdate = (updatedProfile: AlumniProfile) => {
    setProfile(updatedProfile);
  };

  const upcomingEvents = events.filter(event => new Date(event.date) > new Date()).slice(0, 3);
  const totalDonated = myDonations.reduce((sum, donation) => sum + donation.amount, 0);
  const pendingRequests = mentorshipRequests.filter(req => req.status === 'pending').length;

  const stats = [
    {
      title: 'Profile Status',
      value: profile?.isApproved ? 'Approved' : 'Pending',
      icon: User,
      color: profile?.isApproved ? 'bg-green-500' : 'bg-yellow-500',
      change: profile?.isApproved ? 'Active' : 'Under Review',
    },
    {
      title: 'Mentorship',
      value: profile?.isAvailableAsMentor ? 'Active' : 'Inactive',
      icon: MessageCircle,
      color: profile?.isAvailableAsMentor ? 'bg-blue-500' : 'bg-gray-500',
      change: `${pendingRequests} pending`,
    },
    {
      title: 'Total Donated',
      value: `₹${totalDonated.toLocaleString()}`,
      icon: Heart,
      color: 'bg-pink-500',
      change: `${myDonations.length} donations`,
    },
    {
      title: 'Events',
      value: upcomingEvents.length,
      icon: Calendar,
      color: 'bg-teal-500',
      change: 'Upcoming',
    },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'profile', label: 'Profile' },
    { id: 'events', label: 'Events' },
    { id: 'mentorship', label: 'Mentorship' },
    { id: 'donations', label: 'Donations' },
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
                    <span className="text-sm text-gray-500">{stat.change}</span>
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

      {!profile?.isApproved && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Settings className="h-5 w-5 text-yellow-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-800">
                Your profile is pending approval. Complete your profile information to get approved faster.
              </p>
            </div>
            <div className="ml-auto">
              <button
                onClick={() => setActiveTab('profile')}
                className="text-yellow-600 hover:text-yellow-700 text-sm font-medium"
              >
                Update Profile
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Mentorship Requests</h3>
          <div className="space-y-3">
            {mentorshipRequests.slice(0, 3).map((request) => (
              <div key={request.id} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-xs">
                    {request.studentName.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{request.studentName}</p>
                  <p className="text-xs text-gray-500 truncate">{request.message}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(request.createdAt).toLocaleDateString()}
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
            ))}
            {mentorshipRequests.length === 0 && (
              <p className="text-gray-500 text-sm">No mentorship requests yet</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h3>
          <div className="space-y-3">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="p-3 rounded-lg border border-gray-200">
                <h4 className="font-medium text-gray-900 text-sm">{event.title}</h4>
                <div className="flex items-center justify-between mt-2">
                  <div className="text-xs text-gray-500">
                    {new Date(event.date).toLocaleDateString()} at {event.time}
                  </div>
                  <span className="text-xs text-teal-600 font-medium">
                    {event.rsvpList.length} attending
                  </span>
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
        <h3 className="text-lg font-semibold text-gray-900">Mentorship Requests</h3>
        <p className="text-sm text-gray-600 mt-1">Manage incoming mentorship requests from students</p>
      </div>
      <div className="divide-y divide-gray-200">
        {mentorshipRequests.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <MessageCircle className="h-12 w-12 mx-auto text-gray-300 mb-3" />
            <p>No mentorship requests yet</p>
            <p className="text-sm">Make sure you're available as a mentor in your profile</p>
          </div>
        ) : (
          mentorshipRequests.map((request) => (
            <div key={request.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{request.studentName}</h4>
                  <p className="text-sm text-gray-600">{request.studentEmail}</p>
                  <p className="text-sm text-gray-700 mt-2">{request.message}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    Received on {new Date(request.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className={`ml-4 px-2 py-1 text-xs font-medium rounded-full ${
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
          <h1 className="text-2xl font-bold text-gray-900">Alumni Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {profile?.name || user.email}</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setActiveTab('profile')}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 flex items-center"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
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
      {activeTab === 'profile' && profile && (
        <AlumniProfileComponent profile={profile} onUpdate={handleProfileUpdate} />
      )}
      {activeTab === 'events' && <EventList user={user} />}
      {activeTab === 'mentorship' && renderMentorshipRequests()}
      {activeTab === 'donations' && <DonationPage user={user} />}
    </div>
  );
};