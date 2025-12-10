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
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploadSuccess, setUploadSuccess] = useState("")

  useEffect(() => {
  }, [])

  // Generate a preview when a file is selected
  useEffect(() => {
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile)
      setPreviewUrl(url)
      return () => URL.revokeObjectURL(url)
    }
    setPreviewUrl(null)
  }, [selectedFile])

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
    setError("")
    setUploadSuccess("")

    if (!selectedFile || !uploaderName) {
      setError("Please provide your name and select a file.")
      return
    }

    try {
      setUploading(true)
      const formData = new FormData()
      formData.append("file", selectedFile)
      formData.append("uploaderName", uploaderName)
      formData.append("caption", caption)

      const res = await fetch("/api/media/upload", { method: "POST", body: formData })
      if (!res.ok) throw new Error(await res.text())

      // Clear inputs and show success
      setSelectedFile(null)
      setUploaderName("")
      setCaption("")
      setPreviewUrl(null)
      setUploadSuccess("Thanks! Your file was submitted and will be reviewed by admin.")
    } catch (err: any) {
      console.error("Upload error:", err)
      setError("Upload failed. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-serif text-primary text-center mb-12">Wedding Gallery</h1>

        {/* Upload Section (kept) */}
        <div className="bg-surface rounded-lg p-8 border-2 border-dashed border-accent mb-12">
          <h2 className="text-2xl font-serif text-primary mb-6">Share Your Moments</h2>
          <form onSubmit={handleUpload} className="space-y-4">
            {/* Your Name */}
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

            {/* File */}
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">Photo or Video *</label>
              <input
                type="file"
                accept="image/*,video/*"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="w-full px-4 py-2 border border-border rounded-lg"
              />
            </div>

            {/* Preview (optional) */}
            {previewUrl && (
              <div className="mt-4">
                {selectedFile?.type?.startsWith("video") ? (
                  <video src={previewUrl} controls className="w-full rounded-md" />
                ) : (
                  <img src={previewUrl} alt="Preview" className="w-full rounded-md" />
                )}
              </div>
            )}

            {/* Caption */}
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">Caption (Optional)</label>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg"
                placeholder="Add a caption..."
              />
            </div>

            <button
              type="submit"
              disabled={uploading}
              className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition disabled:opacity-50"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>

            {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
            {uploadSuccess && <p className="text-green-700 text-sm mt-2">{uploadSuccess}</p>}
          </form>
        </div>

        {/* No listing: guests should not see uploads */}
        <div className="bg-surface rounded-lg p-12 text-center border border-border">
          <p className="text-text-secondary">Stay tuned—photos will appear here once approved.</p>
        </div>
      </div>
    </main>
  )
}
