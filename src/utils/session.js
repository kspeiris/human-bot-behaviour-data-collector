import { v4 as uuidv4 } from 'uuid'

const DEFAULT_SESSION = {
  sessionId: '',
  userType: 'Human',
  botType: 'None',
  sessionSource: 'Manual'
}

export function createSession(overrides = {}) {
  const session = {
    sessionId: uuidv4(),
    userType: DEFAULT_SESSION.userType,
    botType: DEFAULT_SESSION.botType,
    sessionSource: DEFAULT_SESSION.sessionSource,
    ...overrides
  }
  return session
}

export function saveSession(session) {
  localStorage.setItem('session', JSON.stringify(session))
}

export function getSession() {
  const stored = localStorage.getItem('session')
  if (!stored) return null
  try {
    return JSON.parse(stored)
  } catch {
    return null
  }
}

export function updateSession(updates) {
  const session = getSession()
  if (session) {
    const updated = { ...session, ...updates }
    saveSession(updated)
    return updated
  }
  return null
}

export function clearSession() {
  localStorage.removeItem('session')
}