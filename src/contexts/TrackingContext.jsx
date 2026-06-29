import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { trackEvent } from '../services/api'

const TrackingContext = createContext(null)

export function useTrackingContext() {
  const context = useContext(TrackingContext)
  if (!context) {
    throw new Error('useTrackingContext must be used within TrackingProvider')
  }
  return context
}

export function TrackingProvider({ children }) {
  const [sessionId, setSessionId] = useState(null)
  const [isConsented, setIsConsented] = useState(false)
  const [isTrackingActive, setIsTrackingActive] = useState(false)

  const initializeSession = useCallback(async () => {
    const newSessionId = uuidv4()
    setSessionId(newSessionId)
    setIsTrackingActive(true)
    await trackEvent(newSessionId, 'session_start', null, null, '', window.location.pathname)
    return newSessionId
  }, [])

  const grantConsent = useCallback(async () => {
    setIsConsented(true)
    localStorage.setItem('behavioural_consent', 'true')
    await initializeSession()
  }, [initializeSession])

  const revokeConsent = useCallback(() => {
    if (sessionId) {
      trackEvent(sessionId, 'session_end', null, null, '', window.location.pathname)
    }
    setIsConsented(false)
    setIsTrackingActive(false)
    setSessionId(null)
    localStorage.removeItem('behavioural_consent')
  }, [sessionId])

  useEffect(() => {
    const hasConsented = localStorage.getItem('behavioural_consent') === 'true'
    if (hasConsented) {
      grantConsent()
    }
  }, [grantConsent])

  const value = useMemo(
    () => ({
      sessionId,
      isConsented,
      isTrackingActive,
      grantConsent,
      revokeConsent,
    }),
    [sessionId, isConsented, isTrackingActive, grantConsent, revokeConsent],
  )

  return <TrackingContext.Provider value={value}>{children}</TrackingContext.Provider>
}
