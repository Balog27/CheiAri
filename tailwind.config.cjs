/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#141210',
          700: '#2B2724',
          500: '#5E564F',
          // Lightest step still clears 4.5:1 on paper. Used for small labels.
          300: '#756C65',
        },
        paper: {
          DEFAULT: '#FAF8F5',
          200: '#F1EDE7',
          300: '#E3DCD2',
        },
        brass: {
          DEFAULT: '#9A6D34',
          400: '#C49A5E',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      fontSize: {
        // Fluid scale: one ramp that holds from 360px to 2560px.
        display: ['clamp(2.75rem, 6.2vw, 5.5rem)', { lineHeight: '1.02', letterSpacing: '-0.035em' }],
        h2: ['clamp(1.875rem, 3.4vw, 3rem)', { lineHeight: '1.08', letterSpacing: '-0.025em' }],
        h3: ['clamp(1.25rem, 1.6vw, 1.5rem)', { lineHeight: '1.2', letterSpacing: '-0.015em' }],
        lead: ['clamp(1.0625rem, 1.15vw, 1.1875rem)', { lineHeight: '1.6' }],
      },
      maxWidth: {
        measure: '60ch',
      },
      transitionTimingFunction: {
        out: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
}
