/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        black: {
          50: "#202223",
          100: "#000000",
        },
        white: {
          50: "#FFFFFF",
        },
        green: {
          50: "#008060",
        },
        blue: {
          50: "#006EFF",
        },
      },

      boxShadow: {
        shadow: "0px 2px 4px 0px #0000001A",
      },
    },
  },
  plugins: [],
};
