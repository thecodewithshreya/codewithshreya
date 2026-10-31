import type { Config } from "tailwindcss";

const config: Config = {
  // `dark:` utilities follow the site's theme toggle (html.dark / html.light), not the OS setting.
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    // Class names built in lib/, e.g. the subject colours in lib/palette.ts.
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "rgb(var(--color-ink) / <alpha-value>)",
        panel: "rgb(var(--color-panel) / <alpha-value>)",
        line: "rgb(var(--color-line) / <alpha-value>)",
      },
      boxShadow: {
        glow: "0 0 70px rgba(79, 70, 229, 0.17)",
      },
    },
  },
  plugins: [],
};

export default config;
