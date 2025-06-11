'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';

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
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-30 bg-white/90 backdrop-blur shadow-card border-b border-blue-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-extrabold text-primary tracking-tight font-sans">
            TutorLink
          </Link>

          {/* Hamburger for mobile */}
          <button
            className="md:hidden flex items-center px-3 py-2 rounded-xl text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center space-x-2 md:space-x-4">
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
        {/* Mobile dropdown menu */}
        {menuOpen && (
          <div className="md:hidden flex flex-col space-y-2 py-4 animate-fade-in">
            <Link href="/tutors" className="text-gray-600 hover:text-primary font-medium px-3 py-2 rounded-xl transition" onClick={() => setMenuOpen(false)}>
              Find Tutors
            </Link>
            {user ? (
              <>
                <Link href="/dashboard" className="text-gray-600 hover:text-primary font-medium px-3 py-2 rounded-xl transition focus:ring-2 focus:ring-primary focus:outline-none" onClick={() => setMenuOpen(false)}>
                  Dashboard
                </Link>
                <button
                  onClick={() => { logout(); setMenuOpen(false); }}
                  aria-label="Logout"
                  className="bg-primary text-white px-4 py-2 rounded-xl font-semibold hover:bg-primary-dark transition shadow-sm focus:ring-2 focus:ring-primary focus:outline-none"
                >
                  Logout
                </button>
                <div className="flex items-center mt-2">
                  <div className="w-9 h-9 rounded-full bg-primary-light flex items-center justify-center text-primary-dark font-bold text-lg shadow-card">
                    {getInitials(user.displayName || user.email)}
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-600 hover:text-primary font-medium px-3 py-2 rounded-xl transition focus:ring-2 focus:ring-primary focus:outline-none" onClick={() => setMenuOpen(false)}>
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="bg-primary text-white px-4 py-2 rounded-xl font-semibold hover:bg-primary-dark transition shadow-sm focus:ring-2 focus:ring-primary focus:outline-none"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
} 