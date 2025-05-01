import defaultTheme from "tailwindcss/defaultTheme";

const config = {
  content: ["./src/**/*.{html,js,ts,jsx,tsx,scss,mdx}"],
  darkMode: "class",
  theme: {
    fontFamily: {
      satoshi: ["Satoshi", "sans-serif"],
    },
    screens: {
      "2xsm": "375px",
      xsm: "425px",
      "3xl": "2000px",
      ...defaultTheme.screens,
    },
    extend: {
      colors: {
        system: {
          DEFAULT: "#1F75FF",
          50: "#E6F0FF", // Rất nhạt
          100: "#CCE1FF", // Nhạt hơn
          200: "#99C3FF", // Nhạt
          300: "#66A4FF", // Trung bình nhạt
          400: "#3386FF", // Trung bình
          500: "#1F75FF", // Màu gốc (DEFAULT)
          600: "#195ECC", // Đậm hơn
          700: "#134799", // Đậm
          800: "#0D3066", // Rất đậm
          900: "#071933", // Gần đen
        },
        orange: {
          DEFAULT: "#FF9500",
        },
        gray: {
          DEFAULT: "#959595",
        },
        green: {
          DEFAULT: "#39B88A",
        },
        stroke: "#DDE8F1",
        whiten: "#F1F5F9",
        whiter: "#F5F7FD",
        white: "#FFFFFF",
        black: "#1C2434",
        "gray-1": "#F6F6F9",
        "gray-2": "#F7F9FC",
        "gray-3": "#FAFAFA",
        "gray-4": "#E5E7EB",
        secondary: "#a1a8cc",
        primary: "#3C50E0",
        current: "currentColor",
        transparent: "transparent",
        red: {
          DEFAULT: "#FB5454",
        },
        "black-2": "#010101",
        body: "#64748B",
      },
      fontSize: {
        "title-xxl": ["44px", "55px"],
        "title-xxl2": ["42px", "58px"],
        "title-xl": ["36px", "45px"],
        "title-xl2": ["33px", "45px"],
        "title-lg": ["28px", "35px"],
        "title-md": ["24px", "30px"],
        "title-md2": ["26px", "30px"],
        "title-sm": ["20px", "26px"],
        "title-sm2": ["22px", "28px"],
        "title-xsm": ["18px", "24px"],
      },
      zIndex: {
        999999: "999999",
        99999: "99999",
        9999: "9999",
        999: "999",
        99: "99",
        9: "9",
        1: "1",
      },
      boxShadow: {
        default: "0px 8px 13px -3px rgba(0, 0, 0, 0.07)",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeOut: {
          "0%": { opacity: "1", transform: "translateY(0)" },
          "100%": { opacity: "0", transform: "translateY(20px)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { opacity: "1", transform: "translateY(0)" },
          "100%": { opacity: "0", transform: "translateY(-20px)" },
        },
        slideLeft: {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideRight: {
          "0%": { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.5s ease-out forwards",
        fadeOut: "fadeOut 0.5s ease-out forwards",
        slideDown: "slideDown 0.3s ease-out forwards",
        slideUp: "slideUp 0.3s ease-out forwards",
        slideLeft: "slideLeft 0.3s ease-out forwards",
        slideRight: "slideRight 0.3s ease-out forwards",
      },
      gridAutoColumns: {
        // Tùy chỉnh grid auto columns cho 5 cột, 4 cột, 3 cột, 2 cột và 1 cột
        "5": "calc((100% - (5 - 1) * 1rem) / 5)", // 5 cột
        "4": "calc((100% - (4 - 1) * 1rem) / 4)", // 4 cột
        "3": "calc((100% - (3 - 1) * 1rem) / 3)", // 3 cột
        "2": "calc((100% - (2 - 1) * 1rem) / 2)", // 2 cột
        "1": "100%", // 1 cột
      },
    },
  },
  plugins: [],
};
export default config;
