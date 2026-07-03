import { useData } from '../context/DataContext'

const PAGE_TITLES = {
  resumen:      'Resumen General',
  kpi:          'KPI 75% – Meta de Cumplimiento',
  comparativo:  'Comparativo por Año',
  distribucion: 'Distribución de Niveles',
  glosario:     'Glosario ABET',
}

export default function TopBar({ currentPage }) {
  const {
    allYears, allSOs, allAsignaturas,
    filters, setAño, setSO, setTipoMedicion, setAsignatura,
    clearFilters, hasActiveFilters,
  } = useData()

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm flex-shrink-0">
      {/* Título de página */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100">
        <h1 className="text-lg font-semibold text-sabana-900">{PAGE_TITLES[currentPage]}</h1>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1.5 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 hover:bg-red-100 transition-colors px-3 py-1.5 rounded-full"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Fila de filtros — oculta en Glosario */}
      {currentPage === 'glosario' ? null : <div className="flex flex-wrap items-center gap-4 px-6 py-3">

        {/* Año */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-500 whitespace-nowrap">Año:</span>
          <select
            value={filters.años[0] || ''}
            onChange={e => setAño(e.target.value || null)}
            className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-700
                       focus:outline-none focus:border-sabana-700 bg-white"
          >
            <option value="">Todos los periodos</option>
            {allYears.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        <div className="h-5 w-px bg-gray-200"/>

        {/* Tipo medición */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-500 whitespace-nowrap">Tipo:</span>
          <div className="flex gap-1">
            {['Formativa', 'Sumativa'].map(tipo => (
              <button
                key={tipo}
                onClick={() => setTipoMedicion(tipo)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all
                  ${filters.tipoMedicion === tipo ? 'chip-active' : 'chip-inactive'}`}
              >
                {tipo}
              </button>
            ))}
          </div>
        </div>

        <div className="h-5 w-px bg-gray-200"/>

        {/* Student Outcome */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-500 whitespace-nowrap">SO:</span>
          <select
            value={filters.sos[0] || ''}
            onChange={e => setSO(e.target.value || null)}
            className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-700
                       focus:outline-none focus:border-sabana-700 bg-white max-w-[280px]"
          >
            <option value="">Todos los Student Outcomes</option>
            {allSOs.map(({ so, desc }) => (
              <option key={so} value={so}>{so} – {desc}</option>
            ))}
          </select>
        </div>

        <div className="h-5 w-px bg-gray-200"/>

        {/* Asignatura */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-500 whitespace-nowrap">Asignatura:</span>
          <select
            value={filters.asignatura || ''}
            onChange={e => setAsignatura(e.target.value)}
            className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-700
                       focus:outline-none focus:border-sabana-700 bg-white max-w-[220px]"
          >
            <option value="">Todas</option>
            {allAsignaturas.map(a => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>

      </div>}
    </header>
  )
}
