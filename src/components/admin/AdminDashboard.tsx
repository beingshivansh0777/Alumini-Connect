import React, { useState, useEffect } from 'react';
import { Users, Calendar, MessageCircle, DollarSign, TrendingUp, CheckCircle, Clock, XCircle } from 'lucide-react';
import { User, AlumniProfile, Event, MentorshipRequest, Donation } from '../../types';
import { 
  getAlumniProfiles, 
  getEvents, 
  getMentorshipRequests, 
  getDonations,
  saveAlumniProfile
} from '../../utils/localStorage';
import { AdminAnalytics } from './AdminAnalytics';
import { EventManagement } from './EventManagement';

interface AdminDashboardProps {
  user: User;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [alumniProfiles, setAlumniProfiles] = useState<AlumniProfile[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [mentorshipRequests, setMentorshipRequests] = useState<MentorshipRequest[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);

  useEffect(() => {
    setAlumniProfiles(getAlumniProfiles());
    setEvents(getEvents());
    setMentorshipRequests(getMentorshipRequests());
    setDonations(getDonations());
  }, []);

  const handleApproveAlumni = (profileId: string, approve: boolean) => {
    const updatedProfiles = alumniProfiles.map(profile => {
      if (profile.id === profileId) {
        const updated = { ...profile, isApproved: approve };
        saveAlumniProfile(updated);
        return updated;
      }
      return profile;
    });
    setAlumniProfiles(updatedProfiles);
  };

  const totalRaised = donations.reduce((sum, donation) => sum + donation.amount, 0);
  const pendingApprovals = alumniProfiles.filter(profile => !profile.isApproved).length;
  const activeMentors = alumniProfiles.filter(profile => profile.isApproved && profile.isAvailableAsMentor).length;
  const upcomingEvents = events.filter(event => new Date(event.date) > new Date()).length;

  const stats = [
    {
      title: 'Total Alumni',
      value: alumniProfiles.length,
      icon: Users,
      color: 'bg-blue-500',
      change: `${pendingApprovals} pending`,
    },
    {
      title: 'Active Events',
      value: upcomingEvents,
      icon: Calendar,
      color: 'bg-teal-500',
      change: `${events.length} total`,
    },
    {
      title: 'Active Mentors',
      value: activeMentors,
      icon: MessageCircle,
      color: 'bg-purple-500',
      change: `${mentorshipRequests.length} requests`,
    },
    {
      title: 'Total Donations',
      value: `₹${totalRaised.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-green-500',
      change: `${donations.length} donors`,
    },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'alumni-approval', label: 'Alumni Approval' },
    { id: 'events', label: 'Event Management' },
    { id: 'mentorship', label: 'Mentorship Tracking' },
    { id: 'donations', label: 'Donations' },
    { id: 'analytics', label: 'Analytics' },
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Approvals</h3>
          <div className="space-y-3">
            {alumniProfiles.filter(profile => !profile.isApproved).slice(0, 5).map((profile) => (
              <div key={profile.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{profile.name}</p>
                  <p className="text-sm text-gray-600">{profile.company} • Class of {profile.year}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleApproveAlumni(profile.id, true)}
                    className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors duration-200"
                  >
                    <CheckCircle className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleApproveAlumni(profile.id, false)}
                    className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors duration-200"
                  >
                    <XCircle className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
            {pendingApprovals === 0 && (
              <p className="text-gray-500 text-sm">No pending approvals</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Donations</h3>
          <div className="space-y-3">
            {donations.slice(-5).reverse().map((donation) => (
              <div key={donation.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                  <DollarSign className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{donation.donorName}</p>
                  <p className="text-lg font-bold text-green-600">₹{donation.amount.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(donation.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
            {donations.length === 0 && (
              <p className="text-gray-500 text-sm">No donations yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderAlumniApproval = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Alumni Profile Approval</h3>
        <p className="text-sm text-gray-600 mt-1">Review and approve alumni profile registrations</p>
      </div>
      <div className="divide-y divide-gray-200">
        {alumniProfiles.map((profile) => (
          <div key={profile.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">
                      {profile.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{profile.name}</h4>
                    <p className="text-sm text-gray-600">{profile.email}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Company:</span> {profile.company}
                  </div>
                  <div>
                    <span className="text-gray-500">Year:</span> {profile.year}
                  </div>
                  <div>
                    <span className="text-gray-500">Branch:</span> {profile.branch}
                  </div>
                  <div>
                    <span className="text-gray-500">LinkedIn:</span>{' '}
                    {profile.linkedinUrl ? (
                      <a
                        href={profile.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Profile
                      </a>
                    ) : (
                      'Not provided'
                    )}
                  </div>
                </div>
                
                {profile.bio && (
                  <p className="text-sm text-gray-600 mt-3">{profile.bio}</p>
                )}
                
                {profile.skills && profile.skills.length > 0 && (
                  <div className="mt-3">
                    <div className="flex flex-wrap gap-1">
                      {profile.skills.map((skill, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                  profile.isApproved 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {profile.isApproved ? 'Approved' : 'Pending'}
                </span>
                
                {!profile.isApproved && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleApproveAlumni(profile.id, true)}
                      className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors duration-200"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleApproveAlumni(profile.id, false)}
                      className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors duration-200"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMentorshipTracking = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Mentorship Tracking</h3>
        <p className="text-sm text-gray-600 mt-1">Monitor mentorship requests and connections</p>
      </div>
      <div className="divide-y divide-gray-200">
        {mentorshipRequests.map((request) => (
          <div key={request.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="font-medium text-gray-900">{request.studentName}</h4>
                  <span className="text-gray-400">→</span>
                  <h4 className="font-medium text-gray-900">{request.alumniName}</h4>
                </div>
                <p className="text-sm text-gray-600 mb-2">{request.message}</p>
                <div className="text-xs text-gray-500">
                  <p>Student: {request.studentEmail}</p>
                  <p>Sent: {new Date(request.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <span className={`ml-4 px-3 py-1 text-sm font-medium rounded-full ${
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
        ))}
        {mentorshipRequests.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            <MessageCircle className="h-12 w-12 mx-auto text-gray-300 mb-3" />
            <p>No mentorship requests yet</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderDonations = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Donation Summary</h3>
          <div className="text-right">
            <p className="text-2xl font-bold text-green-600">₹{totalRaised.toLocaleString()}</p>
            <p className="text-sm text-gray-500">Total Raised</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{donations.length}</p>
            <p className="text-sm text-gray-600">Total Donations</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">
              ₹{donations.length > 0 ? Math.round(totalRaised / donations.length).toLocaleString() : 0}
            </p>
            <p className="text-sm text-gray-600">Average Donation</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">
              {donations.length > 0 ? Math.max(...donations.map(d => d.amount)).toLocaleString() : 0}
            </p>
            <p className="text-sm text-gray-600">Largest Donation</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">All Donations</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Donor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Message
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {donations.slice().reverse().map((donation) => (
                <tr key={donation.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{donation.donorName}</div>
                      <div className="text-sm text-gray-500">{donation.donorEmail}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                    ₹{donation.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(donation.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {donation.paymentId}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                    {donation.message || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {donations.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <DollarSign className="h-12 w-12 mx-auto text-gray-300 mb-3" />
              <p>No donations yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage the alumni portal system</p>
        </div>
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors duration-200 ${
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
      {activeTab === 'alumni-approval' && renderAlumniApproval()}
      {activeTab === 'events' && <EventManagement user={user} />}
      {activeTab === 'mentorship' && renderMentorshipTracking()}
      {activeTab === 'donations' && renderDonations()}
      {activeTab === 'analytics' && <AdminAnalytics />}
    </div>
  );
};