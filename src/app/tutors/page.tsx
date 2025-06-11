'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Tutor } from '@/types';
import BookingModal from '@/components/BookingModal';
import ContactModal from '@/components/ContactModal';

export default function TutorsPage() {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null);
  const [contactTutor, setContactTutor] = useState<Tutor | null>(null);

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const tutorsQuery = query(
          collection(db, 'users'),
          where('role', '==', 'tutor')
        );
        const querySnapshot = await getDocs(tutorsQuery);
        const tutorsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Tutor[];
        setTutors(tutorsData);
      } catch (error) {
        console.error('Error fetching tutors:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTutors();
  }, []);

  const filteredTutors = tutors.filter(tutor => {
    const matchesSearch = tutor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tutor.subjects.some(subject => subject.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSubject = !selectedSubject || tutor.subjects.includes(selectedSubject);
    const matchesCity = !selectedCity || tutor.city === selectedCity;
    return matchesSearch && matchesSubject && matchesCity;
  });

  const subjects = Array.from(new Set(tutors.flatMap(tutor => tutor.subjects)));
  const cities = Array.from(new Set(tutors.map(tutor => tutor.city)));

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-primary mb-6 text-center tracking-tight">Find a Tutor</h1>
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
          {/* Search */}
          <div className="relative w-full md:w-1/3">
            <input
              type="text"
              placeholder="Search by name or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full border border-blue-200 bg-blue-50 focus:ring-2 focus:ring-primary focus:border-primary transition text-gray-800 placeholder-gray-400 shadow-sm"
            />
            <span className="absolute left-3 top-2.5 text-primary">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
            </span>
          </div>
          {/* Subject Select */}
          <div className="relative w-full md:w-1/4">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full border border-blue-200 bg-blue-50 focus:ring-2 focus:ring-primary focus:border-primary transition text-gray-800 shadow-sm appearance-none"
            >
              <option value="">All Subjects</option>
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
            <span className="absolute left-3 top-2.5 text-primary">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" /></svg>
            </span>
          </div>
          {/* City Select */}
          <div className="relative w-full md:w-1/4">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full border border-blue-200 bg-blue-50 focus:ring-2 focus:ring-primary focus:border-primary transition text-gray-800 shadow-sm appearance-none"
            >
              <option value="">All Cities</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
            <span className="absolute left-3 top-2.5 text-primary">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" /></svg>
            </span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredTutors.map(tutor => (
          <div
            key={tutor.id}
            className="flex flex-col justify-between bg-white rounded-2xl shadow-card border border-primary/40 hover:shadow-lg hover:border-primary transition group relative overflow-hidden p-6 min-h-[340px]"
          >
            {/* Header */}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center text-primary font-bold text-2xl shadow-card">
                {tutor.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-primary mb-1 capitalize">{tutor.name}</h2>
                <p className="text-gray-500 text-base font-medium">{tutor.city}</p>
              </div>
            </div>
            {/* Subjects */}
            <div className="mb-4">
              <h3 className="font-semibold text-gray-700 mb-2">Subjects:</h3>
              <div className="flex flex-wrap gap-2">
                {tutor.subjects.map(subject => (
                  <span
                    key={subject}
                    className="bg-primary/10 text-primary font-semibold text-sm px-4 py-1 rounded-full"
                  >
                    {subject}
                  </span>
                ))}
              </div>
            </div>
            {/* Price & Actions */}
            <div className="mt-auto flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <span className="text-primary font-extrabold text-xl">${tutor.hourlyRate}/hour</span>
              </div>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setSelectedTutor(tutor)}
                  className="flex-1 bg-primary text-white font-bold py-2 rounded-full text-base shadow-sm hover:bg-primary-dark transition"
                >
                  Book Now
                </button>
                <button
                  onClick={() => setContactTutor(tutor)}
                  className="flex-1 bg-accent text-white font-bold py-2 rounded-full text-base shadow-sm hover:bg-primary-dark transition"
                >
                  Contact
                </button>
              </div>
            </div>
            <div className="absolute inset-0 pointer-events-none rounded-2xl group-hover:ring-4 group-hover:ring-primary/10 transition"></div>
          </div>
        ))}
      </div>
      {filteredTutors.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">No tutors found matching your criteria.</p>
        </div>
      )}
      {selectedTutor && (
        <BookingModal
          tutor={selectedTutor}
          isOpen={!!selectedTutor}
          onClose={() => setSelectedTutor(null)}
        />
      )}
      {contactTutor && (
        <ContactModal
          tutor={contactTutor}
          isOpen={!!contactTutor}
          onClose={() => setContactTutor(null)}
        />
      )}
    </div>
  );
} 