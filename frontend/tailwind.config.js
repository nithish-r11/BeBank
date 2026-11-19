/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bebank: {
          navy: '#173B73',
          navyDark: '#0F2952',
          navyLight: '#23539E',
          emerald: '#079669',
          emeraldDark: '#057A55',
          emeraldLight: '#10B981',
          surface: '#F4F7FB',
          white: '#FFFFFF',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 20px -2px rgba(23, 59, 115, 0.08)',
        'elevated': '0 12px 32px -4px rgba(23, 59, 115, 0.14)',
      },
    },
  },
  plugins: [],
};
