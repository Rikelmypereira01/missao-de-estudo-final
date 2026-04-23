import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#06080c",
        panel: "#10161f",
        card: "#121a24",
        gold: "#e8b132",
        softGold: "#f1c75c",
        danger: "#d93a54",
        success: "#1fb86d"
      },
      boxShadow: {
        gold: "0 10px 30px rgba(232,177,50,0.15)",
        panel: "0 16px 48px rgba(0,0,0,0.35)"
      }
    }
  },
  plugins: []
};

export default config;
