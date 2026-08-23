/** @type {import('tailwindcss').Config} */
module.exports = {
  // Scan all files in the src directory for Tailwind classes
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./App.{js,jsx,ts,tsx}"
  ],
  // NativeWind v4 requires this preset
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      // You can inject custom Frappe/ERPNext brand colors here later
      colors: {
        primary: '#171717',
        accent: '#2563EB',
      }
    },
  },
  plugins: [],
}