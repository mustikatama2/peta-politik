/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Semantic tokens backed by CSS variables — works for both themes
        'bg-app':      'var(--bg-app)',
        'bg-card':     'var(--bg-card)',
        'bg-sidebar':  'var(--bg-sidebar)',
        'bg-elevated': 'var(--bg-elevated)',
        'bg-hover':    'var(--bg-hover)',
        'text-primary':'var(--text-primary)',
        'text-secondary':'var(--text-secondary)',
        'text-muted':  'var(--text-muted)',
        'border':      'var(--border)',
        'border-strong':'var(--border-strong)',
        'accent-red':  'var(--accent-red)',
        'accent-gold': 'var(--accent-gold)',
        'accent-blue': 'var(--accent-blue)',
        'accent-green':'var(--accent-green)',
        // Party colors stay fixed (not theme-dependent)
        party: {
          pdip:    '#C8102E', golkar:  '#F59E0B', gerindra:'#991B1B',
          pkb:     '#16A34A', nasdem:  '#0EA5E9', pks:     '#15803D',
          demokrat:'#2563EB', pan:     '#EA580C', ppp:     '#22C55E',
          psi:     '#DB2777', hanura:  '#EF4444', garuda:  '#9333EA',
          buruh:   '#DC2626', gelora:  '#F97316', pkn:     '#64748B',
          pbb:     '#0D9488', perindo: '#06B6D4', ummat:   '#84CC16',
        },
      },
      fontFamily: {
        sans: ['Inter var', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Cal Sans', 'Inter var', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card:     'var(--shadow-card)',
        elevated: 'var(--shadow-elevated)',
        modal:    '0 25px 50px -12px rgba(0,0,0,0.4)',
      },
      animation: {
        shake:        'shake 0.5s ease-in-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in':    'fadeIn 0.3s ease-out',
        'slide-up':   'slideUp 0.3s ease-out',
      },
      keyframes: {
        shake: {
          '0%,100%': { transform:'translateX(0)' },
          '10%,30%,50%,70%,90%': { transform:'translateX(-5px)' },
          '20%,40%,60%,80%':     { transform:'translateX(5px)' },
        },
        fadeIn:  { from:{ opacity:0 }, to:{ opacity:1 } },
        slideUp: { from:{ opacity:0, transform:'translateY(8px)' }, to:{ opacity:1, transform:'translateY(0)' } },
      },
    },
  },
  plugins: [],
}
