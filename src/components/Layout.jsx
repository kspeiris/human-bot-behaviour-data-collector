import { Link, useLocation } from 'react-router-dom'
import { useTrackingContext } from '../contexts/TrackingContext'

export function Layout({ children }) {
  const location = useLocation()
  const { isConsented } = useTrackingContext()

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/form', label: 'Form' },
    { path: '/navigation', label: 'Navigation' },
    { path: '/export', label: 'Export' },
  ]

  return (
    <div className="app-shell">
      <header className="site-header">
        <div>
          <p className="eyebrow">Behavioural Data Collection</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">Behavioural Research</h1>
        </div>
        <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
          {isConsented ? 'Tracking active' : 'Consent not given'}
        </div>
      </header>

      <nav className="site-nav">
        {navItems.map((item) => {
          const active = location.pathname === item.path
          return (
            <Link key={item.path} to={item.path} className={`nav-link ${active ? 'nav-link-active' : ''}`}>
              {item.label}
            </Link>
          )
        })}
      </nav>

      <main className="site-main">{children}</main>
      <footer className="site-footer">Academic research project</footer>
    </div>
  )
}
