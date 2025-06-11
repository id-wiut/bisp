'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

function getInitials(name: string | undefined | null) {
  if (!name) return '';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-30 bg-white/90 backdrop-blur shadow-card border-b border-blue-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-extrabold text-primary tracking-tight font-sans">
            TutorLink
          </Link>

          <div className="flex items-center space-x-2 md:space-x-4">
            <Link href="/tutors" className="text-gray-600 hover:text-primary font-medium px-3 py-2 rounded-xl transition">
              Find Tutors
            </Link>
            {user ? (
              <>
                <Link href="/dashboard" className="text-gray-600 hover:text-primary font-medium px-3 py-2 rounded-xl transition focus:ring-2 focus:ring-primary focus:outline-none">
                  Dashboard
                </Link>
                <button
                  onClick={() => logout()}
                  aria-label="Logout"
                  className="bg-primary text-white px-4 py-2 rounded-xl font-semibold hover:bg-primary-dark transition shadow-sm focus:ring-2 focus:ring-primary focus:outline-none"
                >
                  Logout
                </button>
                <div className="ml-2 flex items-center">
                  <div className="w-9 h-9 rounded-full bg-primary-light flex items-center justify-center text-primary-dark font-bold text-lg shadow-card">
                    {getInitials(user.displayName || user.email)}
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-600 hover:text-primary font-medium px-3 py-2 rounded-xl transition focus:ring-2 focus:ring-primary focus:outline-none">
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="bg-primary text-white px-4 py-2 rounded-xl font-semibold hover:bg-primary-dark transition shadow-sm focus:ring-2 focus:ring-primary focus:outline-none"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 