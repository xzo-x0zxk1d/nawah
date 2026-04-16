/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        nawah: {
          900: '#0a0f1e',
          800: '#0d1529',
          700: '#111d3c',
          600: '#162550',
          500: '#1a2d63',
          teal: '#00c9b1',
          'teal-dark': '#009d8c',
          gold: '#f5c842',
          'gold-dark': '#d4a820',
          coral: '#ff6b6b',
          lavender: '#a78bfa',
        },
      },
      fontFamily: {
        arabic: ['Noto Naskh Arabic', 'Amiri', 'serif'],
        display: ['Noto Kufi Arabic', 'serif'],
      },
      animation: {
        orbit: 'orbit 3s linear infinite',
        orbit2: 'orbit 5s linear infinite reverse',
        orbit3: 'orbit 8s linear infinite',
        float: 'float 4s ease-in-out infinite',
        shimmer: 'shimmer 2s linear infinite',
        spin: 'spin 1s linear infinite',
      },
      keyframes: {
        orbit: {
          from: { transform: 'rotate(0deg) translateX(var(--radius)) rotate(0deg)' },
          to: { transform: 'rotate(360deg) translateX(var(--radius)) rotate(-360deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        shimmer: {
          from: { backgroundPosition: '-200% 0' },
          to: { backgroundPosition: '200% 0' },
        },
      },
      backgroundImage: {
        'grid-pattern': "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2300c9b1' fill-opacity='0.05'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
};
