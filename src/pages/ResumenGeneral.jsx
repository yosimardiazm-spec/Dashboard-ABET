import { useMemo, useCallback } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ResponsiveContainer, Cell, LabelList,
} from 'recharts'
import { useData } from '../context/DataContext'
import StatCard from '../components/StatCard'

const pctColor = (pct) => {
  if (pct >= 0.75) return '#16a34a'
  if (pct >= 0.5)  return '#d97706'
  return '#dc2626'
}

const pctBg = (pct) => {
  if (pct >= 0.75) return '#dcfce7'
  if (pct >= 0.5)  return '#fef3c7'
  return '#fee2e2'
}

const SemaforoTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="bg-white shadow-lg rounded-lg border border-gray-200 p-3 text-sm max-w-xs">
      <p className="font-semibold text-gray-800">{d.so}</p>
      <p className="text-gray-500 text-xs mb-2">{d.desc}</p>
      <p className="font-bold" style={{ color: pctColor(d.pct / 100) }}>
        {d.pct}% estudiantes en niveles 3-4
      </p>
      <p className="text-gray-500 text-xs">{d.pis} PI(s) evaluados</p>
    </div>
  )
}

export default function ResumenGeneral() {
  const { filteredKpi } = useData()

  const stats = useMemo(() => {
    if (!filteredKpi.length) return null
    // Suma de total_estudiantes por PI (puede haber estudiantes en múltiples PIs,
    // pero es la mejor aproximación disponible sin el detalle individual)
    const totalEstudiantes = filteredKpi.reduce((s, r) => s + r.total_estudiantes, 0)
    const asignaturas = new Set(filteredKpi.map(r => r.asignatura)).size
    const pis = filteredKpi.length
    const cumplen = filteredKpi.filter(r => !r.accion_mejora).length
    const mejora   = filteredKpi.filter(r =>  r.accion_mejora).length
    const pctGlobal = Math.round((cumplen / pis) * 100)
    return { totalEstudiantes, asignaturas, pis, cumplen, mejora, pctGlobal }
  }, [filteredKpi])

  const semaforoData = useMemo(() => {
    const map = new Map()
    filteredKpi.forEach(row => {
      if (!map.has(row.so)) {
        map.set(row.so, { so: row.so, desc: row.so_descripcion, sum: 0, count: 0, pis: 0 })
      }
      const d = map.get(row.so)
      d.sum += row.pct_cumple
      d.count += 1
      d.pis += 1
    })
    return Array.from(map.values())
      .map(d => ({ ...d, pct: Math.round((d.sum / d.count) * 100) }))
      .sort((a, b) => b.pct - a.pct)
  }, [filteredKpi])

  // Heatmap: rows = asignaturas, cols = SOs
  const heatmapData = useMemo(() => {
    const soSet  = new Set(filteredKpi.map(r => r.so))
    const asigSet = new Set(filteredKpi.map(r => r.asignatura))
    const sos    = Array.from(soSet).sort()
    const asigs  = Array.from(asigSet).sort()

    const cellMap = {}
    filteredKpi.forEach(row => {
      const key = `${row.asignatura}||${row.so}`
      if (!cellMap[key]) cellMap[key] = { sum: 0, count: 0 }
      cellMap[key].sum += row.pct_cumple
      cellMap[key].count += 1
    })

    return {
      sos,
      rows: asigs.map(asig => ({
        asig,
        label: asig.length > 30 ? asig.slice(0, 28) + '…' : asig,
        cells: sos.map(so => {
          const d = cellMap[`${asig}||${so}`]
          return d ? d.sum / d.count : null
        }),
      })),
    }
  }, [filteredKpi])

  const renderSOTick = useCallback(({ x, y, payload }) => {
    const entry = semaforoData.find(d => d.so === payload.value)
    const desc = entry?.desc || ''
    const shortDesc = desc.length > 38 ? desc.slice(0, 36) + '…' : desc
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={-8} y={-6} textAnchor="end" fill="#002147" fontSize={12} fontWeight={700}>
          {payload.value}
        </text>
        <text x={-8} y={9} textAnchor="end" fill="#6b7280" fontSize={9.5}>
          {shortDesc}
        </text>
      </g>
    )
  }, [semaforoData])

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        No hay datos para los filtros seleccionados.
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* Stat tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard
          label="Evaluaciones registradas"
          value={stats.totalEstudiantes.toLocaleString('es-CO')}
          color="blue"
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>}
        />
        <StatCard
          label="Asignaturas evaluadas"
          value={stats.asignaturas}
          color="default"
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>}
        />
        <StatCard
          label="PIs evaluados"
          value={stats.pis}
          color="default"
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>}
        />
        <StatCard
          label="PIs cumplen meta ≥75%"
          value={`${stats.pctGlobal}%`}
          sub={`${stats.cumplen} de ${stats.pis} PIs`}
          color={stats.pctGlobal >= 75 ? 'green' : stats.pctGlobal >= 50 ? 'yellow' : 'red'}
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>}
        />
        <StatCard
          label="Acción de mejora"
          value={stats.mejora}
          sub={`${stats.pis - stats.cumplen} PI(s) por atender`}
          color={stats.mejora === 0 ? 'green' : 'red'}
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>}
        />
      </div>

      {/* Semáforo por SO */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-semibold text-gray-800">Cumplimiento por Student Outcome</h2>
            <p className="text-xs text-gray-400 mt-0.5">% de PIs con ≥75% de estudiantes en niveles 3-4</p>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-500 inline-block"/>≥75%</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-yellow-500 inline-block"/>50-75%</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-500 inline-block"/>&lt;50%</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={semaforoData.length * 64 + 40}>
          <BarChart
            data={semaforoData}
            layout="vertical"
            margin={{ top: 4, right: 60, left: 8, bottom: 4 }}
          >
            <CartesianGrid horizontal={false} stroke="#f0f0f0"/>
            <XAxis
              type="number" domain={[0, 100]} tickFormatter={v => `${v}%`}
              tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false}
            />
            <YAxis
              type="category" dataKey="so" width={220}
              tick={renderSOTick} tickLine={false} axisLine={false}
            />
            <Tooltip content={<SemaforoTooltip />} cursor={{ fill: '#f8fafc' }}/>
            <ReferenceLine x={75} stroke="#1f4e79" strokeDasharray="4 3" strokeWidth={1.5}
              label={{ value: '75%', position: 'insideTopRight', fontSize: 10, fill: '#1f4e79', dy: -4 }}/>
            <Bar dataKey="pct" radius={[0, 6, 6, 0]} maxBarSize={28}>
              {semaforoData.map((d, i) => (
                <Cell key={i} fill={pctColor(d.pct / 100)}/>
              ))}
              <LabelList dataKey="pct" position="right" formatter={v => `${v}%`}
                style={{ fontSize: 11, fill: '#374151', fontWeight: 600 }}/>
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Mapa de calor SO × Asignatura */}
      <div className="card">
        <div className="mb-4">
          <h2 className="font-semibold text-gray-800">Mapa de calor – Asignatura × Student Outcome</h2>
          <p className="text-xs text-gray-400 mt-0.5">Promedio de % estudiantes en niveles 3-4</p>
        </div>
        <div className="overflow-x-auto">
          <table className="text-xs w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left text-gray-500 font-medium py-2 pr-3 whitespace-nowrap min-w-[180px]">
                  Asignatura
                </th>
                {heatmapData.sos.map(so => (
                  <th key={so} className="text-center text-sabana-800 font-bold py-2 px-2 min-w-[60px]">{so}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {heatmapData.rows.map(({ asig, label, cells }) => (
                <tr key={asig} className="hover:bg-gray-50">
                  <td className="py-1.5 pr-3 text-gray-600 font-medium whitespace-nowrap" title={asig}>{label}</td>
                  {cells.map((val, ci) => (
                    <td key={ci} className="py-1 px-1 text-center">
                      {val !== null ? (
                        <span
                          className="inline-block w-full rounded px-1 py-0.5 font-semibold text-xs"
                          style={{ backgroundColor: pctBg(val), color: pctColor(val) }}
                        >
                          {Math.round(val * 100)}%
                        </span>
                      ) : (
                        <span className="text-gray-200">–</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-100 text-xs text-gray-500">
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-8 h-3 rounded" style={{backgroundColor:'#dcfce7'}}/>
            ≥75% (cumple)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-8 h-3 rounded" style={{backgroundColor:'#fef3c7'}}/>
            50-74%
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-8 h-3 rounded" style={{backgroundColor:'#fee2e2'}}/>
            &lt;50%
          </span>
          <span className="ml-auto text-gray-300">– sin datos</span>
        </div>
      </div>
    </div>
  )
}
