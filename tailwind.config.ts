import defaultTheme from "tailwindcss/defaultTheme";

const config = {
  content: [
    './src/**/*.{html,js,ts,jsx,tsx,scss,mdx}', 
  ],
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
        system: "#1F75FF",
        orange: {
          DEFAULT: "#FF9500",
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
        },
        gray: {
          DEFAULT: "#959595",
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
        red: "#FB5454",
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
        linspin: {
          "100%": { transform: "rotate(360deg)" },
        },
        "left-spin": {
          "0%": { transform: "rotate(130deg)" },
          "50%": { transform: "rotate(-5deg)" },
          "100%": { transform: "rotate(130deg)" },
        },
        "right-spin": {
          "0%": { transform: "rotate(-130deg)" },
          "50%": { transform: "rotate(5deg)" },
          "100%": { transform: "rotate(-130deg)" },
        },
        rotating: {
          "0%, 100%": { transform: "rotate(360deg)" },
          "50%": { transform: "rotate(0deg)" },
        },
        topbottom: {
          "0%, 100%": { transform: "translate3d(0, -100%, 0)" },
          "50%": { transform: "translate3d(0, 0, 0)" },
        },
        bottomtop: {
          "0%, 100%": { transform: "translate3d(0, 0, 0)" },
          "50%": { transform: "translate3d(0, -100%, 0)" },
        },
        line: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(100%)" },
        },
        "line-revert": {
          "0%, 100%": { transform: "translateY(100%)" },
          "50%": { transform: "translateY(0)" },
        },
      },
      gridAutoColumns: {
        // Tùy chỉnh grid auto columns cho 5 cột, 4 cột, 3 cột, 2 cột và 1 cột
        '5': 'calc((100% - (5 - 1) * 1rem) / 5)',  // 5 cột
        '4': 'calc((100% - (4 - 1) * 1rem) / 4)',  // 4 cột
        '3': 'calc((100% - (3 - 1) * 1rem) / 3)',  // 3 cột
        '2': 'calc((100% - (2 - 1) * 1rem) / 2)',  // 2 cột
        '1': '100%',  // 1 cột
      },

    },
  },
  plugins: [
    
  ],
};
export default config;
