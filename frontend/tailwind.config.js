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
        'brand-primary': { // Teal
          lightest: '#ccfbf1', // teal-100
          lighter: '#99f6e4', // teal-200
          light: '#5eead4',   // teal-300
          DEFAULT: '#14b8a6', // teal-500
          dark: '#0d9488',   // teal-600
          darker: '#0f766e',  // teal-700
          darkest: '#134e4a', // teal-900
        },
        'brand-accent': { // Orange/Coral
          light: '#fed7aa', // orange-200
          DEFAULT: '#fb923c', // orange-400
          dark: '#f97316',   // orange-500
          darker: '#ea580c',  // orange-600
        },
        'brand-text': {
          DEFAULT:'#334155', // slate-700
          light: '#64748b',  // slate-500
          muted: '#94a3b8', // slate-400
        },
        'brand-bg': {
          DEFAULT: '#f8fafc',    
          alt: '#f1f5f9',     
          dark: '#0f172a',     
        },
        'brand-error': '#ef4444', // red-500
        'brand-success': '#22c55e', // green-500
        'brand-warning': '#eab308', // yellow-500
        'brand-info': '#3b82f6',   // blue-500
      },
      fontFamily: {
      },
      boxShadow: {
        'interactive': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
        'interactive-lg': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        'interactive-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
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