import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "custom-bgColor": "#f8f6ed",
        "custom-bgColor-hover": "#559bf7",
        "custom-bgColor-dark": "#0580b1",
        "custom-table-bgColor-hover": "#f0f0f0",
        "custom-borderColor": "#0580b1",
        "custom-fontColor": "#559bf7",
        "custom-fontColor-dark": "#0580b1",
        "custom-fontColor-hover": "#0580b1",
      },
      keyframes: {
        "subtle-move": {
          "0%, 100%": { transform: "translateX(-50%)" },
          "50%": { transform: "translateX(calc(-50% + 20px))" },
        },
      },
      animation: {
        "subtle-move": "subtle-move 18s ease-in-out infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
