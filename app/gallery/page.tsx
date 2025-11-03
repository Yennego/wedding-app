"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Upload, Play } from "lucide-react"

interface Media {
  id: number
  uploader_name: string
  media_type: string
  file_url: string
  caption: string
  uploaded_at: string
}

export default function GalleryPage() {
  const [media, setMedia] = useState<Media[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploaderName, setUploaderName] = useState("")
  const [caption, setCaption] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    fetchMedia()
  }, [])

  async function fetchMedia() {
    try {
      setLoading(true)
      const res = await fetch("/api/media?approved=true")
      if (!res.ok) {
        throw new Error(`API error: ${res.status}`)
      }
      const data = await res.json()
      const mediaArray = data.media || data || []
      setMedia(Array.isArray(mediaArray) ? mediaArray : [])
      setError("")
    } catch (err: any) {
      console.error("[v0] Error fetching media:", err)
      setError("Failed to load gallery. Please try again later.")
      setMedia([])
    } finally {
      setLoading(false)
    }
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedFile || !uploaderName) {
      setError("Please provide your name and select a file")
      return
    }

    setUploading(true)
    setError("")

    try {
      const formData = new FormData()
      formData.append("file", selectedFile)
      formData.append("uploaderName", uploaderName)
      formData.append("caption", caption)

      const res = await fetch("/api/media/upload", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) throw new Error("Upload failed")

      setSelectedFile(null)
      setUploaderName("")
      setCaption("")
      await fetchMedia()
    } catch (err) {
      setError("Failed to upload. Please try again.")
      console.error("[v0] Upload error:", err)
    } finally {
      setUploading(false)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-serif text-primary text-center mb-12">Wedding Gallery</h1>

        {/* Upload Section */}
        <div className="bg-surface rounded-lg p-8 border-2 border-dashed border-accent mb-12">
          <h2 className="text-2xl font-serif text-primary mb-6">Share Your Moments</h2>
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">Your Name *</label>
              <input
                type="text"
                value={uploaderName}
                onChange={(e) => setUploaderName(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">Photo or Video *</label>
              <input
                type="file"
                accept="image/*,video/*"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="w-full px-4 py-2 border border-border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">Caption (Optional)</label>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Add a caption..."
                rows={3}
              />
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={uploading}
              className="w-full bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-light transition disabled:opacity-50"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </form>
        </div>

        {/* Gallery Grid */}
        <div>
          <h2 className="text-2xl font-serif text-primary mb-6">
            {loading
              ? "Loading..."
              : media.length === 0
                ? "No photos yet"
                : `${media.length} Photo${media.length !== 1 ? "s" : ""}`}
          </h2>

          {error && !loading && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="bg-surface rounded-lg p-12 text-center border border-border">
              <p className="text-text-secondary">Loading gallery...</p>
            </div>
          ) : media.length === 0 ? (
            <div className="bg-surface rounded-lg p-12 text-center border border-border">
              <Upload size={40} className="mx-auto text-accent mb-4" />
              <p className="text-text-secondary">Be the first to share your photos from the wedding!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {media.map((item: Media) => (
                <div key={item.id} className="bg-surface rounded-lg overflow-hidden border border-border">
                  {item.media_type === "image" ? (
                    <img
                      src={item.file_url || "/placeholder.svg"}
                      alt={item.caption}
                      className="w-full h-64 object-cover"
                    />
                  ) : (
                    <div className="relative w-full h-64 bg-black flex items-center justify-center">
                      <Play size={40} className="text-white" />
                      <video src={item.file_url} className="w-full h-full object-cover absolute" />
                    </div>
                  )}
                  <div className="p-4">
                    <p className="font-semibold text-primary">{item.uploader_name}</p>
                    {item.caption && <p className="text-text-secondary text-sm mt-2">{item.caption}</p>}
                    <p className="text-xs text-text-secondary mt-2">
                      {new Date(item.uploaded_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
