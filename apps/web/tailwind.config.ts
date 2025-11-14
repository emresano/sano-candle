import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        serif: ["Playfair Display", "serif"],
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        // Premium beige/brown color palette
        brand: {
          cream: "#FDFCFB",
          light: "#F8F7F3",
          tan: "#EAE6E1",
          beige: "#D4C4B0",
          brown: "#3D3D3D",
          accent: "#8B7355",
          hover: "#6B5845",
        },
        sand: {
          50: "#FDFCFB",
          100: "#F8F7F3",
          200: "#EAE6E1",
          300: "#D4C4B0",
          400: "#A89080",
          500: "#8B7355",
          600: "#6B5845",
          700: "#3D3D3D",
        },
        warm: {
          100: "#FFE6D5",
          200: "#FFC8A8",
          300: "#FFAC7A",
          400: "#FE9452",
          500: "#F97316",
          600: "#EA580C",
          700: "#C2410C",
        },
      },
      boxShadow: {
        card: "0 20px 40px -24px rgba(61, 61, 61, 0.2)",
      },
    },
  },
  plugins: [],
};

export default config;