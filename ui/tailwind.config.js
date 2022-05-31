const config = {
  content: ["index.html", "./src/**/*.{css,ts,tsx}",],

  theme: {
    extend: {
      colors: {
        dark: "#1e2227"
      },
      keyframes: {
        rotateone: {
          '0%': {
            transform: 'rotateX(35deg) rotateY(-45deg) rotateZ(0deg)'
          },
          '100%': {
            transform: 'rotateX(35deg) rotateY(-45deg) rotateZ(360deg)'
          }
        },
        rotatetwo: {
          "0%": {
            transform: 'rotateX(50deg) rotateY(10deg) rotateZ(0deg)'
          },
          '100%': {
            transform: 'rotateX(50deg) rotateY(10deg) rotateZ(360deg)'
          },
        },
        rotatethree: {
          "0%": {
            transform: 'rotateX(35deg) rotateY(55deg) rotateZ(0deg)'
          },
          '100%': {
            transform: 'rotateX(35deg) rotateY(55deg) rotateZ(360deg)'
          },
        },
      },
      animation: {
        'loadingone': 'rotateone 1s linear infinite',
        'loadingtwo': 'rotatetwo 1s linear infinite',
        'loadingthree': 'rotatethree 1s linear infinite',
      },
    },
  },

  plugins: [],
};

module.exports = config;
