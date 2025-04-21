// tailwind.config.js
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  safelist: [
    'bg-red-500',  // Add any classes you want to keep in production
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
