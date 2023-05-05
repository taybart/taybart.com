/** @type {import('tailwindcss').Config} */
module.exports = {
  content: {
    files: ['*.html', './src/**/*.css', './src/**/*.rs'],
  },
  theme: {
    extend: {
      colors: {
        dark: '#1e2227',
      },
    },
  },
  plugins: [],
}
