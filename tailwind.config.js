/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      animation: {
        'ken-burns': 'kenBurns 6s ease-out forwards',
        'fade-in-up': 'fadeInUp 720ms cubic-bezier(0.22, 0.8, 0.2, 1) forwards',
        'pulse-once': 'pulseOnce 420ms ease-out forwards',
        'slide-up': 'slideUp 420ms ease-out forwards',
        'card-reveal': 'cardReveal 360ms ease-out forwards',
        'modal-enter': 'modalEnter 320ms ease-out forwards',
      },
      keyframes: {
        kenBurns: {
          '0%': { transform: 'scale(1.03)' },
          '100%': { transform: 'scale(1)' },
        },
        fadeInUp: {
          '0%': { 
            opacity: '0',
            transform: 'translateY(14px)'
          },
          '100%': { 
            opacity: '1',
            transform: 'translateY(0)'
          },
        },
        pulseOnce: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.04)' },
          '100%': { transform: 'scale(1)' },
        },
        slideUp: {
          '0%': { 
            opacity: '1',
            transform: 'translateY(0)'
          },
          '100%': { 
            opacity: '0',
            transform: 'translateY(-20px)'
          },
        },
        cardReveal: {
          '0%': { 
            opacity: '0',
            transform: 'translateY(12px)'
          },
          '100%': { 
            opacity: '1',
            transform: 'translateY(0)'
          },
        },
        modalEnter: {
          '0%': { 
            opacity: '0',
            transform: 'scale(0.98)'
          },
          '100%': { 
            opacity: '1',
            transform: 'scale(1)'
          },
        },
      },
      transitionDuration: {
        '240': '240ms',
        '320': '320ms',
        '360': '360ms',
        '420': '420ms',
        '720': '720ms',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.22, 0.8, 0.2, 1)',
      },
      backdropBlur: {
        'xs': '2px',
      },
      colors: {
        resort: {
          50: '#f7fbfb',
          100: '#eef8f8',
          300: '#7fd3d3',
          500: '#18a6a6',
          700: '#0f7a7a'
        },
        sand: {
          50: '#fffaf5',
          100: '#fff3e6',
          300: '#f2d7b0',
          500: '#e6b67a'
        },
        // Beach-themed dark mode colors
        beach: {
          dark: {
            bg: '#1a2639', // Deep ocean blue
            card: '#203354', // Midnight blue
            accent: '#ff9e5e', // Sunset orange
            text: '#f0f5fa', // Seafoam white
            muted: '#8ca3c3' // Misty blue
          }
        }
      }
    },
  },
  plugins: [],
}
