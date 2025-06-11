# TutorLink - Local Tutor Discovery and Booking Web App

TutorLink is a web application that connects students with local tutors, making it easy to find and book tutoring sessions. Built with Next.js, TypeScript, and Firebase.

## Features

- User authentication (students and tutors)
- Tutor profile creation and management
- Search and filter tutors by subject, location, and availability
- Booking system for tutoring sessions
- Responsive design for all devices
- Real-time updates using Firebase

## Tech Stack

- **Frontend:**
  - Next.js 14
  - TypeScript
  - TailwindCSS
  - React Hook Form
  - Headless UI

- **Backend:**
  - Firebase Authentication
  - Firebase Firestore
  - Firebase Hosting

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Firebase account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/tutorlink.git
   cd tutorlink
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a Firebase project and enable Authentication and Firestore.

4. Create a `.env.local` file in the root directory with your Firebase configuration:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                 # Next.js app directory
│   ├── api/            # API routes
│   ├── dashboard/      # Dashboard page
│   ├── login/          # Login page
│   ├── signup/         # Signup page
│   └── tutors/         # Tutors listing page
├── components/         # Reusable components
├── hooks/             # Custom React hooks
├── lib/               # Firebase configuration
├── types/             # TypeScript type definitions
└── utils/             # Utility functions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Next.js team for the amazing framework
- Firebase team for the backend services
- TailwindCSS team for the utility-first CSS framework 