import { Download } from 'lucide-react'
import { useState } from 'react'
import { downloadCvPdf } from '../lib/cvPdf'

export function CvDownloadButton({ className = '' }: { className?: string }) {
  const [busy, setBusy] = useState(false)

  return (
    <button
      className={`bubble-btn primary ${className}`}
      type="button"
      disabled={busy}
      onClick={async () => {
        setBusy(true)
        try {
          await downloadCvPdf()
        } finally {
          setBusy(false)
        }
      }}
    >
      <Download size={16} />
      {busy ? 'Préparation…' : 'Télécharger le CV (PDF)'}
    </button>
  )
}
