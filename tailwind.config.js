/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    fontSize: {
      sm: ["14px", "20px"],
      base: ["16px", "24px"],
      xl: ["20px", "28px"],
      "2xl": ["28px", "34px"],
      "3xl": ["40px", "44px"],
    },
    extend: {
      colors: {
        paper: "#F2F3F5",
        surface: "#FFFFFF",
        ink: "#15181E",
        muted: "#5A606B",
        line: "#D9DCE2",
        accent: "#2B4FD9",
        urgent: "#C8372D",
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', "sans-serif"],
        body: ['"Source Sans 3"', "sans-serif"],
      },
    },
  },
  plugins: [],
};
