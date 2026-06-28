import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#070a12",
        panel: "#0e1322",
        line: "#20283b",
      },
      boxShadow: {
        glow: "0 0 70px rgba(79, 70, 229, 0.17)",
      },
    },
  },
  plugins: [],
};

export default config;
