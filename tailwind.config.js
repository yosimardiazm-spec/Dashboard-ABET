/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        sabana: {
          900: '#002147',
          800: '#003B5C',
          700: '#004d7a',
          600: '#006096',
          100: '#e8f0f7',
          50:  '#f0f5fa',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
