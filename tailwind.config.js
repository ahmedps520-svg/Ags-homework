/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      // AGS brand palette (mirrors BRAND in src/App.jsx) so opacity and ring variants work.
      colors: {
        ags: {
          indigo: '#2C2A73', navy: '#201F3C', gold: '#F3C52D', 'gold-dark': '#DCAB0B', slate: '#4A4966', bg: '#F7F7FB',
          'indigo-50': '#EEEDF8', 'indigo-100': '#DFDDF2', 'gold-50': '#FEF8E1', 'gold-100': '#FCEFB8',
        },
      },
    },
  },
  plugins: [],
};
