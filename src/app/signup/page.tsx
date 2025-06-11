'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { collection, addDoc, setDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'student' | 'tutor'>('student');
  const [subjects, setSubjects] = useState<string[]>([]);
  const [city, setCity] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const userCredential = await signup(email, password);
      if (!userCredential || !userCredential.user) {
        setError('Authentication failed. Please try again.');
        setLoading(false);
        return;
      }
      const user = userCredential.user;
      const userData = {
        id: user.uid,
        name,
        email,
        role,
        createdAt: new Date().toISOString(),
        ...(role === 'tutor' && {
          subjects: subjects,
          city,
          hourlyRate: hourlyRate ? parseFloat(hourlyRate) : 0,
        }),
      };
      await setDoc(doc(db, 'users', user.uid), userData);
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Signup error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already in use.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters.');
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Failed to create an account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-transparent px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white/90 rounded-xl shadow-card p-8 border border-blue-100">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-primary">Create your account</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link href="/login" className="font-medium text-primary hover:text-primary-light transition">
              sign in to your account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4 border border-red-200 animate-pulse">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}
          <div className="rounded-md shadow-sm space-y-4">
            <div className="relative">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full pl-10 pr-4 py-2 border border-blue-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm bg-blue-50 placeholder-gray-400 text-gray-800"
                placeholder="Jane Doe"
              />
              <span className="absolute left-3 top-9 text-primary">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </span>
            </div>
            <div className="relative">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full pl-10 pr-4 py-2 border border-blue-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm bg-blue-50 placeholder-gray-400 text-gray-800"
                placeholder="you@email.com"
              />
              <span className="absolute left-3 top-9 text-primary">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 4H8a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </span>
            </div>
            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full pl-10 pr-10 py-2 border border-blue-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm bg-blue-50 placeholder-gray-400 text-gray-800"
                placeholder="••••••••"
              />
              <span className="absolute left-3 top-9 text-primary">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 17a5 5 0 0 1-5-5V9a5 5 0 0 1 10 0v3a5 5 0 0 1-5 5z"/></svg>
              </span>
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-8 text-primary hover:text-primary-dark focus:outline-none"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-5.05 0-9.29-3.16-10.94-7.5a10.97 10.97 0 0 1-1.66-2.88M6.1 6.1A10.94 10.94 0 0 1 12 5c5.05 0 9.29 3.16 10.94 7.5a10.97 10.97 0 0 1-1.66 2.88M1 1l22 22"/></svg>
                ) : (
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12C1 12 5 5 12 5s11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>
                )}
              </button>
            </div>
            <div className="relative">
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">I am a</label>
              <select
                id="role"
                name="role"
                required
                value={role}
                onChange={(e) => setRole(e.target.value as 'student' | 'tutor')}
                className="mt-1 block w-full pl-10 pr-4 py-2 border border-blue-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm bg-blue-50 text-gray-800 appearance-none"
              >
                <option value="student">Student</option>
                <option value="tutor">Tutor</option>
              </select>
              <span className="absolute left-3 top-9 text-primary">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7"/></svg>
              </span>
            </div>
            {role === 'tutor' && (
              <>
                <div className="relative">
                  <label htmlFor="subjects" className="block text-sm font-medium text-gray-700">Subjects (comma-separated)</label>
                  <input
                    id="subjects"
                    name="subjects"
                    type="text"
                    required
                    value={subjects.join(', ')}
                    onChange={(e) => setSubjects(e.target.value.split(',').map(s => s.trim()))}
                    className="mt-1 block w-full pl-10 pr-4 py-2 border border-blue-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm bg-blue-50 placeholder-gray-400 text-gray-800"
                    placeholder="e.g., Mathematics, Physics, Chemistry"
                  />
                  <span className="absolute left-3 top-9 text-primary">
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20z"/></svg>
                  </span>
                </div>
                <div className="relative">
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="mt-1 block w-full pl-10 pr-4 py-2 border border-blue-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm bg-blue-50 placeholder-gray-400 text-gray-800"
                    placeholder="e.g., New York"
                  />
                  <span className="absolute left-3 top-9 text-primary">
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>
                  </span>
                </div>
                <div className="relative">
                  <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-700">Hourly Rate ($)</label>
                  <input
                    id="hourlyRate"
                    name="hourlyRate"
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(e.target.value)}
                    className="mt-1 block w-full pl-10 pr-4 py-2 border border-blue-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm bg-blue-50 placeholder-gray-400 text-gray-800"
                    placeholder="e.g., 25"
                  />
                  <span className="absolute left-3 top-9 text-primary">
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 8v4l3 3"/><circle cx="12" cy="12" r="10"/></svg>
                  </span>
                </div>
              </>
            )}
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-semibold rounded-full text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 transition shadow-sm"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 