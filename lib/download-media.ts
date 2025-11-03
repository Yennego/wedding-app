export async function downloadAllMedia() {
  try {
    const response = await fetch("/api/media?approved=true")
    const data = await response.json()
    const mediaArray = data.media || data || []
    return Array.isArray(mediaArray) ? mediaArray : []
  } catch (error) {
    console.error("Error downloading media:", error)
    return []
  }
}

// Export function to generate a download script for batch operations
export function generateBatchDownloadScript(mediaItems: any[]) {
  return mediaItems.map((item) => ({
    url: item.file_url,
    filename: item.file_name || `${item.id}-${item.media_type}`,
    uploader: item.uploader_name,
    caption: item.caption,
  }))
}
