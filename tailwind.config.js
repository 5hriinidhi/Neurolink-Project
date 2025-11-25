/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'float-medium': 'float 4s ease-in-out infinite',
        'float-fast': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'fade-in-up': 'fadeInUp 1s ease-out',
        'orbit-1': 'orbit1 10s linear infinite',
        'orbit-2': 'orbit2 8s linear infinite',
        'orbit-3': 'orbit3 12s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
          '25%': { transform: 'translateY(-20px) translateX(10px)' },
          '50%': { transform: 'translateY(-10px) translateX(-15px)' },
          '75%': { transform: 'translateY(-30px) translateX(5px)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        orbit1: {
          '0%': { transform: 'rotate(0deg) translateX(90px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(90px) rotate(-360deg)' },
        },
        orbit2: {
          '0%': { transform: 'rotate(120deg) translateX(70px) rotate(-120deg)' },
          '100%': { transform: 'rotate(480deg) translateX(70px) rotate(-480deg)' },
        },
        orbit3: {
          '0%': { transform: 'rotate(240deg) translateX(110px) rotate(-240deg)' },
          '100%': { transform: 'rotate(600deg) translateX(110px) rotate(-600deg)' },
        },
      },
      blur: {
        'xs': '2px',
      },
      transitionDuration: {
        '2000': '2000ms',
      },
      backgroundImage: {
        'radial-gradient': 'radial-gradient(ellipse at center, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};