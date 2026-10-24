/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        coffee: {
          dark: '#2A1C15',
          medium: '#4A372E',
        },
        cream: '#F8F1E9',
        gold: {
          accent: '#B89778',
          hover: '#D4B99F',
        },
      },
      fontFamily: {
        heading: ['Playfair Display', 'serif'],
        body: ['Nunito Sans', 'Lato', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
