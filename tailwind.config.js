/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "sans-serif"], // Nome da fonte global
      },
      colors: {
        primary: "#520C87", // Roxo mais escuro
        secondary: "#DBCAFD", // Roxo claro
        tertiary: "#AF49FC", // Roxo do "esqueceu a senha"
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
