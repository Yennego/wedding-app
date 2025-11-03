"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Event {
  id: number
  event_name: string
  start_time: string
  location: string
}

interface Media {
  id: number
  uploader_name: string
  caption: string
  approved: boolean
  media_type: string
  file_url: string
}

export default function AdminDashboardPage() {
  const router = useRouter()
  const [events, setEvents] = useState<Event[]>([])
  const [pendingMedia, setPendingMedia] = useState<Media[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const [eventsRes, mediaRes] = await Promise.all([
        fetch("/api/admin/events"),
        fetch("/api/admin/media?pending=true"),
      ])

      if (eventsRes.ok) setEvents(await eventsRes.json())
      if (mediaRes.ok) setPendingMedia(await mediaRes.json())
    } catch (err) {
      console.error("Error fetching data:", err)
    } finally {
      setLoading(false)
    }
  }

  async function approveMedia(mediaId: number) {
    try {
      const res = await fetch("/api/admin/media", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: mediaId, approved: true }),
      })

      if (!res.ok) {
        console.error("Approve failed:", await res.text())
        return
      }

      const updated = await res.json()
      if (updated?.approved === true) {
        setPendingMedia((prev) => prev.filter((m) => m.id !== mediaId))
      }
    } catch (err) {
      console.error("Error approving media:", err)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-serif text-primary">Admin Dashboard</h1>
          <button
            onClick={() => {
              document.cookie = "admin_session=; max-age=0"
              router.push("/")
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <Tabs defaultValue="media" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="media">Pending Media ({pendingMedia.length})</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
            </TabsList>

            <TabsContent value="media" className="space-y-6 mt-6">
              {pendingMedia.length === 0 ? (
                <div className="bg-surface rounded-lg p-8 text-center border border-border">
                  <p className="text-text-secondary">No pending media to review</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pendingMedia.map((media) => (
                    <div key={media.id} className="bg-surface rounded-lg border border-border overflow-hidden">
                      <div className="h-48 bg-gray-200 relative">
                        {media.media_type === "image" ? (
                          <img
                            src={media.file_url || "/placeholder.svg"}
                            alt={media.caption}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <video src={media.file_url} controls className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="p-4 space-y-3">
                        <div>
                          <p className="font-semibold text-primary">{media.uploader_name}</p>
                          <p className="text-sm text-text-secondary">{media.caption}</p>
                        </div>
                        <button
                          onClick={() => approveMedia(media.id)}
                          className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition"
                        >
                          Approve
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="events" className="space-y-6 mt-6">
              <div className="bg-surface rounded-lg border border-border p-6">
                <h2 className="text-2xl font-serif text-primary mb-4">Upcoming Events</h2>
                {events.length === 0 ? (
                  <p className="text-text-secondary">No events added yet</p>
                ) : (
                  <div className="space-y-4">
                    {events.map((event) => (
                      <div key={event.id} className="border-l-4 border-l-accent pl-4 py-2">
                        <h3 className="font-semibold text-primary">{event.event_name}</h3>
                        <p className="text-sm text-text-secondary">{new Date(event.start_time).toLocaleString()}</p>
                        {event.location && <p className="text-sm text-text-secondary">📍 {event.location}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </main>
  )
}
