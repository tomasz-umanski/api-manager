import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Hotjar from '@hotjar/browser'
import ReactGA from 'react-ga4'

function notifyHotjarStateChange(path: string) {
  const siteId = Number(import.meta.env.VITE_HOTJAR_SITE_ID)
  if (!siteId) return

  const send = () => {
    if (Hotjar.isReady()) {
      Hotjar.stateChange(path)
      return
    }

    window.setTimeout(send, 100)
  }

  send()
}

export function AnalyticsListener() {
  const location = useLocation()

  useEffect(() => {
    const path = location.pathname + location.search

    const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID
    if (measurementId) {
      ReactGA.send({
        hitType: 'pageview',
        page: path,
      })
    }

    notifyHotjarStateChange(path)
  }, [location])

  return null
}
