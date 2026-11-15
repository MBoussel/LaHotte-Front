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
          red: '#b9273b',
          green: '#174b36',
          gold: '#e4b957',
          cream: '#fffaf1',
        }
      },
    },
  },
  plugins: [],
}
