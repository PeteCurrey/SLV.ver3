import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        pearl: '#F7F5F0',
        navy: '#0D1B2A',
        'navy-mid': '#1A3044',
        gold: '#B8843A',
        'gold-light': '#D4A85A',
        'gold-pale': '#F5EDD8',
        mid: '#5C6470',
        light: '#E8E5DF',
      },
      fontFamily: {
        serif: ['var(--font-cormorant)', 'Georgia', 'serif'],
        sans: ['var(--font-outfit)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
