export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'tutor';
  createdAt: Date;
}

export interface Tutor extends User {
  subjects: string[];
  experience: number;
  hourlyRate: number;
  city: string;
  bio: string;
  availability: {
    [key: string]: {
      start: string;
      end: string;
    }[];
  };
}

export interface Student extends User {
  subjects: string[];
  grade: string;
  preferredLanguage: string;
}

export interface Booking {
  id: string;
  tutorId: string;
  studentId: string;
  subject: string;
  date: Date;
  startTime: string;
  endTime: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: Date;
} 