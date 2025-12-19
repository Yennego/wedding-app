'use client'

import FadeInSection from '@/components/FadeInSection'

const DEPLOYED_URL = 'https://wedding-app-2pga.onrender.com/'
const QR_URL = `https://api.qrserver.com/v1/create-qr-code/?size=512x512&data=${encodeURIComponent(DEPLOYED_URL)}`

export default function QRPage() {
  async function handleDownload() {
    try {
      const res = await fetch(QR_URL, { cache: 'no-store' })
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'wedding-app-qr.png'
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch {}
  }

  async function handleShare() {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Wedding Celebration',
          text: 'Scan to open our wedding site',
          url: DEPLOYED_URL,
        })
      } else {
        await navigator.clipboard.writeText(DEPLOYED_URL)
        alert('Link copied to clipboard')
      }
    } catch {}
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-serif text-primary text-center mb-4">Share Our Wedding Link</h1>
        <p className="text-center text-text-secondary mb-8">Scan or download the QR to open the site</p>
        <FadeInSection direction="up" distance={24} duration={700}>
          <div className="bg-surface rounded-2xl p-8 border border-border shadow-sm flex flex-col items-center gap-6">
            <div className="bg-white rounded-xl p-4 border">
              <img
                src={QR_URL}
                alt="QR code to wedding site"
                className="w-[280px] h-[280px] sm:w-[360px] sm:h-[360px]"
              />
            </div>
            <div className="text-center">
              <p className="text-sm text-text-secondary">URL</p>
              <p className="font-mono text-text-primary">{DEPLOYED_URL}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleDownload}
                className="px-5 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-light transition"
              >
                Download QR
              </button>
              <button
                onClick={handleShare}
                className="px-5 py-2 border border-primary text-primary rounded-lg font-semibold hover:bg-primary/5 transition"
              >
                Share Link
              </button>
            </div>
          </div>
        </FadeInSection>
      </div>
    </main>
  )
}

