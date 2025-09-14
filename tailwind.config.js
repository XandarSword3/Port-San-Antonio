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
        'fadeIn': 'fadeIn 1s ease-out forwards',
        'fadeInSlideUp': 'fadeInSlideUp 1s cubic-bezier(0.22, 0.8, 0.2, 1) forwards',
        'shimmer': 'shimmer 3s linear infinite',
      },
      keyframes: {
        kenBurns: {
          '0%': { transform: 'scale(1.03)' },
          '100%': { transform: 'scale(1)' },
        },
        fadeIn: {
          '0%': { 
            opacity: '0',
            transform: 'translateY(10px)'
          },
          '100%': { 
            opacity: '1',
            transform: 'translateY(0)'
          },
        },
        fadeInSlideUp: {
          '0%': { 
            opacity: '0',
            transform: 'translateY(20px)'
          },
          '100%': { 
            opacity: '1',
            transform: 'translateY(0)'
          },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
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
        // Lebanese-inspired luxury theme with proper contrast
        luxury: {
          dark: {
            bg: '#2C3E50', // Deep indigo primary
            card: '#34495E', // Slightly lighter indigo for cards
            accent: '#D4AF37', // Muted gold for elegance
            text: '#E0E0E0', // Light text for readability
            muted: '#B0BEC5', // Muted light gray
            border: '#40E0D0', // Turquoise for Mediterranean sea vibes
            secondary: '#40E0D0', // Turquoise accent
            tertiary: '#556B2F' // Olive green for Lebanese cedar vibes
          },
          light: {
            bg: '#EDE0D4', // Soft sand primary
            card: '#F5F5DC', // Beige for cards
            accent: '#C9A66B', // Muted gold for elegance
            text: '#333333', // Dark text for readability
            muted: '#6B6B6B', // Muted gray
            border: '#556B2F', // Olive green for Lebanese cedar vibes
            warm: '#F5F5DC', // Beige warm tone
            cream: '#FFF8DC', // Cream background
            secondary: '#556B2F', // Olive green accent
            tertiary: '#40E0D0' // Turquoise for Mediterranean sea
          }
        }
      }
    },
  },
  plugins: [],
}
