const defaultTheme = require("tailwindcss/defaultTheme");
const windmill = require("@windmill/react-ui/config");

module.exports = windmill({
  purge: ["src/**/*.js"],
  theme: {
    extend: {
      colors: {
        red: { 500: "#DC2626" },
        orange: { 500: "#FF7605" },
      },
      height: {
        100: "25rem",
        104: "26rem",
        120: "30rem",
        128: "32rem",
        140: "35rem",
      },
      keyframes: {
        "wiggle-light": {
          "0%, 100%": {
            transform: "rotate(-2deg)",
          },
          "50%": {
            transform: "rotate(2deg)",
          },
        },
        "wiggle-med": {
          "0%, 100%": {
            transform: "rotate(-16deg)",
          },
          "50%": {
            transform: "rotate(16deg)",
          },
        },
        "gradient-y": {
          "0%, 100%": {
            "background-size": "400% 400%",
            "background-position": "center top",
          },
          "50%": {
            "background-size": "200% 200%",
            "background-position": "center center",
          },
        },
        "gradient-x": {
          "0%, 100%": {
            "background-size": "200% 200%",
            "background-position": "left center",
          },
          "50%": {
            "background-size": "1000% 200%",
            "background-position": "right center",
          },
        },
        "gradient-xy": {
          "0%, 100%": {
            "background-size": "400% 400%",
            "background-position": "left center",
          },
          "50%": {
            "background-size": "200% 200%",
            "background-position": "right center",
          },
        },
      },
      animation: {
        "wiggle-light": "wiggle-light 1s ease-in-out infinite",
        "wiggle-med": "wiggle-med 1s ease-in-out infinite",
        "wiggle-crack": "wiggle-light .1s ease-in-out infinite",
        "gradient-x-slow": "gradient-x 15s ease infinite",
        "gradient-y-slow": "gradient-y 15s ease infinite",
        "gradient-xy-slow": "gradient-xy 15s ease infinite",
        "gradient-x-fast": "gradient-x 5s ease infinite",
        "gradient-y-fast": "gradient-y 5s ease infinite",
        "gradient-xy-fast": "gradient-xy 1s ease infinite",
        "gradient-x-superfast": "gradient-x 1s ease infinite",
        "gradient-y-superfast": "gradient-y 1s ease infinite",
        "gradient-xy-superfast": "gradient-xy 1s ease infinite",
      },
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
      },
      boxShadow: {
        bottom:
          "0 5px 6px -7px rgba(0, 0, 0, 0.6), 0 2px 4px -5px rgba(0, 0, 0, 0.06)",
      },
      scale: {
        98: ".98",
        101: "1.01",
      },
      backgroundColor: ["checked"],
      borderColor: ["checked"],
    },
  },
  plugins: [require("tailwindcss-textshadow")],
});
