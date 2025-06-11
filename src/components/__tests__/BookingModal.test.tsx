import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import BookingModal from '../BookingModal';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
}));

jest.mock('@/lib/firebase', () => ({
  auth: {},
  db: {},
}));

jest.mock('firebase/auth', () => ({
  onAuthStateChanged: jest.fn(),
}));

const tutor = {
  id: '1',
  name: 'Test Tutor',
  city: 'Test City',
  subjects: ['Math'],
  hourlyRate: 20,
};

describe('BookingModal', () => {
  it('renders and can be closed', () => {
    const onClose = jest.fn();
    render(<BookingModal tutor={tutor as any} isOpen={true} onClose={onClose} />);
    expect(screen.getByText(/Book a Session with/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText(/Cancel/i));
    expect(onClose).toHaveBeenCalled();
  });
}); 