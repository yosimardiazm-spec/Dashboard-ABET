const NAV_ITEMS = [
  {
    id: 'resumen',
    label: 'Resumen General',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
      </svg>
    ),
  },
  {
    id: 'kpi',
    label: 'KPI 75%',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
      </svg>
    ),
  },
  {
    id: 'comparativo',
    label: 'Comparativo por Año',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
      </svg>
    ),
  },
  {
    id: 'distribucion',
    label: 'Distribución de Niveles',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"/>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"/>
      </svg>
    ),
  },
  {
    id: 'glosario',
    label: 'Glosario ABET',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
      </svg>
    ),
  },
]

export default function Sidebar({ currentPage, onNavigate }) {
  return (
    <aside className="w-64 bg-sabana-900 flex flex-col flex-shrink-0 shadow-xl">
      {/* Logo */}
      <div className="bg-white px-4 py-3 flex flex-col items-center gap-1.5">
        <img
          src="./logo-sabana.jpg"
          alt="Universidad de La Sabana"
          className="h-14 w-auto object-contain"
        />
        <p className="text-sabana-900 text-[10px] font-semibold tracking-widest uppercase opacity-50">
          Facultad de Ingeniería
        </p>
      </div>

      {/* Título sección */}
      <div className="px-5 pt-3 pb-2">
        <p className="text-sabana-100 text-xs font-semibold tracking-widest uppercase opacity-60">
          Dashboard ABET
        </p>
      </div>

      {/* Navegación */}
      <nav className="flex-1 px-3 pb-4 space-y-1">
        {NAV_ITEMS.map(item => {
          const active = currentPage === item.id
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                transition-all duration-150 text-left
                ${active
                  ? 'bg-white text-sabana-900 shadow-md'
                  : 'text-white/80 hover:bg-sabana-800 hover:text-white'}
              `}
            >
              <span className={active ? 'text-sabana-800' : 'text-white/70'}>{item.icon}</span>
              {item.label}
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-sabana-800">
        <p className="text-sabana-100 text-xs opacity-50 leading-relaxed">
          Medición ABET<br />
          Ingeniería Industrial<br />
          2025 – 2026
        </p>
      </div>
    </aside>
  )
}
