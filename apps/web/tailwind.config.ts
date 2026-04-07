import type { Config } from 'tailwindcss';

export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/react/src/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {}
  },
  plugins: []
} satisfies Config;

