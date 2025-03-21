/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite-react/**/*.js", // Add Flowbite React components
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require("flowbite/plugin"), // Use the Flowbite plugin
  ],
};
