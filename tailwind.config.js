/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#121212',
        panel: '#1f1f1f',
        panelElevated: '#333333',
        panelMuted: '#292929',
        line: '#383838',
        lineStrong: '#4a4a4a',
        text: '#f4f4f5',
        muted: '#a1a1aa',
        subtle: '#71717a',
        success: '#38d878',
        warning: '#d9a928',
        danger: '#f5a3a3',
        info: '#60a5fa',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        overlay: '0 20px 60px rgb(0 0 0 / 0.35)',
        glow: '0 0 0 1px rgb(255 255 255 / 0.06), 0 20px 70px rgb(0 0 0 / 0.35)',
      },
      borderRadius: {
        tool: '0.1875rem',
      },
    },
  },
  plugins: [],
}
