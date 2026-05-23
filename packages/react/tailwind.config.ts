import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Geist', 'Noto Sans Ethiopic', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;

