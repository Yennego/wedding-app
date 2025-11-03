/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
    "./styles/**/*.{css}",
  ],
  theme: {
    extend: {
      colors: {
        // Wedding palette
        primary: "#8B6F47",     // elegant warm gold-brown for headings/buttons
        accent: "#ffffff",      // white accents
        cream: "#FAF7F2",       // soft cream backgrounds

        // Keep these to preserve existing class usage like bg-background/text-foreground
        background: "#FAF7F2",
        foreground: "#111827",
        border: "#E5E7EB",
      },
    },
  },
  plugins: [],
};