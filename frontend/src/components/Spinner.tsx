// Indicador de carga genérico (spinner) reutilizable en páginas y paneles.

interface SpinnerProps {
  /** Texto opcional debajo del spinner. */
  label?: string
}

export default function Spinner({ label = 'Cargando…' }: SpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16" role="status">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-yerba-700 border-t-yerba-400" />
      <p className="text-sm text-yerba-400">{label}</p>
    </div>
  )
}
