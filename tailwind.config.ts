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
        base: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0052ff',
          600: '#0041cc',
          700: '#0033a3',
        },
      },
    },
  },
  plugins: [],
}
export default config