const API_URL = import.meta.env.VITE_API_URL || ''

function toCsv(rows) {
  const header = ['sessionId', 'eventType', 'x', 'y', 'value', 'pageUrl', 'timestamp']
  const escapeCell = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`

  return [header.join(','), ...rows.map((row) => [
    row.sessionId,
    row.eventType,
    row.x,
    row.y,
    row.value,
    row.pageUrl,
    row.timestamp,
  ].map(escapeCell).join(','))].join('\n')
}

class EventUploader {
  constructor() {
    this.buffer = []
  }

  async sendEvent(eventData) {
    if (!API_URL) return false

    await fetch(API_URL, {
      method: 'POST',
      mode: 'no-cors',
      body: JSON.stringify(eventData),
    })

    // Apps Script web apps do not expose a readable CORS response.
    // If the request reaches fetch without throwing, treat it as queued/sent.
    return true
  }

  async sendBatch(events) {
    if (!API_URL || events.length === 0) return false
    const results = await Promise.all(events.map((event) => this.sendEvent(event)))
    return results.every(Boolean)
  }

  async exportData() {
    return toCsv(this.buffer)
  }
}

export const eventUploader = new EventUploader()

export const trackEvent = async (sessionId, eventType, x = null, y = null, value = '', pageUrl = '') => {
  const eventData = {
    sessionId,
    eventType,
    x: x !== null ? Number(x) : null,
    y: y !== null ? Number(y) : null,
    value: String(value),
    pageUrl: String(pageUrl),
    timestamp: Date.now(),
  }

  eventUploader.buffer.push(eventData)

  if (eventType === 'session_end' && navigator.sendBeacon && API_URL) {
    const blob = new Blob([JSON.stringify(eventData)], { type: 'application/json' })
    navigator.sendBeacon(API_URL, blob)
    return true
  }

  return eventUploader.sendEvent(eventData)
}
