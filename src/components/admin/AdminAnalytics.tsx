import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, Users, Calendar, DollarSign, MessageCircle } from 'lucide-react';
import { AlumniProfile, Event, MentorshipRequest, Donation } from '../../types';
import { getAlumniProfiles, getEvents, getMentorshipRequests, getDonations } from '../../utils/localStorage';

export const AdminAnalytics: React.FC = () => {
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

  // Alumni by graduation year
  const alumniByYear = alumniProfiles.reduce((acc, profile) => {
    const year = profile.year;
    acc[year] = (acc[year] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const yearData = Object.entries(alumniByYear)
    .map(([year, count]) => ({ year, count }))
    .sort((a, b) => parseInt(a.year) - parseInt(b.year));

  // Alumni by branch
  const alumniByBranch = alumniProfiles.reduce((acc, profile) => {
    const branch = profile.branch;
    acc[branch] = (acc[branch] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const branchData = Object.entries(alumniByBranch)
    .map(([branch, count]) => ({ branch: branch.length > 15 ? branch.substring(0, 15) + '...' : branch, count }));

  // Event participation over time
  const eventParticipation = events.map(event => ({
    name: event.title.length > 20 ? event.title.substring(0, 20) + '...' : event.title,
    attendees: event.rsvpList.length,
    date: event.date,
  }));

  // Donation trends by month
  const donationsByMonth = donations.reduce((acc, donation) => {
    const month = new Date(donation.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    acc[month] = (acc[month] || 0) + donation.amount;
    return acc;
  }, {} as Record<string, number>);

  const donationData = Object.entries(donationsByMonth)
    .map(([month, amount]) => ({ month, amount }));

  // Mentorship status distribution
  const mentorshipStatus = mentorshipRequests.reduce((acc, request) => {
    acc[request.status] = (acc[request.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const mentorshipData = Object.entries(mentorshipStatus)
    .map(([status, count]) => ({ status, count }));

  const COLORS = ['#3B82F6', '#14B8A6', '#F97316', '#EF4444', '#8B5CF6'];

  const totalRaised = donations.reduce((sum, donation) => sum + donation.amount, 0);
  const activeMentors = alumniProfiles.filter(profile => profile.isApproved && profile.isAvailableAsMentor).length;
  const totalEvents = events.length;
  const approvalRate = alumniProfiles.length > 0 
    ? ((alumniProfiles.filter(profile => profile.isApproved).length / alumniProfiles.length) * 100).toFixed(1)
    : 0;

  const stats = [
    {
      title: 'Total Alumni',
      value: alumniProfiles.length,
      icon: Users,
      color: 'bg-blue-500',
      change: `${approvalRate}% approved`,
    },
    {
      title: 'Active Mentors',
      value: activeMentors,
      icon: MessageCircle,
      color: 'bg-teal-500',
      change: `${mentorshipRequests.length} requests`,
    },
    {
      title: 'Total Events',
      value: totalEvents,
      icon: Calendar,
      color: 'bg-purple-500',
      change: `${eventParticipation.reduce((sum, event) => sum + event.attendees, 0)} total RSVPs`,
    },
    {
      title: 'Funds Raised',
      value: `₹${totalRaised.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-green-500',
      change: `${donations.length} donations`,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

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
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Alumni by Graduation Year</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={yearData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Alumni by Branch</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={branchData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ branch, percent }) => `${branch} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {branchData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Participation</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={eventParticipation}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="attendees" fill="#14B8A6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Donation Trends</h3>
          <div className="h-80">
            {donationData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={donationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Amount']} />
                  <Line type="monotone" dataKey="amount" stroke="#10B981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <DollarSign className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                  <p>No donation data available</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {mentorshipRequests.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Mentorship Request Status</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mentorshipData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ status, percent }) => `${status} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {mentorshipData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};