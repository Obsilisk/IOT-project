import { useState } from 'react'
import { Header } from './components/layout/Header'
import { Sidebar } from './components/layout/Sidebar'
import { useSmartIrrigation } from './hooks/useSmartIrrigation'
import { DashboardPage } from './pages/DashboardPage'
import { DevicesPage } from './pages/DevicesPage'
import { HistoryPage } from './pages/HistoryPage'
import { IrrigationPage } from './pages/IrrigationPage'
import { MonitoringPage } from './pages/MonitoringPage'
import { SettingsPage } from './pages/SettingsPage'
import type { PageId } from './types/irrigation'

function App() {
  const [activePage, setActivePage] = useState<PageId>('dashboard')
  const irrigation = useSmartIrrigation()

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return (
          <DashboardPage
            irrigation={irrigation}
            onNavigateHistory={() => setActivePage('history')}
          />
        )
      case 'monitoring':
        return <MonitoringPage irrigation={irrigation} />
      case 'irrigation':
        return <IrrigationPage irrigation={irrigation} />
      case 'history':
        return <HistoryPage irrigation={irrigation} />
      case 'devices':
        return <DevicesPage irrigation={irrigation} />
      case 'settings':
        return <SettingsPage irrigation={irrigation} />
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 lg:flex">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          device={irrigation.deviceStatus}
          simulationMode={irrigation.settings.simulationMode}
        />
        <main className="min-w-0 flex-1 bg-[#071018] p-4 sm:p-6 lg:p-8">{renderPage()}</main>
      </div>
    </div>
  )
}

export default App
