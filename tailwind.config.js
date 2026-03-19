/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Barlow Condensed"', 'Oswald', 'Arial Narrow', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        panel: '0 24px 80px rgba(18, 22, 28, 0.14)',
        glow: '0 28px 120px rgba(0, 0, 0, 0.45)',
      },
    },
  },
  plugins: [],
};
