import { useState } from 'react'

/**
 * ShareButton — uses the Web Share API when available, falls back to clipboard.
 *
 * @param {string} title  Text sent to the share dialog or used as label
 * @param {string} [url]  URL to share; defaults to window.location.href
 */
export default function ShareButton({ title, url }) {
  const [copied, setCopied] = useState(false)

  const share = async () => {
    const target = url || window.location.href
    if (navigator.share) {
      try {
        await navigator.share({ title, url: target })
      } catch {
        // user cancelled or share failed — fall through to clipboard
        await copyToClipboard(target)
      }
    } else {
      await copyToClipboard(target)
    }
  }

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // ignore clipboard errors
    }
  }

  return (
    <button
      onClick={share}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-white/60 text-xs hover:bg-white/5 hover:text-white transition-colors"
    >
      {copied ? '✓ Tersalin' : '🔗 Bagikan'}
    </button>
  )
}
