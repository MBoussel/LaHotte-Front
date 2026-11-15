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
          red: '#c3263b',
          green: '#174b36',
          gold: '#e7c36e',
          cream: '#fff8ef',
        }
      },
    },
  },
  plugins: [],
}
