import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Building, Calendar, MessageCircle, ExternalLink, Users } from 'lucide-react';
import { User, AlumniProfile, MentorshipRequest } from '../../types';
import { getApprovedAlumniProfiles, saveMentorshipRequest, getStudentProfileByUserId } from '../../utils/localStorage';

interface AlumniDirectoryProps {
  user: User;
}

export const AlumniDirectory: React.FC<AlumniDirectoryProps> = ({ user }) => {
  const [alumniProfiles, setAlumniProfiles] = useState<AlumniProfile[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<AlumniProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [showMentorsOnly, setShowMentorsOnly] = useState(false);
  const [selectedAlumni, setSelectedAlumni] = useState<AlumniProfile | null>(null);
  const [mentorshipMessage, setMentorshipMessage] = useState('');
  const [showRequestModal, setShowRequestModal] = useState(false);

  useEffect(() => {
    const profiles = getApprovedAlumniProfiles();
    setAlumniProfiles(profiles);
    setFilteredProfiles(profiles);
  }, []);

  useEffect(() => {
    let filtered = [...alumniProfiles];

    if (searchQuery) {
      filtered = filtered.filter(profile =>
        profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile.branch.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedYear) {
      filtered = filtered.filter(profile => profile.year.toString() === selectedYear);
    }

    if (selectedBranch) {
      filtered = filtered.filter(profile => profile.branch === selectedBranch);
    }

    if (showMentorsOnly) {
      filtered = filtered.filter(profile => profile.isAvailableAsMentor);
    }

    setFilteredProfiles(filtered);
  }, [searchQuery, selectedYear, selectedBranch, showMentorsOnly, alumniProfiles]);

  const uniqueYears = [...new Set(alumniProfiles.map(profile => profile.year))].sort((a, b) => b - a);
  const uniqueBranches = [...new Set(alumniProfiles.map(profile => profile.branch))].sort();

  const handleRequestMentorship = (alumni: AlumniProfile) => {
    setSelectedAlumni(alumni);
    setShowRequestModal(true);
  };

  const submitMentorshipRequest = () => {
    if (!selectedAlumni || !mentorshipMessage.trim()) return;

    const studentProfile = getStudentProfileByUserId(user.id);
    
    const request: MentorshipRequest = {
      id: `mentorship-${Date.now()}`,
      studentId: user.id,
      studentName: studentProfile?.name || user.email,
      studentEmail: user.email,
      alumniId: selectedAlumni.id,
      alumniName: selectedAlumni.name,
      message: mentorshipMessage,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    saveMentorshipRequest(request);
    
    setShowRequestModal(false);
    setSelectedAlumni(null);
    setMentorshipMessage('');
    
    // Show success message (in a real app, you'd use a toast notification)
    alert('Mentorship request sent successfully!');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Alumni Directory</h2>
            <p className="text-gray-600 mt-1">Connect with {alumniProfiles.length} alumni from your college</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search alumni..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
              />
            </div>
            
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Years</option>
              {uniqueYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Branches</option>
              {uniqueBranches.map(branch => (
                <option key={branch} value={branch}>{branch}</option>
              ))}
            </select>
            
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showMentorsOnly}
                onChange={(e) => setShowMentorsOnly(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Mentors only</span>
            </label>
          </div>
        </div>

        <div className="text-sm text-gray-600 mb-4">
          Showing {filteredProfiles.length} of {alumniProfiles.length} alumni
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProfiles.map((profile) => (
            <div key={profile.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center mb-3">
                    <span className="text-white font-medium">
                      {profile.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 text-lg">{profile.name}</h3>
                  <p className="text-gray-600 text-sm">{profile.email}</p>
                </div>
                {profile.isAvailableAsMentor && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    Available Mentor
                  </span>
                )}
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Building className="h-4 w-4 mr-2 text-gray-400" />
                  {profile.company}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                  Class of {profile.year} • {profile.branch}
                </div>
              </div>

              {profile.bio && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{profile.bio}</p>
              )}

              {profile.skills && profile.skills.length > 0 && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {profile.skills.slice(0, 3).map((skill, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        {skill}
                      </span>
                    ))}
                    {profile.skills.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        +{profile.skills.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  {profile.linkedinUrl && (
                    <a
                      href={profile.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors duration-200"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
                
                {profile.isAvailableAsMentor && (
                  <button
                    onClick={() => handleRequestMentorship(profile)}
                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center"
                  >
                    <MessageCircle className="h-4 w-4 mr-1" />
                    Request Mentorship
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredProfiles.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">No alumni found matching your criteria</p>
            <p className="text-sm text-gray-400">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Mentorship Request Modal */}
      {showRequestModal && selectedAlumni && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Request Mentorship from {selectedAlumni.name}
            </h3>
            
            <div className="mb-4">
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Introduce yourself and explain why you'd like their mentorship:
              </label>
              <textarea
                id="message"
                rows={4}
                value={mentorshipMessage}
                onChange={(e) => setMentorshipMessage(e.target.value)}
                placeholder="Hi, I'm a current student interested in..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowRequestModal(false);
                  setSelectedAlumni(null);
                  setMentorshipMessage('');
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={submitMentorshipRequest}
                disabled={!mentorshipMessage.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};