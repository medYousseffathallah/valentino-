import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        valentino: {
          bg: "#fafaf9",
          primary: "#be123c",
          accent: "#d97706"
        }
      },
      boxShadow: {
        "soft-xl": "0 18px 48px -28px rgb(12 10 9 / 0.25), 0 0 0 1px rgb(231 229 228 / 1)"
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["var(--font-playfair)", "ui-serif", "Georgia", "serif"]
      }
    }
  },
  plugins: []
} satisfies Config

export default config

