// tailwind.config.js
module.exports = {
  darkMode: 'class', // Use class-based dark mode
  content: [
    "./app/**/*.{js,ts,jsx,tsx}", // Adjust to your project structure
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
