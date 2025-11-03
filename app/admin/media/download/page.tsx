"use client"

import { useState, useEffect } from "react"
import { Download, AlertCircle, Trash2 } from "lucide-react"
import JSZip from "jszip"
import { saveAs } from "file-saver"

interface MediaItem {
  id: number
  file_url: string
  file_name: string
  uploader_name: string
  caption: string
  media_type: string
  uploaded_at: string
}

export default function DownloadMediaPage() {
  const [media, setMedia] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedItems, setSelectedItems] = useState<number[]>([])

  useEffect(() => {
    fetchApprovedMedia()
  }, [])

  async function fetchApprovedMedia() {
    try {
      const res = await fetch("/api/media?approved=true")
      if (!res.ok) {
        throw new Error(`API error: ${res.status}`)
      }
      const data = await res.json()
      const mediaArray = data.media || data || []
      setMedia(Array.isArray(mediaArray) ? mediaArray : [])
    } catch (error) {
      console.error("Error fetching media:", error)
      setMedia([])
    } finally {
      setLoading(false)
    }
  }

  function toggleSelectItem(id: number) {
    setSelectedItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  function toggleSelectAll() {
    if (selectedItems.length === media.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(media.map((m) => m.id))
    }
  }

  async function downloadSelected() {
    const itemsToDownload = media.filter((m) => selectedItems.includes(m.id))

    // Create a simple download by opening each file in a new tab
    // For production, consider using JSZip library for batch downloads
    itemsToDownload.forEach((item) => {
      const link = document.createElement("a")
      link.href = item.file_url
      link.download = item.file_name || `${item.id}.${item.media_type}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    })
  }

  async function deleteSelected() {
    if (selectedItems.length === 0) return
    const confirm = window.confirm(`Delete ${selectedItems.length} selected item(s)? This cannot be undone.`)
    if (!confirm) return

    try {
      // Delete each selected id
      for (const id of selectedItems) {
        const res = await fetch("/api/admin/media", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        })
        if (!res.ok) {
          console.error("Delete failed for id:", id, await res.text())
        }
      }
      // Remove from UI and clear selection
      setMedia((prev) => prev.filter((m) => !selectedItems.includes(m.id)))
      setSelectedItems([])
    } catch (err) {
      console.error("Error deleting selected:", err)
    }
  }

  async function deleteSingle(id: number) {
    const confirm = window.confirm("Delete this item? This cannot be undone.")
    if (!confirm) return

    try {
      const res = await fetch("/api/admin/media", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      if (!res.ok) {
        console.error("Delete failed:", await res.text())
        return
      }
      setMedia((prev) => prev.filter((m) => m.id !== id))
      setSelectedItems((prev) => prev.filter((i) => i !== id))
    } catch (err) {
      console.error("Error deleting item:", err)
    }
  }

  if (loading) return <div className="p-8">Loading...</div>

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-serif text-primary mb-8">Download Media</h1>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex gap-3">
          <AlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-800">
            Select the photos and videos you want to download. Browser will download them as individual files.
          </p>
        </div>

        {media.length === 0 ? (
          <div className="bg-surface rounded-lg p-12 text-center border border-border">
            <p className="text-text-secondary">No media available for download yet.</p>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center gap-4">
              <button
                onClick={toggleSelectAll}
                className="px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/5 transition"
              >
                {selectedItems.length === media.length ? "Deselect All" : "Select All"}
              </button>
              <span className="text-text-secondary">
                {selectedItems.length} of {media.length} selected
              </span>
              <button
                onClick={downloadSelected}
                disabled={selectedItems.length === 0}
                className="ml-auto px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition disabled:opacity-50 flex items-center gap-2"
              >
                <Download size={20} />
                Download ({selectedItems.length})
              </button>
              <button
                onClick={downloadZipServer}
                disabled={selectedItems.length === 0}
                className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition disabled:opacity-50"
              >
                Download ZIP (server)
              </button>
              <button
                onClick={deleteSelected}
                disabled={selectedItems.length === 0}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 flex items-center gap-2"
              >
                <Trash2 size={18} />
                Delete Selected
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {media.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleSelectItem(item.id)}
                  className={`cursor-pointer rounded-lg overflow-hidden border-2 transition ${
                    selectedItems.includes(item.id)
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary"
                  }`}
                >
                  <div className="h-48 bg-gray-200 relative">
                    {/* Per-item delete button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteSingle(item.id)
                      }}
                      className="absolute top-2 right-2 z-10 px-2 py-1 rounded bg-red-600 text-white hover:bg-red-700 flex items-center gap-1"
                      title="Delete this item"
                    >
                      <Trash2 size={16} />
                    </button>

                    {item.media_type === "image" ? (
                      <img
                        src={item.file_url || "/placeholder.svg"}
                        alt={item.caption}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-black flex items-center justify-center">
                        <video src={item.file_url} className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="font-semibold text-primary">{item.uploader_name}</p>
                    {item.caption && <p className="text-sm text-text-secondary mt-1">{item.caption}</p>}
                    <p className="text-xs text-text-secondary mt-2">
                      {new Date(item.uploaded_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  )

  async function downloadZip() {
    const itemsToDownload = media.filter((m) => selectedItems.includes(m.id))
    if (itemsToDownload.length === 0) return

    const zip = new JSZip()

    await Promise.all(
      itemsToDownload.map(async (item) => {
        const resp = await fetch(item.file_url)
        const blob = await resp.blob()
        const defaultExt =
          item.media_type === "video" ? "mp4" : "jpg"
        const filename =
          item.file_name ||
          `${item.id}-${item.uploader_name || "media"}.${defaultExt}`
        zip.file(filename, blob)
      }),
    )

    const content = await zip.generateAsync({ type: "blob" })
    const zipName = `wedding-media-${new Date().toISOString().slice(0, 10)}.zip`
    saveAs(content, zipName)
  }
  async function downloadZipServer() {
    const ids = selectedItems
    if (ids.length === 0) return

    const res = await fetch("/api/admin/media/zip", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    })

    if (!res.ok) {
      console.error("ZIP failed:", await res.text())
      return
    }

    const blob = await res.blob()
    const filename = `wedding-media-${new Date().toISOString().slice(0, 10)}.zip`
    saveAs(blob, filename)
  }
}
