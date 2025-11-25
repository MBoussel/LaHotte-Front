import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './index.html',
   './src/**/*.{ts,tsx,js,jsx}',
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
export default config;