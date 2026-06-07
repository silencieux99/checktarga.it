/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#0f172a",
          light: "#1e293b",
          accent: "#059669",
          "accent-hover": "#047857",
          muted: "#64748b",
          surface: "#f8fafc",
          border: "#e2e8f0",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 4px 24px -4px rgba(15, 23, 42, 0.08)",
        "card-lg": "0 12px 40px -8px rgba(15, 23, 42, 0.12)",
        glow: "0 0 0 1px rgba(5, 150, 105, 0.15), 0 8px 32px -8px rgba(5, 150, 105, 0.2)",
      },
      animation: {
        fadeInUp: "fadeInUp 0.6s ease-out",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
    },
  },
  plugins: [],
};
