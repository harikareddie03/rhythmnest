/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enables dark mode using a CSS class
  theme: {
    extend: {
      colors: {
        darkBackground: '#121212',
        darkText: '#e0e0e0',
      },
    },
  },
  plugins: [],
}


