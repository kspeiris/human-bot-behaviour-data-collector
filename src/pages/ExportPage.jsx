import { useTrackingContext } from '../contexts/TrackingContext'
import { ExportButton } from '../components/ExportButton'
import { eventUploader } from '../services/api'

export function ExportPage() {
  const { isConsented } = useTrackingContext()

  const handleExport = async () => {
    const csvData = await eventUploader.exportData()
    const blob = new Blob([csvData], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `behavioural_data_${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <section className="space-y-6">
      <div className="panel">
        <p className="eyebrow">Data export</p>
        <h2 className="mt-2 text-3xl font-semibold text-white">Export behavioural data</h2>
        <p className="mt-3 text-slate-300">
          Download collected behavioural events in CSV format.
        </p>
      </div>

      <div className="panel space-y-4">
        <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-sm text-slate-300">
          Export specifications: session ID, event type, x/y coordinates, value, page URL, and
          timestamp.
        </div>

        <ExportButton className="px-8 py-3 text-base" onClick={handleExport} />

        {!isConsented ? (
          <p className="text-sm text-slate-400">
            No data has been collected yet. Please accept consent and interact with the app first.
          </p>
        ) : null}
      </div>
    </section>
  )
}
