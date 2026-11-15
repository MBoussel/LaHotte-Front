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
          red: '#7b3438',
          green: '#214638',
          gold: '#b69a68',
        }
      },
    },
  },
  plugins: [],
}
