'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Tutor, Student, Booking } from '@/types';

export default function Dashboard() {
  const [userData, setUserData] = useState<Tutor | Student | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      try {
        // Get user profile
        const userDoc = await getDocs(query(collection(db, 'users'), where('id', '==', user.uid)));
        if (!userDoc.empty) {
          setUserData(userDoc.docs[0].data() as Tutor | Student);
        }
        // Get bookings
        const bookingsQuery = query(
          collection(db, 'bookings'),
          where(userData?.role === 'tutor' ? 'tutorId' : 'studentId', '==', user.uid)
        );
        const bookingsSnapshot = await getDocs(bookingsQuery);
        const bookingsData = bookingsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Booking[];
        setBookings(bookingsData);
        // Get contacts
        const contactsQuery = query(
          collection(db, 'contactRequests'),
          where(userData?.role === 'tutor' ? 'tutorId' : 'studentId', '==', user.uid)
        );
        const contactsSnapshot = await getDocs(contactsQuery);
        setContacts(contactsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [user, userData?.role]);

  if (loading || authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Loading user data...</p>
      </div>
    );
  }

  // Helper: get unique users/tutors from bookings/contacts
  const uniqueIds = (arr: any[], key: string) => Array.from(new Set(arr.map(item => item[key])));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary">
          Welcome, {userData.name}!
        </h1>
        <p className="text-gray-600 mt-2">
          {userData.role === 'tutor' ? 'Tutor' : 'Student'} Dashboard
        </p>
      </div>

      {/* Profile Section */}
      <div className="bg-white rounded-xl shadow-card p-6 mb-8 border border-blue-100">
        <h2 className="text-xl font-semibold mb-4 text-primary">Profile Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Email</p>
            <p className="font-medium">{userData.email}</p>
          </div>
          <div>
            <p className="text-gray-600">Role</p>
            <p className="font-medium capitalize">{userData.role}</p>
          </div>
          {userData.role === 'tutor' && (
            <>
              <div>
                <p className="text-gray-600">Hourly Rate</p>
                <p className="font-medium">${(userData as Tutor).hourlyRate}/hour</p>
              </div>
              <div>
                <p className="text-gray-600">City</p>
                <p className="font-medium">{(userData as Tutor).city}</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Bookings Section */}
      <div className="bg-white rounded-xl shadow-card p-6 mb-8 border border-blue-100">
        <h2 className="text-xl font-semibold mb-4 text-primary">
          {userData.role === 'tutor' ? 'Your Sessions' : 'Your Bookings'}
        </h2>
        {bookings.length === 0 ? (
          <p className="text-gray-600">No bookings found.</p>
        ) : (
          <div className="space-y-4">
            {bookings.map(booking => (
              <div
                key={booking.id}
                className="border rounded-lg p-4 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">
                    {userData.role === 'tutor' ? 'Student' : 'Tutor'} Session
                  </p>
                  <p className="text-gray-600">
                    {new Date(booking.date).toLocaleDateString()} at {booking.startTime}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    booking.status === 'confirmed'
                      ? 'bg-green-100 text-green-800'
                      : booking.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {booking.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Contacts/Summary Section */}
      <div className="bg-white rounded-xl shadow-card p-6 border border-blue-100">
        <h2 className="text-xl font-semibold mb-4 text-primary">
          {userData.role === 'tutor' ? 'Students Who Contacted/Booked You' : 'Tutors You Contacted/Booked'}
        </h2>
        {userData.role === 'tutor' ? (
          uniqueIds([...bookings, ...contacts], 'studentId').length === 0 ? (
            <p className="text-gray-600">No students have contacted or booked you yet.</p>
          ) : (
            <ul className="space-y-2">
              {uniqueIds([...bookings, ...contacts], 'studentId').map((studentId) => (
                <li key={studentId} className="text-gray-800 font-medium bg-blue-50 rounded-lg px-4 py-2">
                  Student ID: {studentId}
                </li>
              ))}
            </ul>
          )
        ) : (
          uniqueIds([...bookings, ...contacts], 'tutorId').length === 0 ? (
            <p className="text-gray-600">You have not contacted or booked any tutors yet.</p>
          ) : (
            <ul className="space-y-2">
              {uniqueIds([...bookings, ...contacts], 'tutorId').map((tutorId) => (
                <li key={tutorId} className="text-gray-800 font-medium bg-blue-50 rounded-lg px-4 py-2">
                  Tutor ID: {tutorId}
                </li>
              ))}
            </ul>
          )
        )}
      </div>
    </div>
  );
} 