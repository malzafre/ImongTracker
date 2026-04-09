/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'var(--bg-base)',
        surface: 'var(--bg-surface)',
        muted: 'var(--bg-muted)',
        border: 'var(--border-color)',
        primary: 'var(--color-primary)',
        'primary-hover': 'var(--color-primary-hover)',
        'primary-soft': 'var(--color-primary-soft)',
        'primary-soft-hover': 'var(--color-primary-soft-hover)',
        'primary-faint': 'var(--color-primary-faint)',
        'primary-foreground': 'var(--color-primary-foreground)',
        foreground: 'var(--text-primary)',
        'foreground-muted': 'var(--text-secondary)',
        'foreground-subtle': 'var(--text-tertiary)',
        ring: 'var(--color-primary)',
        danger: 'var(--danger)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lift: 'var(--shadow-lift)',
        'inner-soft': 'var(--shadow-inner-soft)',
      },
      borderRadius: {
        xl: '14px',
        '2xl': '20px',
      },
      fontFamily: {
        sans: ['Manrope', 'Inter', 'Segoe UI', 'sans-serif'],
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 400ms ease-out both',
      },
    },
  },
  plugins: [],
}
