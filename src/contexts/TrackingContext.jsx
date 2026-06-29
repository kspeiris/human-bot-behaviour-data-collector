import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { createSession, getSession, saveSession, clearSession } from '../utils/session'
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
  const [session, setSession] = useState(null)
  const [isConsented, setIsConsented] = useState(false)
  const [isTrackingActive, setIsTrackingActive] = useState(false)

  const initializeSession = useCallback(async () => {
    let currentSession = getSession()
    if (!currentSession) {
      currentSession = createSession()
      saveSession(currentSession)
    }
    setSession(currentSession)
    setIsTrackingActive(true)
    await trackEvent(currentSession, 'session_start')
    return currentSession
  }, [])

  const grantConsent = useCallback(async () => {
    setIsConsented(true)
    localStorage.setItem('behavioural_consent', 'true')
    await initializeSession()
  }, [initializeSession])

  const revokeConsent = useCallback(() => {
    if (session?.sessionId) {
      trackEvent(session, 'session_end')
    }
    setIsConsented(false)
    setIsTrackingActive(false)
    setSession(null)
    localStorage.removeItem('behavioural_consent')
    clearSession()
  }, [session])

  useEffect(() => {
    const hasConsented = localStorage.getItem('behavioural_consent') === 'true'
    if (hasConsented) {
      grantConsent()
    }
  }, [grantConsent])

  const value = useMemo(
    () => ({
      session,
      isConsented,
      isTrackingActive,
      grantConsent,
      revokeConsent,
    }),
    [session, isConsented, isTrackingActive, grantConsent, revokeConsent],
  )

  return <TrackingContext.Provider value={value}>{children}</TrackingContext.Provider>
}
