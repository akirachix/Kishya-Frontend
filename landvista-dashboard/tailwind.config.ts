import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        'custom-orange': '#DC8B6F',
        'custom-dark-orange': '#CA7758',
        'custom-dark-blue':'#009FDE',
        'custom-teal': '#008080',
        'custom-20': '20px',
        'custom-30': '30px',
        'custom-50': '50px',
        fontSize: {
          '25px': '25px',
        },
      },
    },
  },
  plugins: [],
};
export default config;
