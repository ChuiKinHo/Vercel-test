/** @type {import('tailwindcss').Config} */

module.exports = {
  darkMode: 'class',
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,jsx,ts,tsx,mdx}",
    // "./node_modules/flowbite-react/lib/**/*.js",
  ],
  theme: {
    extend: {
      colors: {

        primary: "",
        shadow: "var(--shadow)",

        s1: "var(--s1)",
        s2: "var(--s2)",
        s3: "var(--s3)",
        s4: "var(--s4)",
        s5: "var(--s5)",
        s6: "var(--s6)",
        s7: "var(--s7)",
        s8: "var(--s8)",
        s9: "var(--s9)",

        "text":  "var(--text)",
        "url":  "var(--text-url)",
        "redd":  "var(--red)",
        "greenn":  "var(--green)",
        "blue-lightt": "var(--blue-light)",
        
        "button":  "var(--button)",
        "side-bar":  "var(--side-bar)",
        
        "border":  "var(--border)",
        "hover":  "var(--hover)",
        
        
        transparent: "transparent",
        current: "currentColor",
        white: "#ffffff",
        black: "#1d1d1f",
        green: {
          default: "#627b80",
          "light-green": "#dee7ea",
        },
        red: {
          default: "#dc3f56",
          warning: {
            heavy: "#db545a",
            light: "#fecaca",
          },
        },
        slate: {
          light: "#94a3b8",
        },
        gray: {
          light: "#f7f7f7",
          "light-semi": "#cccccc",
          default: "#9ca3af",
          heavy: "#4b5563",
        },
        blue: {
          light: "#93c5fd",
          url: "#60a5fa",
        },
      },
      fontSize: {
        xs: "0.72rem",
        sm: "0.83rem",
        base: "1rem",
        xl: "1.25rem",
        "2xl": "1.4rem",
        "3xl": "1.953rem",
        "4xl": "2.441rem",
        "5xl": "3.052rem",
      },
      animation: {
        "spin-slow": "spin 3s linear infinite",
      },
    },
  },
  plugins: [
    // require("flowbite/plugin")
  ],
};