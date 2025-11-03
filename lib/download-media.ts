export async function downloadAllMedia() {
  try {
    const response = await fetch("/api/media?approved=true")
    const media = await response.json()

    // In a real app, you would use a library like JSZip to create a zip file
    // For now, this function prepares the data
    return media
  } catch (error) {
    console.error("Error downloading media:", error)
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
