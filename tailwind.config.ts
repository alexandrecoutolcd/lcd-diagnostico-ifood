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
        // Fundo (LucrandoAI — warm cream / surface white)
        bg: "#F6EDE6",
        card: "#FFF9F4",
        "card-secondary": "#F6EDE6",

        // Bordas e divisões (derivadas de border-dark em opacidades diferentes)
        border: "rgba(76, 34, 35, 0.16)",
        "border-strong": "rgba(76, 34, 35, 0.32)",
        divider: "rgba(76, 34, 35, 0.08)",

        // Textos
        heading: "#24100F",
        body: "#24100F",
        "body-secondary": "#765756",
        muted: "#765756",

        // Identidade / CTA (vermelho da marca)
        brand: "#C22236",
        "brand-hover": "#E5445A",
        "brand-light": "rgba(194, 34, 54, 0.10)",
        "brand-xlight": "rgba(194, 34, 54, 0.05)",

        // Indicadores positivos (verde)
        "accent-pos": "#2F7D4A",
        "accent-pos-hover": "#256B3D",
        "accent-pos-light": "rgba(47, 125, 74, 0.12)",
        "accent-pos-xlight": "rgba(47, 125, 74, 0.06)",
        "accent-big-pos": "#2F7D4A",

        // Indicadores negativos (vermelho da marca)
        "accent-neg": "#C22236",
        "accent-neg-hover": "#9C1C2B",
        "accent-neg-light": "rgba(194, 34, 54, 0.10)",
        "accent-neg-xlight": "rgba(194, 34, 54, 0.05)",

        // Alerta / atenção (rose accent)
        alert: "#E5445A",
        "alert-light": "rgba(229, 68, 90, 0.12)",

        // Neutras (derivadas de deep-brown / muted-brown)
        "gray-100": "rgba(36, 16, 15, 0.06)",
        "gray-300": "rgba(36, 16, 15, 0.18)",
        "gray-700": "#765756",

        // Termômetro de Aquisição (5 zonas, só com tokens validados da paleta)
        "zone-1": "#765756",
        "zone-2": "#2F7D4A",
        "zone-3": "#E5445A",
        "zone-4": "#C22236",
        "zone-5": "#1A0F0E",
      },
      fontFamily: {
        heading: ["var(--font-heading)", "sans-serif"],
        body: ["var(--font-body)", "monospace"],
      },
      borderRadius: {
        xl2: "20px",
      },
    },
  },
  plugins: [],
};

export default config;
