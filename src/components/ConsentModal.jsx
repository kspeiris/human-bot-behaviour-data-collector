export function ConsentModal({ onConsent, isOpen }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-slate-950/40">
        <p className="eyebrow">Privacy notice</p>
        <h2 className="mt-2 text-2xl font-semibold text-white">Research Consent</h2>
        <p className="mt-4 text-sm leading-6 text-slate-300">
          This study collects anonymous behavioural interaction data such as clicks, typing,
          scrolling, and navigation events.
        </p>
        <ul className="mt-4 space-y-2 text-sm text-slate-300">
          <li>No personal identifiers are collected</li>
          <li>Each session uses a random ID</li>
          <li>You can withdraw by closing the browser</li>
        </ul>
        <div className="mt-6 flex justify-end">
          <button type="button" onClick={onConsent} className="action-button">
            I Consent
          </button>
        </div>
      </div>
    </div>
  )
}
