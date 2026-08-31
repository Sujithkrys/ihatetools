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
        background: "#0A0A0C",
        surface: "#151519",
        surfaceHover: "#1B1B21",
        textPrimary: "#F5F5F7",
        textSecondary: "#9B9BA3",
        textMuted: "#65656D",
        accent: "#F5A623",
        success: "#22C55E",
        error: "#EF4444",
      },
      borderRadius: {
        card: "12px",
        button: "8px",
      },
      maxWidth: {
        content: "1200px",
      },
    },
  },
  plugins: [],
};
export default config;
