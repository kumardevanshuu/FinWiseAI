/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0A0A0B",          // page background
        surface: "#141516",     // card background
        surfaceHover: "#1B1D1F",
        border: "#26282B",
        muted: "#9CA3AF",       // secondary text
        faint: "#5B5F66",       // tertiary text
        emerald: {
          DEFAULT: "#10B981",
          dark: "#0D9467",
          light: "#34D399",
        },
        rose: {
          DEFAULT: "#FB7185",   // expenses 
          dark: "#E11D48",
        },
        amber: {
          DEFAULT: "#F59E0B",   // goals accent
          dark: "#D97706",
        },
        violet: {
          DEFAULT: "#A78BFA",   // assistant accent
          dark: "#8B5CF6",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 40px -8px rgba(16, 185, 129, 0.35)",
      },
    },
  },
  plugins: [],
};
