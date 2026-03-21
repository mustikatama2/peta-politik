import { useEffect } from 'react'

/**
 * MetaTags — updates document.title and OG meta tags dynamically per page.
 * Usage: <MetaTags title="Page Name" description="..." image="..." />
 */
export default function MetaTags({ title, description, image }) {
  useEffect(() => {
    // Page title
    document.title = title
      ? `${title} — PetaPolitik`
      : 'PetaPolitik — Intelijen Politik Indonesia'

    // Helper to upsert a <meta property="..."> tag
    const setMeta = (prop, content) => {
      let el = document.querySelector(`meta[property="${prop}"]`)
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute('property', prop)
        document.head.appendChild(el)
      }
      el.setAttribute('content', content)
    }

    setMeta('og:title',       title       || 'PetaPolitik')
    setMeta('og:description', description || 'Platform intelijen politik Indonesia')
    setMeta('og:image',       image       || 'https://peta-politik.vercel.app/og-default.png')
    setMeta('og:url',         window.location.href)
    setMeta('og:type',        'website')
    setMeta('og:site_name',   'PetaPolitik')
  }, [title, description, image])

  return null
}
