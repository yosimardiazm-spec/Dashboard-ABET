import { createContext, useContext, useState, useEffect, useMemo } from 'react'

const DataContext = createContext(null)

const ASIGNATURAS_MAP = {
  'Práctica en Estrategias de mejora': 'Práctica en Estrategias de Mejora',
  'Practica en Estrategias de Mejora': 'Práctica en Estrategias de Mejora',
  'Practica en Estrategias de mejora': 'Práctica en Estrategias de Mejora',
}

const PROFESORES_MAP = {
  'Adrian Santana':                 'Adrian Alberto Santana Alfonso',
  'Santana Alfonso Adrian Alberto': 'Adrian Alberto Santana Alfonso',
  'Andrés Cardona':                 'Andrés Felipe Cardona Ortegón',
  'Andres Cardona':                 'Andrés Felipe Cardona Ortegón',
  'Luis Alfredo Paipa':             'Luis Alfredo Paipa Galeano',
  'Luis Mauricio Agudelo':          'Luis Mauricio Agudelo Otálora',
  'Yosimar Díaz':                   'Yosimar Díaz Monterroza',
  'Yosimar Diaz':                   'Yosimar Díaz Monterroza',
}

const normalizarRow = (row) => ({
  ...row,
  asignatura: ASIGNATURAS_MAP[row.asignatura] ?? row.asignatura,
  profesor:   PROFESORES_MAP[row.profesor]    ?? row.profesor,
})

export function DataProvider({ children }) {
  const [data, setData] = useState({ registros: [], kpi: [], años: [], generado: '' })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [filters, setFilters] = useState({
    años: [],
    sos: [],
    tipoMedicion: null,
    asignatura: null,
  })

  useEffect(() => {
    // Intenta cargar data_public.json (GitHub Pages); si no existe, usa data.json (local)
    const tryFetch = (url) =>
      fetch(url).then(r => { if (!r.ok) throw new Error(r.status); return r.json() })

    tryFetch('./data_public.json')
      .catch(() => tryFetch('./data.json'))
      .then(d => {
        setData({
          ...d,
          registros: (d.registros || []).map(normalizarRow),
          kpi:       (d.kpi       || []).map(normalizarRow),
        })
        setLoading(false)
      })
      .catch(e => { setError(e.message); setLoading(false) })
  }, [])

  const filteredKpi = useMemo(() => {
    return data.kpi.filter(row => {
      if (filters.años.length > 0 && !filters.años.includes(row.año)) return false
      if (filters.sos.length > 0 && !filters.sos.includes(row.so)) return false
      if (filters.tipoMedicion && row.tipo_medicion !== filters.tipoMedicion) return false
      if (filters.asignatura && row.asignatura !== filters.asignatura) return false
      return true
    })
  }, [data.kpi, filters])

  const filteredRegistros = useMemo(() => {
    return data.registros.filter(row => {
      if (filters.años.length > 0 && !filters.años.includes(row.año)) return false
      if (filters.sos.length > 0 && !filters.sos.includes(row.so)) return false
      if (filters.tipoMedicion && row.tipo_medicion !== filters.tipoMedicion) return false
      if (filters.asignatura && row.asignatura !== filters.asignatura) return false
      return true
    })
  }, [data.registros, filters])

  const allYears = data.años

  const allSOs = useMemo(() => {
    const seen = new Map()
    data.kpi.forEach(r => { if (!seen.has(r.so)) seen.set(r.so, r.so_descripcion) })
    return Array.from(seen.entries())
      .map(([so, desc]) => ({ so, desc }))
      .sort((a, b) => a.so.localeCompare(b.so))
  }, [data.kpi])

  const allAsignaturas = useMemo(() => {
    const set = new Set(data.kpi.map(r => r.asignatura))
    return Array.from(set).sort()
  }, [data.kpi])

  const toggleYear = (year) => {
    setFilters(f => ({
      ...f,
      años: f.años.includes(year) ? f.años.filter(y => y !== year) : [...f.años, year],
    }))
  }

  const toggleSO = (so) => {
    setFilters(f => ({
      ...f,
      sos: f.sos.includes(so) ? f.sos.filter(s => s !== so) : [...f.sos, so],
    }))
  }

  const setSO = (so) => {
    setFilters(f => ({ ...f, sos: so ? [so] : [] }))
  }

  const setAño = (año) => {
    setFilters(f => ({ ...f, años: año ? [Number(año)] : [] }))
  }

  const setTipoMedicion = (tipo) => {
    setFilters(f => ({ ...f, tipoMedicion: f.tipoMedicion === tipo ? null : tipo }))
  }

  const setAsignatura = (asig) => {
    setFilters(f => ({ ...f, asignatura: asig === '' ? null : asig }))
  }

  const clearFilters = () => setFilters({ años: [], sos: [], tipoMedicion: null, asignatura: null })

  const hasActiveFilters = filters.años.length > 0 || filters.sos.length > 0 ||
    filters.tipoMedicion !== null || filters.asignatura !== null

  return (
    <DataContext.Provider value={{
      data, loading, error,
      filteredKpi, filteredRegistros,
      filters, allYears, allSOs, allAsignaturas,
      toggleYear, toggleSO, setTipoMedicion, setAsignatura,
      setSO, setAño, clearFilters, hasActiveFilters,
    }}>
      {children}
    </DataContext.Provider>
  )
}

export const useData = () => useContext(DataContext)
