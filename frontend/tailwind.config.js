/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0284c7',
          600: '#0369a1',
          700: '#075985',
          800: '#0c4a6e',
          900: '#0a3651',
        },
        accent: {
          green: '#15803d',
          orange: '#c2410c',
          red: '#b91c1c',
        }
      },
      fontSize: {
        'senior-sm': ['1.125rem', { lineHeight: '1.75rem' }],   // 18px
        'senior-base': ['1.25rem', { lineHeight: '1.875rem' }], // 20px
        'senior-lg': ['1.5rem', { lineHeight: '2rem' }],        // 24px
        'senior-xl': ['1.875rem', { lineHeight: '2.25rem' }],   // 30px
        'senior-2xl': ['2.25rem', { lineHeight: '2.5rem' }],    // 36px
        'senior-3xl': ['3rem', { lineHeight: '1' }],            // 48px
      }
    },
  },
  plugins: [],
}
