import type { Config } from 'tailwindcss';

/** Brand palette — referenced alongside CSS :root; utilities use arbitrary values in components. */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        lime: {
          brand: '#C8E63C',
          dark: '#A8C420',
        },
        brand: {
          black: '#0A0A0A',
          dark: '#111111',
          dark2: '#1A1A1A',
          border: '#2A2A2A',
          gray: '#8A8A8A',
        },
      },
    },
  },
} satisfies Config;
