/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
      },
      colors: {
        hygge: {
          bg: {
            light: '#eff0f0',
            dark: '#1a1a1a'
          },
          primary: {
            light: '#6B5B95',
            dark: '#9B8BB4'
          },
          secondary: {
            light: '#9B8BB4',
            dark: '#B3A5CC'
          },
          accent: {
            light: '#E6E6FA',
            dark: '#4B4B6D'
          },
          warm: {
            light: '#FEF6E4',
            dark: '#2D2A24'
          },
          cool: {
            light: '#E8F0F7',
            dark: '#1E2A35'
          }
        }
      },
      borderRadius: {
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
};