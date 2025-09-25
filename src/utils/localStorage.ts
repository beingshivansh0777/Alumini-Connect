import { AlumniProfile, Event, MentorshipRequest, Donation, User, StudentProfile } from '../types';

const STORAGE_KEYS = {
  USERS: 'alumni_portal_users',
  ALUMNI_PROFILES: 'alumni_portal_alumni_profiles',
  STUDENT_PROFILES: 'alumni_portal_student_profiles',
  EVENTS: 'alumni_portal_events',
  MENTORSHIP_REQUESTS: 'alumni_portal_mentorship_requests',
  DONATIONS: 'alumni_portal_donations',
  CURRENT_USER: 'alumni_portal_current_user',
};

// Generic localStorage operations
export const getFromStorage = <T>(key: string): T[] => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return [];
  }
};

export const saveToStorage = <T>(key: string, data: T[]): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

// User operations
export const saveUser = (user: User): void => {
  const users = getFromStorage<User>(STORAGE_KEYS.USERS);
  const existingUserIndex = users.findIndex(u => u.id === user.id);
  
  if (existingUserIndex >= 0) {
    users[existingUserIndex] = user;
  } else {
    users.push(user);
  }
  
  saveToStorage(STORAGE_KEYS.USERS, users);
};

export const getCurrentUser = (): User | null => {
  try {
    const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

export const setCurrentUser = (user: User | null): void => {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
};

// Alumni profile operations
export const saveAlumniProfile = (profile: AlumniProfile): void => {
  const profiles = getFromStorage<AlumniProfile>(STORAGE_KEYS.ALUMNI_PROFILES);
  const existingIndex = profiles.findIndex(p => p.id === profile.id);
  
  if (existingIndex >= 0) {
    profiles[existingIndex] = profile;
  } else {
    profiles.push(profile);
  }
  
  saveToStorage(STORAGE_KEYS.ALUMNI_PROFILES, profiles);
};

export const getAlumniProfiles = (): AlumniProfile[] => {
  return getFromStorage<AlumniProfile>(STORAGE_KEYS.ALUMNI_PROFILES);
};

export const getApprovedAlumniProfiles = (): AlumniProfile[] => {
  return getAlumniProfiles().filter(profile => profile.isApproved);
};

export const getAlumniProfileByUserId = (userId: string): AlumniProfile | null => {
  const profiles = getAlumniProfiles();
  return profiles.find(profile => profile.userId === userId) || null;
};

// Student profile operations
export const saveStudentProfile = (profile: StudentProfile): void => {
  const profiles = getFromStorage<StudentProfile>(STORAGE_KEYS.STUDENT_PROFILES);
  const existingIndex = profiles.findIndex(p => p.id === profile.id);
  
  if (existingIndex >= 0) {
    profiles[existingIndex] = profile;
  } else {
    profiles.push(profile);
  }
  
  saveToStorage(STORAGE_KEYS.STUDENT_PROFILES, profiles);
};

export const getStudentProfiles = (): StudentProfile[] => {
  return getFromStorage<StudentProfile>(STORAGE_KEYS.STUDENT_PROFILES);
};

export const getStudentProfileByUserId = (userId: string): StudentProfile | null => {
  const profiles = getStudentProfiles();
  return profiles.find(profile => profile.userId === userId) || null;
};

// Event operations
export const saveEvent = (event: Event): void => {
  const events = getFromStorage<Event>(STORAGE_KEYS.EVENTS);
  const existingIndex = events.findIndex(e => e.id === event.id);
  
  if (existingIndex >= 0) {
    events[existingIndex] = event;
  } else {
    events.push(event);
  }
  
  saveToStorage(STORAGE_KEYS.EVENTS, events);
};

export const getEvents = (): Event[] => {
  return getFromStorage<Event>(STORAGE_KEYS.EVENTS);
};

export const deleteEvent = (eventId: string): void => {
  const events = getEvents().filter(event => event.id !== eventId);
  saveToStorage(STORAGE_KEYS.EVENTS, events);
};

// Mentorship request operations
export const saveMentorshipRequest = (request: MentorshipRequest): void => {
  const requests = getFromStorage<MentorshipRequest>(STORAGE_KEYS.MENTORSHIP_REQUESTS);
  const existingIndex = requests.findIndex(r => r.id === request.id);
  
  if (existingIndex >= 0) {
    requests[existingIndex] = request;
  } else {
    requests.push(request);
  }
  
  saveToStorage(STORAGE_KEYS.MENTORSHIP_REQUESTS, requests);
};

export const getMentorshipRequests = (): MentorshipRequest[] => {
  return getFromStorage<MentorshipRequest>(STORAGE_KEYS.MENTORSHIP_REQUESTS);
};

// Donation operations
export const saveDonation = (donation: Donation): void => {
  const donations = getFromStorage<Donation>(STORAGE_KEYS.DONATIONS);
  donations.push(donation);
  saveToStorage(STORAGE_KEYS.DONATIONS, donations);
};

export const getDonations = (): Donation[] => {
  return getFromStorage<Donation>(STORAGE_KEYS.DONATIONS);
};

// Initialize sample data
export const initializeSampleData = (): void => {
  const existingUsers = getFromStorage<User>(STORAGE_KEYS.USERS);
  if (existingUsers.length === 0) {
    // Create sample users
    const sampleUsers: User[] = [
      {
        id: 'admin-1',
        email: 'admin@college.edu',
        role: 'admin',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'alumni-1',
        email: 'john.doe@gmail.com',
        role: 'alumni',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'student-1',
        email: 'jane.smith@student.edu',
        role: 'student',
        createdAt: new Date().toISOString(),
      },
    ];
    
    saveToStorage(STORAGE_KEYS.USERS, sampleUsers);

    // Create sample alumni profile
    const sampleAlumniProfile: AlumniProfile = {
      id: 'profile-1',
      userId: 'alumni-1',
      name: 'John Doe',
      email: 'john.doe@gmail.com',
      year: 2020,
      branch: 'Computer Science',
      company: 'Google Inc.',
      linkedinUrl: 'https://linkedin.com/in/johndoe',
      isApproved: true,
      isAvailableAsMentor: true,
      bio: 'Software Engineer at Google with 4+ years of experience in full-stack development.',
      skills: ['React', 'Node.js', 'Python', 'Machine Learning'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    saveAlumniProfile(sampleAlumniProfile);

    // Create sample student profile
    const sampleStudentProfile: StudentProfile = {
      id: 'student-profile-1',
      userId: 'student-1',
      name: 'Jane Smith',
      email: 'jane.smith@student.edu',
      year: 2024,
      branch: 'Computer Science',
      rollNumber: 'CS2024001',
      interests: ['Web Development', 'Data Science', 'AI/ML'],
      createdAt: new Date().toISOString(),
    };
    
    saveStudentProfile(sampleStudentProfile);

    // Create sample events
    const sampleEvents: Event[] = [
      {
        id: 'event-1',
        title: 'Tech Talk: Future of AI',
        description: 'Join us for an insightful discussion on the future of artificial intelligence.',
        date: '2025-02-15',
        time: '18:00',
        location: 'Auditorium A',
        maxAttendees: 100,
        createdBy: 'admin-1',
        createdAt: new Date().toISOString(),
        rsvpList: [],
      },
      {
        id: 'event-2',
        title: 'Alumni Networking Mixer',
        description: 'Connect with fellow alumni and current students in a casual networking environment.',
        date: '2025-02-28',
        time: '19:00',
        location: 'Student Center',
        maxAttendees: 150,
        createdBy: 'admin-1',
        createdAt: new Date().toISOString(),
        rsvpList: [],
      },
    ];
    
    saveToStorage(STORAGE_KEYS.EVENTS, sampleEvents);
  }
};