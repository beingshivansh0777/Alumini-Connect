export interface User {
  id: string;
  email: string;
  role: 'alumni' | 'student' | 'admin';
  createdAt: string;
}

export interface AlumniProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  year: number;
  branch: string;
  company: string;
  linkedinUrl: string;
  isApproved: boolean;
  isAvailableAsMentor: boolean;
  profileImage?: string;
  bio?: string;
  skills?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  imageUrl?: string;
  maxAttendees?: number;
  createdBy: string;
  createdAt: string;
  rsvpList: string[];
}

export interface MentorshipRequest {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  alumniId: string;
  alumniName: string;
  message: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface Donation {
  id: string;
  donorId: string;
  donorName: string;
  donorEmail: string;
  amount: number;
  message?: string;
  paymentId: string;
  createdAt: string;
}

export interface StudentProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  year: number;
  branch: string;
  rollNumber: string;
  interests?: string[];
  createdAt: string;
}