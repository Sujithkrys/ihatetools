import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#111212",
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
        handwriting: ["var(--font-caveat)", "cursive"],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(17,18,18,0.04), 0 6px 16px rgba(17,18,18,0.06)",
        'soft-md': "0 2px 4px rgba(17,18,18,0.05), 0 10px 24px rgba(17,18,18,0.08)",
        'soft-hover': "0 2px 6px rgba(17,18,18,0.06), 0 14px 32px rgba(17,18,18,0.10)",
        'soft-dark': "0 1px 2px rgba(0,0,0,0.3), 0 6px 20px rgba(0,0,0,0.35)",
        'soft-dark-md': "0 2px 4px rgba(0,0,0,0.35), 0 10px 28px rgba(0,0,0,0.4)",
      },
      maxWidth: {
        content: "1120px",
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
export default config;
