export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: '#101828',
        paper: '#f7f4ef',
        graphite: '#1c1f24',
        moss: '#8bbf9f',
        signal: '#7dd3fc',
        clay: '#c8845c',
      },
      boxShadow: {
        soft: '0 24px 80px rgba(16, 24, 40, 0.12)',
      },
    },
  },
  plugins: [],
};
