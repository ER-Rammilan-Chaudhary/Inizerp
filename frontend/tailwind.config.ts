import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
      },

      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },

        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },

        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },

        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },

        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },

        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },

        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",

        // inizsoft Sidebar Theme Tokens
        sidebar: {
          DEFAULT: "hsl(var(--sidebar))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          icon: "hsl(var(--sidebar-icon))",
        },

        // inizsoft School Theme Global Tokens
        school: {
          amber: {
            DEFAULT: "hsl(var(--school-amber))",
            foreground: "hsl(var(--school-amber-foreground))",
            light: "hsl(var(--school-amber-light))",
          },
          navy: {
            DEFAULT: "hsl(var(--school-navy))",
            foreground: "hsl(var(--school-navy-foreground))",
            light: "hsl(var(--school-navy-light))",
          },
          blue: {
            DEFAULT: "hsl(var(--school-blue))",
            foreground: "hsl(var(--school-blue-foreground))",
            light: "hsl(var(--school-blue-light))",
          },
          green: {
            DEFAULT: "hsl(var(--school-green))",
            foreground: "hsl(var(--school-green-foreground))",
            light: "hsl(var(--school-green-light))",
          },
          red: {
            DEFAULT: "hsl(var(--school-red))",
            foreground: "hsl(var(--school-red-foreground))",
            light: "hsl(var(--school-red-light))",
          },
        },
      },

      fontFamily: {
        sans: ["var(--font-sans)", "Roboto", "sans-serif"],
        mono: ["var(--font-sans)", "Roboto", "sans-serif"],
      },

      fontSize: {
        xs: ["0.9375rem", { lineHeight: "1.375rem" }], // ~15px
        sm: ["1rem", { lineHeight: "1.5rem" }], // 16px minimum for all sm text
        base: ["1rem", { lineHeight: "1.5rem" }], // 16px
        md: ["1.0625rem", { lineHeight: "1.6rem" }], // 17px
        lg: ["1.125rem", { lineHeight: "1.75rem" }], // 18px
        xl: ["1.25rem", { lineHeight: "1.75rem" }], // 20px
      },
    },
  },

  plugins: [],
};

export default config;
