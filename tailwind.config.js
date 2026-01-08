/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        elegant: {
          white: '#ffffff',
          'off-white': '#fafafa',
          'light-gray': '#f5f5f5',
          gray: '#e5e5e5',
          'medium-gray': '#d4d4d4',
          'dark-gray': '#737373',
          charcoal: '#404040',
          'dark-charcoal': '#262626',
          black: '#171717',
          accent: '#0ea5e9',
          'accent-light': '#38bdf8',
          'accent-dark': '#0284c7',
          teal: '#14b8a6',
          'teal-light': '#5eead4',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'elegant': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'elegant-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'elegant-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'accent': '0 4px 14px 0 rgba(14, 165, 233, 0.15)',
      },
    },
  },
  plugins: [],
}

