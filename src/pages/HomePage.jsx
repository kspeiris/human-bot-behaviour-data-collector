import { Link } from 'react-router-dom'
import { useTrackingContext } from '../contexts/TrackingContext'

export function HomePage() {
  const { isConsented, grantConsent } = useTrackingContext()

  const cards = [
    ['Consent-first', 'Users opt in before any upload happens.'],
    ['Typing signals', 'Capture cadence, focus, and edits in forms.'],
    ['Navigation flow', 'Track movement through the app and page paths.'],
    ['Research export', 'Download session rows as CSV for analysis.'],
  ]

  return (
    <section className="space-y-8">
        <div className="panel overflow-hidden bg-gradient-to-br from-white/[0.08] to-cyan-400/10">
        <p className="eyebrow">Research demo</p>
        <h2 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight text-white md:text-5xl">
          Collect behavioural signals with a simple, transparent interface.
        </h2>
        <p className="mt-4 max-w-2xl text-slate-300">
          This scaffold is built for form interaction research, navigation studies, and
          exportable event logs.
        </p>
        {!isConsented ? (
          <button type="button" onClick={grantConsent} className="action-button mt-6">
            Enter demo
          </button>
        ) : (
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/form" className="secondary-button">
              Begin Interaction
            </Link>
            <Link to="/navigation" className="secondary-button">
              Explore Navigation
            </Link>
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map(([title, text]) => (
          <article key={title} className="panel">
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-300">{text}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
