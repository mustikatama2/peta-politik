/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'bg-app':     '#0A0E1A',
        'bg-card':    '#111827',
        'bg-sidebar': '#0D111F',
        'bg-elevated':'#1A2237',
        'accent-red': '#DC2626',
        'accent-gold':'#F59E0B',
        'accent-blue':'#3B82F6',
        'text-primary':'#F9FAFB',
        'text-secondary':'#9CA3AF',
        border:       '#1F2937',
        party: {
          pdip:    '#C8102E',
          golkar:  '#FFD700',
          gerindra:'#8B0000',
          pkb:     '#00A550',
          nasdem:  '#27AAE1',
          pks:     '#1B5E20',
          demokrat:'#2196F3',
          pan:     '#FF6B35',
          ppp:     '#4CAF50',
          psi:     '#E91E63',
          hanura:  '#FF5722',
          garuda:  '#9C27B0',
          buruh:   '#F44336',
          gelora:  '#FF9800',
          pkn:     '#607D8B',
          pbb:     '#009688',
          perindo: '#00BCD4',
          ummat:   '#8BC34A',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        shake: 'shake 0.5s ease-in-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-6px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(6px)' },
        },
      },
    },
  },
  plugins: [],
}
