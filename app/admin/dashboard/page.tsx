"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Event {
  id: number
  event_name: string
  start_time: string
  location: string
  lat?: number | null
  lon?: number | null
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

  async function saveEvent(ev: Event) {
    try {
      const res = await fetch("/api/admin/events", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: ev.id,
          eventName: ev.event_name,
          startTime: ev.start_time,
          endTime: null,
          location: ev.location,
          description: null,
          orderPosition: null,
          lat: ev.lat ?? null,
          lon: ev.lon ?? null,
        }),
      })
      if (!res.ok) {
        console.error("Failed to save event:", await res.text())
        return
      }
      const updated = await res.json()
      setEvents((prev) => prev.map((e) => (e.id === ev.id ? { ...e, ...updated } : e)))
    } catch (err) {
      console.error("Error saving event:", err)
    }
  }

  function updateEventField(id: number, field: keyof Event, value: string) {
    const clamp = (f: keyof Event, v: number | null) => {
      if (v == null || !Number.isFinite(v)) return null
      return f === "lat" ? Math.max(-90, Math.min(90, v)) : Math.max(-180, Math.min(180, v))
    }
    setEvents((prev) =>
      prev.map((e) =>
        e.id === id
          ? {
              ...e,
              [field]: field === "lat" || field === "lon" ? clamp(field, value === "" ? null : Number(value)) : value,
            }
          : e,
      ),
    )
  }

  // Add: client-only geocode using OpenStreetMap Nominatim
  async function lookupCoords(ev: Event) {
    const q = (ev.location || "").trim()
    if (!q) return
    try {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1`
      const res = await fetch(url, {
        headers: {
          "Accept": "application/json",
          // Best practice for Nominatim etiquette; change to your email/domain if desired
          "User-Agent": "wedding-app/1.0 (admin@wedding.local)"
        }
      })
      if (!res.ok) {
        console.error("Geocode failed:", await res.text())
        return
      }
      const results = await res.json()
      const r = Array.isArray(results) ? results[0] : null
      if (r) {
        updateEventField(ev.id, "lat", String(r.lat))
        updateEventField(ev.id, "lon", String(r.lon))
      }
    } catch (err) {
      console.error("Geocode error:", err)
    }
  }

  // Add: create a basic event so fields appear
  async function addEvent() {
    try {
      const nextOrder = (events.length || 0) + 1
      const res = await fetch("/api/admin/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventName: "New Event",
          startTime: new Date().toISOString(),
          endTime: null,
          location: "",
          description: "",
          orderPosition: nextOrder,
          lat: null,
          lon: null,
        }),
      })
      if (!res.ok) {
        console.error("Failed to add event:", await res.text())
        return
      }
      const created = await res.json()
      setEvents((prev) => [...prev, created])
    } catch (err) {
      console.error("Error adding event:", err)
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
                {/* Header with Add button */}
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-serif text-primary">Upcoming Events</h2>
                  <button
                    onClick={addEvent}
                    className="px-3 py-2 border border-primary text-primary rounded-md hover:bg-primary/5 transition"
                  >
                    Add Event
                  </button>
                </div>

                {events.length === 0 ? (
                  <div className="space-y-3">
                    <p className="text-text-secondary">No events added yet</p>
                    <button
                      onClick={addEvent}
                      className="px-3 py-2 border border-primary text-primary rounded-md hover:bg-primary/5 transition"
                    >
                      Add First Event
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {events.map((event) => (
                      <div key={event.id} className="border-l-4 border-l-accent pl-4 py-4 space-y-3">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-semibold">Event Name</label>
                            <input
                              value={event.event_name}
                              onChange={(e) => updateEventField(event.id, "event_name", e.target.value)}
                              className="w-full px-3 py-2 border rounded-md"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold">Location (optional)</label>
                            <input
                              value={event.location || ""}
                              onChange={(e) => updateEventField(event.id, "location", e.target.value)}
                              className="w-full px-3 py-2 border rounded-md"
                              placeholder="Address or venue name"
                            />
                            <button
                              type="button"
                              onClick={() => lookupCoords(event)}
                              className="px-3 py-2 border border-primary text-primary rounded-md hover:bg-primary/5 transition"
                              title="Use OpenStreetMap to get coordinates"
                            >
                              Lookup Coordinates
                            </button>
                          </div>
                          <div>
                            <label className="block text-sm font-semibold">Latitude</label>
                            <input
                              type="number"
                              step="any"
                              min={-90}
                              max={90}
                              value={event.lat ?? ""}
                              onChange={(e) => updateEventField(event.id, "lat", e.target.value)}
                              className="w-full px-3 py-2 border rounded-md"
                              placeholder="e.g. 6.302"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold">Longitude</label>
                            <input
                              type="number"
                              step="any"
                              min={-180}
                              max={180}
                              value={event.lon ?? ""}
                              onChange={(e) => updateEventField(event.id, "lon", e.target.value)}
                              className="w-full px-3 py-2 border rounded-md"
                              placeholder="-10.804"
                            />
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <button
                            onClick={() => saveEvent(event)}
                            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition"
                          >
                            Save
                          </button>
                          {event.lat != null && event.lon != null && (
                            <span className="text-xs text-text-secondary">
                              Coordinates set: {event.lat}, {event.lon}
                            </span>
                          )}
                        </div>
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
