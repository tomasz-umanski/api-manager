import { ReactNode, useEffect } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Gauge, LogOut, Menu, Plus, ScrollText, Settings, ShieldCheck } from 'lucide-react'
import clsx from 'clsx'
import { Button } from '../ui'
import { useAppStore } from '../../store/AppStore'

const navItems = [
  { to: '/', label: 'Dashboard', icon: Gauge },
  { to: '/contracts', label: 'Contracts', icon: ScrollText },
  { to: '/contracts/new', label: 'New Contract', icon: Plus },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export function AppShell() {
  const { user, logoutUser, bootstrap } = useAppStore()
  const navigate = useNavigate()

  useEffect(() => {
    void bootstrap()
  }, [bootstrap])

  return (
    <div className="min-h-screen bg-canvas text-text md:flex">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-60 flex-col border-r border-line bg-[#141414] md:flex">
        <div className="flex h-[82px] items-center gap-3 px-6">
          <div className="grid h-8 w-8 place-items-center rounded-sm border border-line bg-[#1d1d1d] text-white">
            <ShieldCheck size={17} />
          </div>
          <div>
            <p className="text-base font-extrabold tracking-[-0.06em]">API MANAGER</p>
            <p className="font-mono text-[10px] text-muted">V1.0.4-Stable</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2 px-4 pt-5">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 rounded-tool px-3 py-2.5 text-sm font-bold text-muted transition hover:bg-panelMuted hover:text-white',
                  isActive && 'bg-[#2d2d2d] text-white',
                )
              }
            >
              <item.icon size={17} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="m-4 border-t border-line pt-4">
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => {
              logoutUser()
              navigate('/login')
            }}
          >
            <LogOut size={16} />
            Logout
          </Button>
        </div>
      </aside>

      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-line bg-[#141414] px-4 md:hidden">
        <div className="flex items-center gap-3">
          <div className="grid h-8 w-8 place-items-center rounded-sm border border-line bg-[#1d1d1d]">
            <ShieldCheck size={16} />
          </div>
          <div>
            <p className="text-sm font-extrabold tracking-[-0.05em]">API MANAGER</p>
            <p className="font-mono text-[9px] text-muted">{user?.team}</p>
          </div>
        </div>
        <Menu className="text-muted" size={20} />
      </header>

      <main className="min-h-screen flex-1 md:ml-60">
        <div className="px-4 py-6 sm:px-6 md:px-8">
          <Outlet />
        </div>
        <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-line bg-[#141414] md:hidden">
          {navItems.slice(0, 4).map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => clsx('flex flex-col items-center gap-1 px-2 py-2 text-[10px] font-bold text-muted', isActive && 'text-white')}>
              <item.icon size={16} />
              {item.label.replace(' Contract', '')}
            </NavLink>
          ))}
        </nav>
      </main>
    </div>
  )
}

export function Page({ children }: { children: ReactNode }) {
  return <div className="mx-auto max-w-[1360px] space-y-5 pb-20 md:pb-0">{children}</div>
}
