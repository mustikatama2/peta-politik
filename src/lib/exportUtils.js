// ── Export Utilities ──────────────────────────────────────────────────────────

/**
 * Export an array of objects to a CSV file and trigger download.
 * @param {Object[]} data
 * @param {string} filename  (without extension)
 */
export function exportToCSV(data, filename) {
  if (!data || data.length === 0) return
  const headers = Object.keys(data[0])
  const rows = data.map(row =>
    headers.map(h => {
      const val = row[h]
      if (val === null || val === undefined) return ''
      if (typeof val === 'object') return JSON.stringify(val)
      return String(val).replace(/,/g, ';')
    }).join(',')
  )
  const csv = [headers.join(','), ...rows].join('\n')
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename + '.csv'
  a.click()
  URL.revokeObjectURL(url)
}

/**
 * Export any value as a pretty-printed JSON file and trigger download.
 * @param {*} data
 * @param {string} filename  (without extension)
 */
export function exportToJSON(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename + '.json'
  a.click()
  URL.revokeObjectURL(url)
}

/**
 * Open a print-friendly window containing the innerHTML of a DOM element.
 * @param {string} elementId
 * @param {string} title   Window / document title
 */
export function printElement(elementId, title) {
  const el = document.getElementById(elementId)
  if (!el) return
  const win = window.open('', '_blank')
  win.document.write(`<html><head><title>${title}</title>
<style>
  body { font-family: sans-serif; padding: 20px; color: #111; }
  table { border-collapse: collapse; width: 100%; }
  td, th { border: 1px solid #ddd; padding: 8px; }
  img { max-width: 120px; }
  @media print { button { display: none; } }
</style>
</head><body>${el.innerHTML}<script>window.print();window.close()<\/script></body></html>`)
  win.document.close()
}
