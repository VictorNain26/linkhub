/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary:              'hsl(var(--primary) / <alpha-value>)',
        'primary-foreground': 'hsl(var(--primary-foreground) / <alpha-value>)',
        background:           'hsl(var(--background) / <alpha-value>)',
      },
      borderRadius: {
        lg: 'var(--radius-lg,0.5rem)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
module.exports = config;
