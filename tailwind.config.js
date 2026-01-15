/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Enhanced v9.45: Deeper jewel tones with improved contrast
        brand: {
          DEFAULT: "var(--brand-color, #F5C400)",      // Rich gold (was #FFD700)
          dark: "var(--brand-color-dark, #d4a900)",    // Deeper gold
          hover: "var(--brand-hover, #d4a900)",
          active: "var(--brand-active, #b89200)",
          light: "var(--brand-light, #fcd34d)",
        },
      },
      fontWeight: {
        heading: "var(--font-weight-heading, 600)",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out",
        "slide-up": "slideUp 0.6s ease-out",
        bounce: "bounce 2s infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
