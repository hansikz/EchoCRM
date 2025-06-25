/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-primary': { // Vibrant Blue
          light: '#60a5fa',   // blue-400
          DEFAULT: '#3b82f6', // blue-500
          dark: '#2563eb',   // blue-600
        },
        'brand-accent': { // A secondary accent, maybe a teal
          DEFAULT: '#14b8a6', // teal-500
          dark: '#0d9488',   // teal-600
        },
        'brand-text': {
          DEFAULT: '#1e293b', // slate-800 (for headings, important text)
          secondary: '#475569', // slate-600 (for body text)
          muted: '#94a3b8',   // slate-400 (for placeholder text, subtle info)
        },
        'brand-bg': {
          DEFAULT: '#f1f5f9',    // slate-100 (light grey main background)
          alt: '#ffffff',       // white (for cards and contrasting sections)
          dark: '#0f172a',      // slate-900 (for footer, dark sections)
        },
        'brand-border': '#e2e8f0', // slate-200
        'brand-error': '#ef4444', // red-500
        'brand-success': '#22c55e', // green-500
      },
      fontFamily: {
        // Example of adding a custom font. Ensure you import it in layout.jsx
        // sans: ['Inter', 'sans-serif'], 
      },
      boxShadow: {
        'interactive': '0 4px 14px 0 rgba(0, 0, 0, 0.05)',
        'interactive-hover': '0 6px 20px 0 rgba(0, 0, 0, 0.07)',
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};