/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['DM Serif Display', 'Georgia', 'serif'],
      },
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a5a',
        },
        plum: {
          DEFAULT: '#2d1b4e',
          light: '#4a2d75',
          50: '#f5f0ff',
          100: '#ede5ff',
          200: '#d4c4ff',
        },
        sky: {
          DEFAULT: '#5cc8f0',
          hover: '#3eb8e8',
        },
        warm: {
          DEFAULT: '#f5ebe0',
          light: '#faf5ef',
        },
        brand: {
          orange: '#e8762b',
          green: '#1a8a5c',
          red: '#e84545',
          gold: '#d88c1a',
        },
      },
      borderRadius: {
        'pill': '100px',
        'card': '20px',
      },
      maxWidth: {
        'container': '1200px',
        'container-sm': '900px',
        'container-md': '700px',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
