import type { Config } from "tailwindcss";
const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: { extend: {
    colors: {
      border: "hsl(var(--border))", background: "hsl(var(--background))", foreground: "hsl(var(--foreground))",
      card: "hsl(var(--card))", muted: "hsl(var(--muted))", primary: "hsl(var(--primary))",
      gold: "hsl(var(--gold))", destructive: "hsl(var(--destructive))", success: "hsl(var(--success))"
    },
    boxShadow: { card: "0 10px 30px rgba(34,52,43,.08)" }
  }},
  plugins: [require("tailwindcss-animate")]
};
export default config;
