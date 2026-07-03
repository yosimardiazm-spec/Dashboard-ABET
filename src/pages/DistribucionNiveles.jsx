import { useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, PieChart, Pie,
} from 'recharts'
import { useData } from '../context/DataContext'

const LEVEL_COLORS = {
  1: '#ef4444',
  2: '#f97316',
  3: '#84cc16',
  4: '#16a34a',
}
const LEVEL_LABELS = { 1: 'Bajo', 2: 'En desarrollo', 3: 'Satisfactorio', 4: 'Sobresaliente' }

const StackedTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  const total = payload[0]?.payload?.total ?? 0
  return (
    <div className="bg-white shadow-lg rounded-lg border border-gray-200 p-3 text-xs min-w-[200px]">
      <p className="font-semibold text-gray-800 mb-2 leading-tight">{label}</p>
      {[...payload].reverse().map(p => (
        <div key={p.name} className="flex items-center justify-between gap-3 mt-0.5">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm" style={{backgroundColor: p.fill}}/>
            <span className="text-gray-600">{p.name}</span>
          </span>
          <span className="font-semibold text-gray-700">{Math.round(p.value)}%</span>
        </div>
      ))}
      {total > 0 && (
        <p className="text-gray-400 mt-1.5 pt-1.5 border-t border-gray-100">{total} mediciones totales</p>
      )}
    </div>
  )
}

const DonutChart = ({ data, label, desc }) => {
  const total = data.reduce((s, d) => s + d.value, 0)
  if (total === 0) return null

  const n3 = data.find(d => d.name === 'Nivel 3')?.value || 0
  const n4 = data.find(d => d.name === 'Nivel 4')?.value || 0
  const pct34 = total > 0 ? Math.round(((n3 + n4) / total) * 100) : 0
  const color34 = pct34 >= 75 ? '#16a34a' : pct34 >= 50 ? '#d97706' : '#dc2626'

  return (
    <div className="card flex flex-col items-center p-4">
      <p className="text-sm font-bold text-sabana-800">{label}</p>
      <p className="text-xs text-gray-500 text-center leading-snug mb-1 min-h-[2.5rem]">{desc}</p>
      <p className="text-xs text-gray-300 mb-1">{total} mediciones</p>

      <div className="relative">
        <PieChart width={150} height={140}>
          <Pie
            data={data}
            cx={75} cy={65}
            innerRadius={42} outerRadius={62}
            dataKey="value"
            paddingAngle={2}
            startAngle={90} endAngle={-270}
          >
            {data.map((d, i) => (
              <Cell key={i} fill={d.fill} stroke="white" strokeWidth={2}/>
            ))}
          </Pie>
          <Tooltip
            formatter={(v, n) => [`${v} (${Math.round((v/total)*100)}%)`, n]}
            contentStyle={{ fontSize: 11, borderRadius: 6 }}
          />
        </PieChart>
        {/* % N3+N4 en el centro del donut */}
        <div className="absolute pointer-events-none"
          style={{ top: 65, left: 75, transform: 'translate(-50%, -50%)' }}>
          <div className="text-center">
            <p className="text-xl font-bold leading-none" style={{ color: color34 }}>{pct34}%</p>
            <p className="text-xs font-medium leading-none mt-0.5" style={{ color: color34 }}>N3+N4</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-x-2 gap-y-1 mt-2">
        {data.filter(d => d.value > 0).map(d => (
          <span key={d.name} className="flex items-center gap-1 text-xs text-gray-500">
            <span className="w-2 h-2 rounded-full" style={{backgroundColor: d.fill}}/>
            {d.name.replace('Nivel ', 'N')}: {Math.round((d.value/total)*100)}%
          </span>
        ))}
      </div>
    </div>
  )
}

