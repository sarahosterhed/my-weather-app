/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./*.html', './js/*.js'],
  theme: {
    extend: {
      fontFamily: {
        barlow: ['Barlow', 'Roboto', 'sans-serif']
      },
    },
  },
  plugins: [],
}
