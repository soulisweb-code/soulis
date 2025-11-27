/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        soulis: {
          900: '#0f0518', // ดำม่วง (Deep Space)
          800: '#1a0b2e', // ม่วงเข้ม (Card Background)
          700: '#2e1065', // เส้นขอบ
          600: '#4c1d95', // ปุ่ม/Highlight
          500: '#8b5cf6', // Primary Purple
          400: '#a78bfa', // Text Light
          300: '#c4b5fd', // Text Dim
          accent: '#d946ef', // ชมพูนีออน
        }
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 10s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      },
      fontFamily: {
        sans: ['Kanit', 'sans-serif'],
      }
    },
  },
  plugins: [],
}