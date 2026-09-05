import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "rgb(var(--color-ink) / <alpha-value>)",
        paper: "rgb(var(--color-paper) / <alpha-value>)",
        bg: "rgb(var(--color-bg) / <alpha-value>)",
        pink: "rgb(var(--color-pink) / <alpha-value>)",
        yellow: "rgb(var(--color-yellow) / <alpha-value>)",
        cyan: "rgb(var(--color-cyan) / <alpha-value>)",
        green: "rgb(var(--color-green) / <alpha-value>)",
        violet: "rgb(var(--color-violet) / <alpha-value>)",
        grey: "rgb(var(--color-grey) / <alpha-value>)",
        sel: "rgb(var(--color-sel) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
        handwriting: ["var(--font-caveat)", "cursive"],
        logo: ["var(--font-bricolage)", "sans-serif"],
      },
      boxShadow: {
        hard: "none",
        'hard-hover': "none",
        'hard-sm': "none",
        'hard-lg': "none",
      },
      maxWidth: {
        content: "1120px",
      },
    },
  },
  plugins: [],
};
export default config;
