import { useState } from 'react'
import { useTrackingContext } from '../contexts/TrackingContext'

export function NavigationPage() {
  const { isConsented } = useTrackingContext()
  const [clickCount, setClickCount] = useState({})

  if (!isConsented) {
    return <section className="panel">Consent is required before using the navigation page.</section>
  }

  const handleNavClick = (itemName) => {
    setClickCount((prev) => ({ ...prev, [itemName]: (prev[itemName] || 0) + 1 }))
  }

  const items = ['Research Overview', 'Participant Guide', 'Privacy Policy', 'Contact Researcher']

  return (
    <section className="space-y-6">
      <div className="panel">
        <p className="eyebrow">Navigation patterns</p>
        <h2 className="mt-2 text-3xl font-semibold text-white">Track decision paths</h2>
        <p className="mt-3 text-slate-300">
          Use these elements to help us understand navigation behaviour.
        </p>
      </div>

      <div className="grid gap-3">
        {items.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => handleNavClick(item)}
            className="panel flex items-center justify-between text-left transition hover:border-cyan-400/30 hover:bg-white/[0.08]"
          >
            <span className="font-medium text-white">{item}</span>
            <span className="text-sm text-slate-400">{clickCount[item] ? clickCount[item] : 0}</span>
          </button>
        ))}
      </div>
    </section>
  )
}
