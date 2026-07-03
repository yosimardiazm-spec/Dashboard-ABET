import { useMemo, useCallback } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ResponsiveContainer,
} from 'recharts'
import { useData } from '../context/DataContext'

const YEAR_COLORS = { 2025: '#003B5C', 2026: '#e59a00' }

const CompTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  const desc = payload[0]?.payload?.desc
  return (
    <div className="bg-white shadow-lg rounded-lg border border-gray-200 p-3 text-xs min-w-[200px]">
      <p className="font-bold text-sabana-800 mb-0.5">{label}</p>
      {desc && <p className="text-gray-400 text-xs mb-2 leading-snug">{desc}</p>}
      {payload.map(p => (
        <div key={p.name} className="flex items-center justify-between gap-3 mt-1">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: p.fill }}/>
            <span className="text-gray-600">{p.name}</span>
          </span>
          <span className="font-bold" style={{ color: p.fill }}>
            {p.value !== null ? `${Math.round(p.value)}%` : '–'}
          </span>
        </div>
      ))}
    </div>
  )
}

export default function ComparativoAnio() {
  const { filteredKpi, data } = useData()

  const chartData = useMemo(() => {
    const soMap = new Map()
    filteredKpi.forEach(row => {
      if (!soMap.has(row.so)) {
        soMap.set(row.so, { so: row.so, desc: row.so_descripcion, byYear: {} })
      }
      const d = soMap.get(row.so)
      if (!d.byYear[row.año]) d.byYear[row.año] = { sum: 0, count: 0 }
      d.byYear[row.año].sum += row.pct_cumple
      d.byYear[row.año].count += 1
    })

    return Array.from(soMap.values())
      .map(d => {
        const entry = { so: d.so, desc: d.desc }
        data.años.forEach(y => {
          entry[y] = d.byYear[y] ? Math.round((d.byYear[y].sum / d.byYear[y].count) * 100) : null
        })
        return entry
      })
      .sort((a, b) => a.so.localeCompare(b.so))
  }, [filteredKpi, data.años])

  const renderSOTick = useCallback(({ x, y, payload }) => {
    const entry = chartData.find(d => d.so === payload.value)
    const desc = entry?.desc || ''
    const short = desc.length > 40 ? desc.slice(0, 38) + '…' : desc
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={-8} y={-6} textAnchor="end" fill="#002147" fontSize={12} fontWeight={700}>
          {payload.value}
        </text>
        <text x={-8} y={9} textAnchor="end" fill="#6b7280" fontSize={9.5}>
          {short}
        </text>
      </g>
    )
  }, [chartData])

  const tableData = useMemo(() => {
    const years = data.años
    return chartData.map(row => {
      const vals = years.map(y => row[y])
      let delta = null
      if (vals.length >= 2 && vals[0] !== null && vals[vals.length - 1] !== null) {
        delta = vals[vals.length - 1] - vals[0]
      }
      return { ...row, delta }
    })
  }, [chartData, data.años])

  if (!filteredKpi.length) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        No hay datos para los filtros seleccionados.
      </div>
    )
  }

  const hasMultipleYears = data.años.length > 1
  const rowHeight = data.años.length > 1 ? 56 : 40
  const chartHeight = chartData.length * rowHeight + 40

  return (
    <div className="space-y-5">

      {/* Gráfico horizontal con descripción */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-semibold text-gray-800">% Cumplimiento por Student Outcome y Año</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Promedio de % de estudiantes en niveles 3-4 · Los que más cumplen aparecen primero
            </p>
          </div>
          <div className="flex gap-3">
            {data.años.map(y => (
              <span key={y} className="flex items-center gap-1.5 text-xs text-gray-500">
                <span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: YEAR_COLORS[y] || '#8b5cf6' }}/>
                {y}
              </span>
            ))}
          </div>
        </div>

        <ResponsiveContainer width="100%" height={chartHeight}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 4, right: 60, left: 8, bottom: 4 }}
            barCategoryGap="25%"
            barGap={3}
          >
            <CartesianGrid horizontal={false} stroke="#f0f0f0"/>
            <XAxis
              type="number" domain={[0, 100]}
              tickFormatter={v => `${v}%`}
              tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false}
            />
            <YAxis
              type="category" dataKey="so" width={240}
              tick={renderSOTick} tickLine={false} axisLine={false}
            />
            <Tooltip content={<CompTooltip />} cursor={{ fill: '#f8fafc' }}/>
            <ReferenceLine x={75} stroke="#003B5C" strokeDasharray="4 3" strokeWidth={1.5}
              label={{ value: 'Meta 75%', position: 'insideTopRight', fontSize: 10, fill: '#003B5C', dy: -4 }}/>
            {data.años.map(year => (
              <Bar
                key={year}
                dataKey={year}
                name={String(year)}
                fill={YEAR_COLORS[year] || '#8b5cf6'}
                radius={[0, 4, 4, 0]}
                maxBarSize={22}
                label={{
                  position: 'right',
                  formatter: v => v !== null ? `${v}%` : '',
                  fontSize: 10,
                  fill: '#6b7280',
                }}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Tabla comparativa con delta */}
      {hasMultipleYears && (
        <div className="card">
          <div className="mb-3">
            <h2 className="font-semibold text-gray-800">Tabla comparativa</h2>
            <p className="text-xs text-gray-400">Variación entre {data.años[0]} y {data.años[data.años.length - 1]}</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500">SO</th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500">Descripción</th>
                  {data.años.map(y => (
                    <th key={y} className="text-center py-2 px-3 text-xs font-semibold text-gray-500">{y}</th>
                  ))}
                  <th className="text-center py-2 px-3 text-xs font-semibold text-gray-500">Δ Variación</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {tableData.map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="py-2.5 px-3 font-bold text-sabana-800 whitespace-nowrap">{row.so}</td>
                    <td className="py-2.5 px-3 text-gray-600 text-xs">{row.desc}</td>
                    {data.años.map(y => (
                      <td key={y} className="py-2.5 px-3 text-center whitespace-nowrap">
                        {row[y] !== null ? (
                          <span className="font-semibold" style={{
                            color: row[y] >= 75 ? '#16a34a' : row[y] >= 50 ? '#d97706' : '#dc2626',
                          }}>
                            {row[y]}%
                          </span>
                        ) : <span className="text-gray-300">–</span>}
                      </td>
                    ))}
                    <td className="py-2.5 px-3 text-center">
                      {row.delta !== null ? (
                        <span className={`font-bold flex items-center justify-center gap-0.5
                          ${row.delta > 0 ? 'text-green-600' : row.delta < 0 ? 'text-red-600' : 'text-gray-400'}`}>
                          {row.delta > 0 ? '↑' : row.delta < 0 ? '↓' : '→'}
                          {Math.abs(row.delta)}pp
                        </span>
                      ) : <span className="text-gray-300">–</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!hasMultipleYears && (
        <div className="card bg-blue-50 border-blue-100">
          <p className="text-sm text-blue-600 font-medium">
            La comparación entre años requiere tener ambos años activos. Selecciona "Todos los periodos" en el filtro de Año para ver la comparativa completa.
          </p>
        </div>
      )}
    </div>
  )
}
