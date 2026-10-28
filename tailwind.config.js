/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    // Escala tipográfica fija (px): 12 solo para números dentro de etiquetas pequeñas
    fontSize: {
      xs: ["12px", "16px"],
      sm: ["14px", "20px"],
      base: ["16px", "24px"],
      xl: ["20px", "28px"],
      "2xl": ["28px", "34px"],
      "3xl": ["40px", "44px"],
      hand: ["24px", "32px"], // solo para texto manuscrito (diario y post-its)
    },
    extend: {
      colors: {
        paper: "#FBF7F2",
        surface: "#FFFFFF",
        ink: "#2B2630",
        muted: "#6B6473",
        line: "#E8DFD6",
        accent: "#7B6BC9",
        "accent-dark": "#6657B3",
        urgent: "#B5433A",
        // Pasteles: solo como relleno, el texto encima siempre es "ink"
        pink: "#F4B6CC",
        lavender: "#CFC2F0",
        sage: "#B9D9B9",
        sky: "#B3D4F2",
        peach: "#F6CBA6",
        butter: "#F2E0A0",
        mint: "#A9DDD0",
        fog: "#D6D1DB",
      },
      fontFamily: {
        display: ["Fredoka", "sans-serif"],
        body: ["Nunito", "sans-serif"],
        hand: ["Caveat", "cursive"],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(43,38,48,0.05), 0 4px 14px rgba(43,38,48,0.05)",
      },
    },
  },
  plugins: [],
};
