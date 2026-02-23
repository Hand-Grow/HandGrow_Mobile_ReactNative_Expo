/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#45C38B",
        secondary: "#4CAF50",
        accent: "#FBC02D",

        background: {
          DEFAULT: "#FFFFFF",
          secondary: "#F5F5F5",
        },

        // Text
        text: {
          primary: "#263238",
          secondary: "#607D8B",
          muted: "#9CA3AF",
          inverse: "#FFFFFF",
        },

        success: "#4CAF50",
        warning: "#FBC02D",
        error: "#E53935",
        info: "#2196F3",

        border: "#B7BBC1",
        btnprimary: "#3CC18E",
        btnsecondary: "#4C85EA",
      },

      fontSize: {
        xs: ["12px", { lineHeight: "16px" }],
        sm: ["14px", { lineHeight: "20px" }],
        md: ["16px", { lineHeight: "24px" }],
        lg: ["18px", { lineHeight: "26px" }],
        xl: ["20px", { lineHeight: "28px" }],
        "2xl": ["24px", { lineHeight: "32px", fontWeight: "700" }],
      },

      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "20px",
      },
      spacing: {
        logo: 270,
      },
    },
  },
};
