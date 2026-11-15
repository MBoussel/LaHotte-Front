/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          50: '#fbf8f0', 100: '#f5f0e6', 200: '#e9e2d5', 300: '#d7d0c2',
          400: '#b7b4a8', 500: '#8d9185', 600: '#6d766b', 700: '#515e53',
          800: '#39483d', 900: '#26372d',
        },
        slate: {
          50: '#fbfaf6', 100: '#f3f0e8', 200: '#e6e1d6', 300: '#d0cabe',
          400: '#aaa99e', 500: '#85877d', 600: '#687267', 700: '#4b594e',
          800: '#35453a', 900: '#24352b',
        },
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
