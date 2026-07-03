import { useState } from 'react'
import { DataProvider, useData } from './context/DataContext'
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'
import ResumenGeneral from './pages/ResumenGeneral'
import KPI75 from './pages/KPI75'
import ComparativoAnio from './pages/ComparativoAnio'
import DistribucionNiveles from './pages/DistribucionNiveles'
import Glosario from './pages/Glosario'

const PAGES = {
  resumen:      ResumenGeneral,
  kpi:          KPI75,
  comparativo:  ComparativoAnio,
  distribucion: DistribucionNiveles,
  glosario:     Glosario,
}

function Dashboard() {
  const [currentPage, setCurrentPage] = useState('resumen')
  const { loading, error, data } = useData()
  const PageComponent = PAGES[currentPage]

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-sabana-800 border-t-transparent rounded-full animate-spin mx-auto"/>
          <p className="mt-4 text-gray-500 font-medium">Cargando datos ABET…</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="card max-w-md text-center">
          <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">No se pudo cargar data.json</h2>
          <p className="text-sm text-gray-500 mb-3">{error}</p>
          <p className="text-xs text-gray-400">
            Asegúrate de que el archivo <strong>data.json</strong> esté en la carpeta <strong>public/</strong> del proyecto.<br/>
            Cópialo desde <em>Archivos de Medición/data.json</em> y recarga la página.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage}/>
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar currentPage={currentPage}/>
        <main className="flex-1 overflow-y-auto p-6">
          {data.generado && (
            <p className="text-xs text-gray-400 text-right mb-4">
              Fecha de actualización: <span className="font-medium text-gray-500">{new Date(data.generado).toLocaleString('es-CO')}</span>
            </p>
          )}
          <PageComponent />
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <DataProvider>
      <Dashboard />
    </DataProvider>
  )
}
