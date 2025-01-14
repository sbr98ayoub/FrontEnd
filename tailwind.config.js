/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        blue: {
          50: "#EBF8FF",
          100: "#D1EEFC",
          600: "#3182CE",
        },
        indigo: {
          50: "#EEF2FF",
          100: "#E0E7FF",
          600: "#5A67D8",
        },
        green: {
          50: "#F0FFF4",
          100: "#C6F6D5",
          600: "#38A169",
        },
      },
    },
  },
  plugins: [],
};
