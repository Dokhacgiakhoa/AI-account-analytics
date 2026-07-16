/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bgMain: '#0f172a',
        panelBg: 'rgba(30, 41, 59, 0.7)',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        textMain: '#f8fafc',
        textMuted: '#94a3b8',
        primary: '#38bdf8',
        primaryHover: '#0284c7',
        success: '#22c55e',
        warning: '#f59e0b',
        danger: '#ef4444',
      }
    },
  },
  plugins: [],
}
