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
        hard: "4px 4px 0 rgb(var(--shadow-color, var(--color-ink)))",
        'hard-hover': "7px 7px 0 rgb(var(--shadow-color, var(--color-ink)))",
        'hard-sm': "2px 2px 0 rgb(var(--shadow-color, var(--color-ink)))",
        'hard-lg': "6px 6px 0 rgb(var(--shadow-color, var(--color-ink)))",
      },
      maxWidth: {
        content: "1120px",
      },
    },
  },
  plugins: [],
};
export default config;
