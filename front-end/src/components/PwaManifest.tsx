import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { asset } from '../lib/asset'

export function PwaManifest() {
  const { pathname } = useLocation()
  const admin = pathname.startsWith('/admin')

  useEffect(() => {
    const href = asset(admin ? '/manifest-admin.webmanifest' : '/manifest-client.webmanifest')
    let link = document.querySelector<HTMLLinkElement>('link[rel="manifest"]')
    if (!link) {
      link = document.createElement('link')
      link.rel = 'manifest'
      document.head.appendChild(link)
    }
    link.href = href

    const theme = document.querySelector('meta[name="theme-color"]')
    if (theme && admin) theme.setAttribute('content', '#FF7900')
  }, [admin])

  return null
}
