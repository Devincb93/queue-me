/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Set Inter as the default sans-serif font
      },
      fontSize: {
        'xs': ['0.64rem', { lineHeight: '1rem' }], // ~10px
        'sm': ['0.8rem', { lineHeight: '1.25rem' }], // ~12.8px
        'base': ['1rem', { lineHeight: '1.5rem' }], // 16px
        'lg': ['1.25rem', { lineHeight: '1.75rem' }], // 20px (h6)
        'xl': ['1.563rem', { lineHeight: '2.25rem' }], // 25px (h5)
        '2xl': ['1.953rem', { lineHeight: '2.5rem' }], // 31.25px (h4)
        '3xl': ['2.441rem', { lineHeight: '2.75rem' }], // 39.06px (h3)
        '4xl': ['3.052rem', { lineHeight: '3rem' }], // 48.83px (h2)
        '5xl': ['3.815rem', { lineHeight: '1' }], // 61.04px (h1)
      },
      letterSpacing: {
        tightest: '-.075em',
        tighter: '-.05em',
        tight: '-.025em',
        normal: '0',
        wide: '.025em',
        wider: '.05em',
        widest: '.1em',
        // Custom subtle tracking for headings if needed
        'heading-tight': '-0.01em',
        'heading-normal': '0.005em',
      }
    },
  },
  plugins: [],
}
