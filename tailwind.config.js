/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./*.html', './js/*.js'],
  theme: {
    extend: {
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
        barlow: ['Barlow', 'Roboto', 'sans-serif']
      },
    },
  },
  plugins: [],
}
