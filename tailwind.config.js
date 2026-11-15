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
          red: '#a33f43',
          green: '#214638',
          gold: '#c5a66e',
          cream: '#fbf8f0',
          pine: '#193d31',
        }
      },
    },
  },
  plugins: [],
}
