/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        eco: {
          light: '#EAF3DE',
          DEFAULT: '#3B6D11',
          dark: '#27500A',
          border: '#C0DD97',
          bg: '#F0F2F0',
          card: '#F2F7EC'
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      }
    },
  },
  plugins: [],
}