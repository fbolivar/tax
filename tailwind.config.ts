import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0c2d48',
          primary: '#2e8bc0',
          secondary: '#145da0',
          light: '#b1d4e0',
          bg: '#f8fafc',
        }
      },
      borderRadius: {
        '3xl': '24px',
        '4xl': '32px',
      },
      boxShadow: {
        'premium': '0 10px 40px -10px rgba(0, 0, 0, 0.05)',
        'premium-hover': '0 20px 50px -12px rgba(0, 0, 0, 0.08)',
      }
    },
  },
  plugins: [],
}

export default config
