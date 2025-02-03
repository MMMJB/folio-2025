import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    extend: {
      colors: {
        background: "#FEF9EF",
        text: "#423F3C",
        surface: "#F4EEE5",
        highlight: "#BE6A52",
      },
    },
    fontFamily: {
      sans: ["Instrument Sans", "sans-serif"],
      serif: ["Instrument Serif", "serif"],
    },
  },
  plugins: [],
} satisfies Config;
