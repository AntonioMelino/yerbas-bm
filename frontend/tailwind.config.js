/** @type {import('tailwindcss').Config} */

// Identidad visual del sitio público (rediseño 2026-07):
// paleta verde mate / tierra / crema del preview visual estático
// (ink, night, forest, olive, yerba, gold, lime, cream, wa) y
// tipografías Cinzel Decorative (títulos) + Inter (cuerpo).
// La escala "yerba" se conserva porque la usa el panel admin (tema oscuro).
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Paleta oficial del sitio público (preview/index.html).
        // Los nombres semánticos se usan en las páginas públicas; la escala
        // "yerba" se conserva porque la usan componentes compartidos (Spinner)
        // y el panel admin (tema oscuro).
        ink: '#120f09',
        night: '#282311',
        forest: '#3f3b1a',
        olive: '#595526',
        yerba: {
          DEFAULT: '#757132',
          950: '#120f09',
          900: '#282311',
          800: '#3f3b1a',
          700: '#595526',
          600: '#757132',
          500: '#958e43',
          400: '#bdb062',
          300: '#ebd792',
        },
        gold: '#958e43',
        lime: '#bdb062',
        cream: '#ebd792',
        wa: '#25d366',
        // Colores legacy del rediseño anterior (mantener para transición/admin)
        mate: {
          DEFAULT: '#2D5A27',
          light: '#4A7C42',
          pastel: '#E8F0E6',
        },
        tierra: {
          DEFAULT: '#8B6914',
          clara: '#C4A35A',
        },
        crema: '#F5F0E8',
        tinta: '#1A1A1A',
      },
      fontFamily: {
        display: ['"Cinzel Decorative"', '"Playfair Display"', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 20px rgba(0,0,0,0.08)',
        'card-hover': '0 8px 30px rgba(0,0,0,0.12)',
      },
    },
  },
  plugins: [],
}
