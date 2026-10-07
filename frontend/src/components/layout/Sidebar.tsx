import {
  BarChart3,
  Cpu,
  Gauge,
  History,
  LayoutDashboard,
  Settings,
  Sprout,
} from 'lucide-react'
import type { PageId } from '../../types/irrigation'
import { cn } from '../../utils/cn'

interface SidebarProps {
  activePage: PageId
  onNavigate: (page: PageId) => void
}

const navItems: Array<{ id: PageId; label: string; icon: typeof LayoutDashboard }> = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'monitoring', label: 'Monitoring', icon: BarChart3 },
  { id: 'irrigation', label: 'Irrigation', icon: Gauge },
  { id: 'history', label: 'History', icon: History },
  { id: 'devices', label: 'Devices', icon: Cpu },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export function Sidebar({ activePage, onNavigate }: SidebarProps) {
  return (
    <aside className="border-b border-slate-800 bg-slate-950 px-4 py-4 lg:min-h-screen lg:w-72 lg:border-b-0 lg:border-r lg:px-5">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-emerald-400/15 p-2 text-emerald-300 ring-1 ring-emerald-400/25">
          <Sprout className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Smart Irrigation</p>
          <p className="text-xs text-slate-500">IoT Dashboard</p>
        </div>
      </div>

      <nav className="mt-6 flex gap-2 overflow-x-auto pb-1 lg:block lg:space-y-2 lg:overflow-visible lg:pb-0">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = activePage === item.id

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={cn(
                'inline-flex min-w-max items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold transition lg:w-full',
                active
                  ? 'bg-emerald-400 text-slate-950'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-white',
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
