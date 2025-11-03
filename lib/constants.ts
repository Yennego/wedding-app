export const WEDDING_ID = 1

export const ROLES = {
  BRIDE: "bride",
  GROOM: "groom",
  BRIDESMAID: "bridesmaid",
  GROOMSMAN: "groomsman",
  PARENT: "parent",
  ORGANIZER: "organizer",
}

export const MEDIA_TYPES = {
  IMAGE: "image",
  VIDEO: "video",
}

export const UPLOAD_LIMITS = {
  MAX_FILE_SIZE: 100 * 1024 * 1024, // 100MB
  MAX_IMAGE_SIZE: 50 * 1024 * 1024, // 50MB
  MAX_VIDEO_SIZE: 100 * 1024 * 1024, // 100MB
  ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/gif", "image/webp"],
  ALLOWED_VIDEO_TYPES: ["video/mp4", "video/webm", "video/quicktime"],
}
