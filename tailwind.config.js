module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
        ],
      },
      colors: {
        primary: {
          DEFAULT: '#2563eb', // blue-600
          light: '#3b82f6',  // blue-500
          dark: '#1e40af',   // blue-800
        },
        accent: '#f59e42', // custom accent color
      },
      borderRadius: {
        xl: '1.25rem',
      },
      boxShadow: {
        card: '0 4px 24px 0 rgba(37, 99, 235, 0.08)',
      },
    },
  },
  plugins: [],
}; 