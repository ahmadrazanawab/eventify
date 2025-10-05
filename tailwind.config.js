/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // class-based dark mode (we won’t use dark yet)
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light"], // light theme only
  },
};
