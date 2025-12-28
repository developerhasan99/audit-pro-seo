/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#f5f7ff',
          100: '#ebf0fe',
          200: '#ced9fd',
          300: '#b1c2fc',
          400: '#7695f9',
          500: '#3b67f6',
          600: '#355ddd',
          700: '#2c4eb9',
          800: '#233e94',
          900: '#1d3379',
        },
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}
