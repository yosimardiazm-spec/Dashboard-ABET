import { useMemo, useState, useCallback } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ResponsiveContainer, Cell,
} from 'recharts'
import { useData } from '../context/DataContext'

const pctColor = (pct) => {
  if (pct >= 0.75) return '#16a34a'
  if (pct >= 0.5)  return '#d97706'
  return '#dc2626'
}

const KpiTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="bg-white shadow-lg rounded-lg border border-gray-200 p-3 text-xs max-w-sm">
      <p className="font-semibold text-gray-800 mb-0.5">{d.asignatura}</p>
      <p className="text-gray-500 mb-0.5">{d.so} · {d.pi_codigo}</p>
      <p className="text-gray-400 text-xs mb-1 leading-snug">{d.pi_descripcion}</p>
      <p className="text-gray-500">Año: {d.año} · {d.tipo}</p>
      <div className="mt-1.5 flex items-center gap-2">
        <span className="font-bold text-base" style={{ color: pctColor(d.pct) }}>
          {Math.round(d.pct * 100)}%
        </span>
        <span className="text-gray-400">estudiantes en niveles 3-4</span>
      </div>
      <p className="text-gray-400 mt-0.5">{d.total} estudiantes</p>
    </div>
  )
}

export default function KPI75() {
  const { filteredKpi } = useData()
  const [statusFilter, setStatusFilter] = useState('todos')
  const [page, setPage] = useState(1)
  const [sortKey, setSortKey] = useState('año')
  const [sortDir, setSortDir] = useState(1)
  const PER_PAGE = 20

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d * -1)
    else { setSortKey(key); setSortDir(1) }
    setPage(1)
  }

  const baseFiltered = useMemo(() => {
    return filteredKpi.filter(r => {
      if (statusFilter === 'cumple') return !r.accion_mejora
      if (statusFilter === 'mejora') return  r.accion_mejora
      return true
    })
  }, [filteredKpi, statusFilter])

  const chartData = useMemo(() => {
    return [...baseFiltered]
      .map(r => ({
        label: r.pi_codigo,
        asignatura: r.asignatura,
        so: r.so,
        pi_codigo: r.pi_codigo,
        pi_descripcion: r.pi_descripcion,
        tipo: r.tipo_medicion,
        año: r.año,
        pct: r.pct_cumple,
        total: r.total_estudiantes,
      }))
      .sort((a, b) => b.pct - a.pct)
  }, [baseFiltered])

  const renderPITick = useCallback(({ x, y, payload }) => {
    const entry = chartData.find(d => d.label === payload.value)
    const desc = entry?.pi_descripcion || ''
    const short = desc.length > 48 ? desc.slice(0, 46) + '…' : desc
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={-8} y={-6} textAnchor="end" fill="#002147" fontSize={11} fontWeight={700}>
          {payload.value}
        </text>
        <text x={-8} y={8} textAnchor="end" fill="#6b7280" fontSize={9}>
          {short}
        </text>
      </g>
    )
  }, [chartData])

  const tableData = useMemo(() => {
    return [...baseFiltered].sort((a, b) => {
      let va, vb
      if      (sortKey === 'año')       { va = a.año;              vb = b.año }
      else if (sortKey === 'asignatura'){ va = a.asignatura;       vb = b.asignatura }
      else if (sortKey === 'so')        { va = a.so;               vb = b.so }
      else if (sortKey === 'pi')        { va = a.pi_codigo;        vb = b.pi_codigo }
      else if (sortKey === 'tipo')      { va = a.tipo_medicion;    vb = b.tipo_medicion }
      else if (sortKey === 'pct')       { va = a.pct_cumple;       vb = b.pct_cumple }
      else if (sortKey === 'total')     { va = a.total_estudiantes;vb = b.total_estudiantes }
      else                              { va = a.año;              vb = b.año }
      if (va < vb) return -sortDir
      if (va > vb) return  sortDir
      return 0
    })
  }, [baseFiltered, sortKey, sortDir])

  const totalPages = Math.ceil(tableData.length / PER_PAGE)
  const pageData = tableData.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const STATUS_OPTS = [
    { id: 'todos',  label: 'Todos',              count: filteredKpi.length },
    { id: 'cumple', label: '✓ Cumplen',          count: filteredKpi.filter(r => !r.accion_mejora).length },
    { id: 'mejora', label: '⚠ Acción de mejora', count: filteredKpi.filter(r =>  r.accion_mejora).length },
  ]

  const SortTh = ({ colKey, children }) => (
    <th
      className="text-left py-2 px-3 text-xs font-semibold text-gray-500 whitespace-nowrap cursor-pointer hover:text-sabana-800 select-none"
      onClick={() => handleSort(colKey)}
    >
      {children}
      <span className="ml-1 text-gray-300">
        {sortKey === colKey ? (sortDir === 1 ? '▲' : '▼') : '⇅'}
      </span>
    </th>
  )

  if (!filteredKpi.length) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        No hay datos para los filtros seleccionados.
      </div>
    )
  }

  return (
    <div className="space-y-5">

      {/* Chips de estado */}
      <div className="flex items-center gap-2 flex-wrap">
        {STATUS_OPTS.map(opt => (
          <button
            key={opt.id}
            onClick={() => { setStatusFilter(opt.id); setPage(1) }}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold shadow-sm transition-all
              ${statusFilter === opt.id
                ? 'bg-sabana-800 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-sabana-700'}`}
          >
            {opt.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full
              ${statusFilter === opt.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
              {opt.count}
            </span>
          </button>
        ))}
      </div>

      {/* Gráfico */}
      <div className="card">
        <div className="mb-3">
          <h2 className="font-semibold text-gray-800">% Cumplimiento por PI y Asignatura</h2>
          <p className="text-xs text-gray-400">Los que cumplen ≥75% aparecen primero — línea de meta en 75%</p>
        </div>
        <div style={{ height: Math.min(chartData.length * 40 + 50, 600), overflowY: chartData.length > 14 ? 'scroll' : 'visible' }}>
          <ResponsiveContainer width="100%" height={Math.max(chartData.length * 40 + 20, 200)}>
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 4, right: 70, left: 8, bottom: 4 }}
            >
              <CartesianGrid horizontal={false} stroke="#f0f0f0"/>
              <XAxis
                type="number" domain={[0, 1]}
                tickFormatter={v => `${Math.round(v * 100)}%`}
                tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false}
              />
              <YAxis
                type="category" dataKey="label" width={250}
                tick={renderPITick} tickLine={false} axisLine={false}
              />
              <Tooltip content={<KpiTooltip />} cursor={{ fill: '#f8fafc' }}/>
              <ReferenceLine x={0.75} stroke="#003B5C" strokeDasharray="4 3" strokeWidth={1.5}
                label={{ value: '75%', position: 'insideTopRight', fontSize: 10, fill: '#003B5C', dy: -4 }}/>
              <Bar dataKey="pct" radius={[0, 5, 5, 0]} maxBarSize={26}
                label={{ position: 'right', formatter: v => `${Math.round(v * 100)}%`, fontSize: 10, fill: '#6b7280' }}
              >
                {chartData.map((d, i) => (
                  <Cell key={i} fill={pctColor(d.pct)}/>
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabla */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-gray-800">Detalle por PI</h2>
          <span className="text-xs text-gray-400">{tableData.length} registros</span>
        </div>
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="border-b border-gray-200">
              <SortTh colKey="año">Año</SortTh>
              <SortTh colKey="asignatura">Asignatura</SortTh>
              <SortTh colKey="so">SO</SortTh>
              <SortTh colKey="pi">PI</SortTh>
              <th className="text-left py-2 px-2 text-xs font-semibold text-gray-500 whitespace-nowrap">Profesor</th>
              <SortTh colKey="tipo">Tipo</SortTh>
              <SortTh colKey="total">Est.</SortTh>
              <SortTh colKey="pct">% N3-4</SortTh>
              <th className="text-left py-2 px-2 text-xs font-semibold text-gray-500 whitespace-nowrap">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {pageData.map((row, i) => {
              const pct = Math.round(row.pct_cumple * 100)
              const cumple = !row.accion_mejora
              const soDesc = row.so_descripcion?.length > 24
                ? row.so_descripcion.slice(0, 22) + '…' : row.so_descripcion
              const piDesc = row.pi_descripcion?.length > 35
                ? row.pi_descripcion.slice(0, 33) + '…' : row.pi_descripcion
              return (
                <tr key={i} className={`hover:bg-gray-50 ${cumple ? 'bg-green-50/30' : 'bg-red-50/30'}`}>
                  <td className="py-2 px-2 text-gray-500 whitespace-nowrap">{row.año}</td>
                  <td className="py-2 px-2 text-gray-700 font-medium max-w-[120px] truncate" title={row.asignatura}>{row.asignatura}</td>
                  <td className="py-2 px-2" title={row.so_descripcion}>
                    <p className="font-bold text-sabana-800">{row.so}</p>
                    <p className="text-gray-400 leading-snug">{soDesc}</p>
                  </td>
                  <td className="py-2 px-2 max-w-[160px]" title={row.pi_descripcion}>
                    <p className="font-mono font-semibold text-gray-700">{row.pi_codigo}</p>
                    <p className="text-gray-400 leading-snug">{piDesc}</p>
                  </td>
                  <td className="py-2 px-2 text-gray-600">{row.profesor}</td>
                  <td className="py-2 px-2 text-gray-500 whitespace-nowrap">{row.tipo_medicion}</td>
                  <td className="py-2 px-2 text-center text-gray-600">{row.total_estudiantes}</td>
                  <td className="py-2 px-2 text-center">
                    <span className="font-bold" style={{ color: pctColor(row.pct_cumple) }}>{pct}%</span>
                  </td>
                  <td className="py-2 px-2">
                    <span className={`px-2 py-0.5 rounded-full font-semibold whitespace-nowrap
                      ${cumple ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {cumple ? '✓ Cumple' : '⚠ Mejora'}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
            <span className="text-xs text-gray-400">Página {page} de {totalPages}</span>
            <div className="flex gap-1">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="px-3 py-1 text-xs rounded border border-gray-200 hover:bg-gray-50 disabled:opacity-30">Anterior</button>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="px-3 py-1 text-xs rounded border border-gray-200 hover:bg-gray-50 disabled:opacity-30">Siguiente</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
