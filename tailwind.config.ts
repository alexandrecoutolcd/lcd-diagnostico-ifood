import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0B0B0B",
        card: "#131313",
        border: "#252525",
        heading: "#F0EDE8",
        body: "#B8B4AE",
        "accent-pos": "#00BBF9",
        "accent-neg": "#f91719",
        "accent-big-pos": "#46fe6c",
        "zone-1": "#00BBF9",
        "zone-2": "#46fe6c",
        "zone-3": "#FFB020",
        "zone-4": "#FF6A3D",
        "zone-5": "#f91719",
      },
      fontFamily: {
        heading: ["var(--font-heading)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-body)", "monospace"],
      },
      borderRadius: {
        xl2: "18px",
      },
    },
  },
  plugins: [],
};

export default config;
