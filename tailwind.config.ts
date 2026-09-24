import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        nyaya: {
          dark: "#0F172A",
          card: "#1E293B",
          accent: "#2563EB",
          highlight: "#3B82F6",
          success: "#10B981",
          warning: "#F59E0B",
          danger: "#EF4444",
          slate: "#64748B",
          gold: "#D97706",
        },
      },
    },
  },
  plugins: [],
};
export default config;
