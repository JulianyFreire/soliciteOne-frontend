/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "sans-serif"], 
      },
      colors: {
        primary: "#1E3A8A",      
        secondary: "#90CAF9",    

        background: "#F5F6F8",   
        surface: "#FFFFFF",      
   
        inputText: "#1F2937",
        inputPlaceholder: "#9CA3AF",
        borderColor: "#C8CBD0",
        InputBorder: "#C8CBD0",
        inputBg: "#FFFFFF",
        success: "#059669",
        error: "#DC2626",
      },
      fontWeight: {
        thin: 100,
        extralight: 200,
        light: 300,
        regular: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
        extrabold: 800,
        black: 900,
      },
    },
  },
  plugins: [],
};