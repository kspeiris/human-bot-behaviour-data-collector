import { useState } from 'react'
import { useTrackingContext } from '../contexts/TrackingContext'

export function FormPage() {
  const { isConsented } = useTrackingContext()
  const [formData, setFormData] = useState({ name: '', feedback: '' })
  const [isSubmitted, setIsSubmitted] = useState(false)

  if (!isConsented) {
    return <section className="panel">Consent is required before using the form.</section>
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitted(true)
    setTimeout(() => setIsSubmitted(false), 2500)
    setFormData({ name: '', feedback: '' })
  }

  return (
    <section className="panel space-y-6">
      <div>
        <p className="eyebrow">Interactive form</p>
        <h2 className="mt-2 text-3xl font-semibold text-white">Capture typing behaviour</h2>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4">
        <label className="space-y-2">
          <span className="label">Name</span>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="field"
            placeholder="Enter your name or leave blank"
          />
        </label>

        <label className="space-y-2">
          <span className="label">Feedback</span>
          <textarea
            name="feedback"
            value={formData.feedback}
            onChange={handleChange}
            rows={5}
            className="field"
            placeholder="Share your thoughts about this research or any feedback..."
          />
        </label>

        <button type="submit" className="action-button justify-self-start">
          Submit Feedback
        </button>
      </form>

      {isSubmitted ? <p className="text-emerald-300">Thank you for your contribution.</p> : null}
    </section>
  )
}
