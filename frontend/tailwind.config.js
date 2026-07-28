/** @type {import('tailwindcss').Config} */

// Paleta y tipografías de la identidad visual de Yerbas BM
// (CONTEXTO.md, sección 7 — colores extraídos del logo).
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Escala "yerba": de negro profundo a crema
        yerba: {
          950: '#120f09', // negro profundo — fondos oscuros, textos principales
          900: '#282311', // verde oscuro — fondos alternativos, navbar
          800: '#3f3b1a', // verde bosque — tarjetas, contenedores
          700: '#595526', // oliva — bordes, separadores
          600: '#757132', // verde yerba — acentos, botones secundarios
          500: '#958e43', // verde dorado — hover states
          400: '#bdb062', // lima mate — destacados, etiquetas
          300: '#ebd792', // crema — fondos claros, textos sobre oscuro
        },
      },
      fontFamily: {
        display: ['Cinzel Decorative', 'Playfair Display', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
