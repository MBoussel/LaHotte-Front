/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        christmas: {
          red: '#c41e3a',
          green: '#165b33',
          gold: '#ffd700',
        }
      }
    },
  },
  plugins: [],
}