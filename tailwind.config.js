/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        noir: {
          950: '#030308',
          900: '#07070f',
          800: '#0c0c1a',
          700: '#14142a'
        },
        neon: {
          violet: '#8b5cf6',
          'violet-bright': '#a78bfa',
          cyan: '#22d3ee',
          'cyan-bright': '#67e8f9'
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        display: ['Poppins', 'sans-serif']
      }
    }
  },
  plugins: []
};