export default function DistribucionNiveles() {
  const { filteredKpi } = useData()

  // Derivado desde kpi (n_nivel_1..4 por PI), así funciona también sin registros
  const stackedData = useMemo(() => {
    const map = new Map()
    filteredKpi.forEach(row => {
      if (!map.has(row.asignatura)) {
        map.set(row.asignatura, {
          asig:  row.asignatura,
          label: row.asignatura.length > 30 ? row.asignatura.slice(0, 28) + '…' : row.asignatura,
          n1: 0, n2: 0, n3: 0, n4: 0,
        })
      }
      const d = map.get(row.asignatura)
      d.n1 += row.n_nivel_1
      d.n2 += row.n_nivel_2
      d.n3 += row.n_nivel_3
      d.n4 += row.n_nivel_4
    })
    return Array.from(map.values()).map(d => {
      const total = d.n1 + d.n2 + d.n3 + d.n4
      return {
        asig: d.asig, label: d.label, total,
        p1: total > 0 ? (d.n1 / total) * 100 : 0,
        p2: total > 0 ? (d.n2 / total) * 100 : 0,
        p3: total > 0 ? (d.n3 / total) * 100 : 0,
        p4: total > 0 ? (d.n4 / total) * 100 : 0,
      }
    }).sort((a, b) => (b.p3 + b.p4) - (a.p3 + a.p4))
  }, [filteredKpi])

  const donutsBySO = useMemo(() => {
    const soMap = new Map()
    filteredKpi.forEach(row => {
      if (!soMap.has(row.so)) {
        soMap.set(row.so, { so: row.so, desc: row.so_descripcion, 1: 0, 2: 0, 3: 0, 4: 0 })
      }
      const d = soMap.get(row.so)
      d[1] += row.n_nivel_1
      d[2] += row.n_nivel_2
      d[3] += row.n_nivel_3
      d[4] += row.n_nivel_4
    })
    return Array.from(soMap.values())
      .sort((a, b) => a.so.localeCompare(b.so))
      .map(d => ({
        so: d.so,
        desc: d.desc,
        data: [1, 2, 3, 4].map(l => ({
          name: `Nivel ${l}`,
          value: d[l],
          fill: LEVEL_COLORS[l],
        })),
      }))
  }, [filteredKpi])

  if (!filteredKpi.length) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        No hay datos para los filtros seleccionados.
      </div>
    )
  }

  const chartHeight = Math.max(stackedData.length * 34 + 40, 200)

  return (
    <div className="space-y-5">

      {/* Barras apiladas 100% por asignatura */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-semibold text-gray-800">Distribución de Niveles por Asignatura</h2>
            <p className="text-xs text-gray-400 mt-0.5">Distribución porcentual — los que más cumplen aparecen primero</p>
          </div>
          <div className="flex gap-3">
            {[1, 2, 3, 4].map(l => (
              <span key={l} className="flex items-center gap-1.5 text-xs text-gray-500">
                <span className="w-3 h-3 rounded-sm" style={{backgroundColor: LEVEL_COLORS[l]}}/>
                N{l} {LEVEL_LABELS[l]}
              </span>
            ))}
          </div>
        </div>
        <div style={{ height: Math.min(chartHeight, 560), overflowY: stackedData.length > 15 ? 'scroll' : 'visible' }}>
          <ResponsiveContainer width="100%" height={chartHeight}>
            <BarChart
              data={stackedData}
              layout="vertical"
              margin={{ top: 4, right: 12, left: 8, bottom: 4 }}
              barCategoryGap="25%"
            >
              <CartesianGrid horizontal={false} stroke="#f0f0f0"/>
              <XAxis
                type="number" domain={[0, 100]}
                tickFormatter={v => `${v}%`}
                tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false}
              />
              <YAxis
                type="category" dataKey="label" width={170}
                tick={{ fontSize: 10, fill: '#6b7280' }} tickLine={false} axisLine={false}
              />
              <Tooltip content={<StackedTooltip />} cursor={{ fill: '#f8fafc' }}/>
              {[1, 2, 3, 4].map(l => (
                <Bar
                  key={l}
                  dataKey={`p${l}`}
                  name={`Nivel ${l} – ${LEVEL_LABELS[l]}`}
                  stackId="niveles"
                  fill={LEVEL_COLORS[l]}
                  maxBarSize={26}
                  radius={l === 4 ? [0, 4, 4, 0] : l === 1 ? [4, 0, 0, 4] : [0, 0, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Donuts por SO */}
      <div className="card">
        <div className="mb-4">
          <h2 className="font-semibold text-gray-800">Distribución de Niveles por Student Outcome</h2>
          <p className="text-xs text-gray-400 mt-0.5">Proporción de mediciones en cada nivel</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {donutsBySO.map(({ so, desc, data }) => (
            <DonutChart key={so} data={data} label={so} desc={desc}/>
          ))}
        </div>
      </div>

    </div>
  )
}
