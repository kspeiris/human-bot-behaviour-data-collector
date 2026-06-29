import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { TrackingProvider, useTrackingContext } from './contexts/TrackingContext'
import { ConsentModal } from './components/ConsentModal'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { FormPage } from './pages/FormPage'
import { NavigationPage } from './pages/NavigationPage'
import { ExportPage } from './pages/ExportPage'
import { useTracking } from './hooks/useTracking'

function AppShell() {
  const { sessionId, isTrackingActive, isConsented, grantConsent } = useTrackingContext()

  useTracking(sessionId, isTrackingActive)

  return (
    <>
      <ConsentModal isOpen={!isConsented} onConsent={grantConsent} />
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/form" element={<FormPage />} />
          <Route path="/navigation" element={<NavigationPage />} />
          <Route path="/export" element={<ExportPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <TrackingProvider>
        <AppShell />
      </TrackingProvider>
    </BrowserRouter>
  )
}
