'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Tutor } from '@/types';

interface ContactModalProps {
  tutor: Tutor;
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ tutor, isOpen, onClose }: ContactModalProps) {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const router = useRouter();

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    if (!user) {
      router.push('/login');
      return;
    }
    try {
      // Optionally store in Firestore as a contact request
      await addDoc(collection(db, 'contactRequests'), {
        tutorId: tutor.id,
        studentId: user.uid,
        message,
        createdAt: new Date().toISOString(),
      });
      setSent(true);
    } catch (err) {
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-card border border-blue-100">
        <h2 className="text-2xl font-bold mb-4 text-primary">Contact {tutor.name}</h2>
        {sent ? (
          <div className="text-center py-8">
            <p className="text-primary text-lg font-semibold mb-2">Message sent!</p>
            <button
              onClick={onClose}
              className="mt-4 px-6 py-2 bg-primary text-white rounded-full font-semibold hover:bg-primary-dark transition"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSend} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Your Message</label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                required
                rows={4}
                className="mt-1 block w-full rounded-xl border border-blue-200 bg-blue-50 shadow-sm focus:ring-2 focus:ring-primary focus:border-primary p-3 text-gray-800"
                placeholder="Hi, I am interested in your tutoring services..."
              />
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-semibold text-white bg-primary rounded-full hover:bg-primary-dark transition disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
} 