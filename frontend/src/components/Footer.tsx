// Footer público: redes sociales, WhatsApp del negocio y crédito (CONTEXTO.md sección 7).

const WHATSAPP_NUMBER: string = import.meta.env.VITE_WHATSAPP_NUMBER ?? '5491151225690'

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-yerba-700 bg-yerba-900">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-8 text-center text-sm text-yerba-400">
        <p className="font-display text-lg text-yerba-300">Yerbas BM</p>
        <div className="flex gap-6">
          {/* TODO: reemplazar "#" por la URL real de Instagram del negocio */}
          <a
            href="#"
            className="transition-colors hover:text-yerba-300"
            aria-label="Instagram"
          >
            Instagram
          </a>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-yerba-300"
            aria-label="WhatsApp"
          >
            WhatsApp
          </a>
        </div>
        <p className="text-xs text-yerba-600">Desarrollado por Antonio Melino</p>
      </div>
    </footer>
  )
}
