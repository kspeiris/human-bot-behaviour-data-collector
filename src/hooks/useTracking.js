import { useCallback, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { trackEvent } from '../services/api'

const THROTTLE_MS = 100
const SCROLL_THROTTLE_MS = 150

export function useTracking(sessionId, isActive) {
  const location = useLocation()
  const lastMouseMoveRef = useRef(0)
  const lastScrollRef = useRef(0)
  const previousPageRef = useRef(location.pathname)
  const lastScrollYRef = useRef(0)

  const handleMouseMove = useCallback(
    (e) => {
      if (!isActive || !sessionId) return

      const now = Date.now()
      if (now - lastMouseMoveRef.current < THROTTLE_MS) return
      lastMouseMoveRef.current = now

      trackEvent(sessionId, 'mousemove', e.clientX, e.clientY, '', location.pathname).catch(console.error)
    },
    [sessionId, isActive, location.pathname],
  )

  const handleClick = useCallback(
    (e) => {
      if (!isActive || !sessionId) return
      trackEvent(sessionId, 'click', e.clientX, e.clientY, '', location.pathname).catch(console.error)
    },
    [sessionId, isActive, location.pathname],
  )

  const handleScroll = useCallback(() => {
    if (!isActive || !sessionId) return

    const now = Date.now()
    if (now - lastScrollRef.current < SCROLL_THROTTLE_MS) return
    lastScrollRef.current = now

    const scrollY = window.scrollY
    const direction = scrollY > lastScrollYRef.current ? 'down' : scrollY < lastScrollYRef.current ? 'up' : 'none'
    lastScrollYRef.current = scrollY

    trackEvent(sessionId, 'scroll', null, scrollY, direction, location.pathname).catch(console.error)
  }, [sessionId, isActive, location.pathname])

  const handleKeyDown = useCallback(
    (e) => {
      if (!isActive || !sessionId) return
      if (['Meta', 'Control', 'Alt', 'Shift'].includes(e.key)) return
      trackEvent(sessionId, 'keydown', null, null, e.key, location.pathname).catch(console.error)
    },
    [sessionId, isActive, location.pathname],
  )

  useEffect(() => {
    if (!isActive || !sessionId) return

    const currentPage = location.pathname
    const previousPage = previousPageRef.current

    if (previousPage !== currentPage) {
      trackEvent(sessionId, 'navigation', null, null, `${previousPage} -> ${currentPage}`, currentPage).catch(console.error)
      previousPageRef.current = currentPage
    }
  }, [location.pathname, sessionId, isActive])

  useEffect(() => {
    if (!isActive || !sessionId) return

    const handleBeforeUnload = () => {
      trackEvent(sessionId, 'session_end', null, null, '', location.pathname)
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [sessionId, isActive, location.pathname])

  useEffect(() => {
    if (!isActive || !sessionId) return

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('click', handleClick)
    window.addEventListener('scroll', handleScroll)
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('click', handleClick)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isActive, sessionId, handleMouseMove, handleClick, handleScroll, handleKeyDown])
}
