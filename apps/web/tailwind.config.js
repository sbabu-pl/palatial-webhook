/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}", // This covers everything inside src
    "./src/app/(admin)/**/*.{js,ts,jsx,tsx,mdx}", // Explicitly point to admin
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}