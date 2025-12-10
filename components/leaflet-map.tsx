"use client"

import { useEffect, useRef, useState } from "react"

type Coords = { lat: number; lon: number }

interface LeafletMapProps {
  title?: string
  coords: Coords
  zoom?: number
  locationQuery?: string
}

declare global {
  interface Window {
    L?: any
  }
}

function loadLeaflet(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve()
    if (window.L) return resolve()

    const cssId = "leaflet-css"
    if (!document.getElementById(cssId)) {
      const link = document.createElement("link")
      link.id = cssId
      link.rel = "stylesheet"
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      document.head.appendChild(link)
    }

    const jsId = "leaflet-js"
    if (!document.getElementById(jsId)) {
      const script = document.createElement("script")
      script.id = jsId
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
      script.async = true
      script.onload = () => resolve()
      script.onerror = () => resolve()
      document.body.appendChild(script)
    } else {
      resolve()
    }
  })
}

export default function LeafletMap({ title = "Venue", coords, zoom = 16, locationQuery }: LeafletMapProps) {
  type Coords = { lat: number; lon: number }

  interface LeafletMapProps {
    title?: string
    coords: Coords
    zoom?: number
    locationQuery?: string
  }

  function toNumCoord(c: Coords): Coords {
    return { lat: Number(c.lat), lon: Number(c.lon) }
  }

  function isValidCoords(c: Coords) {
    const n = toNumCoord(c)
    return (
      Number.isFinite(n.lat) &&
      Number.isFinite(n.lon) &&
      n.lat >= -90 &&
      n.lat <= 90 &&
      n.lon >= -180 &&
      n.lon <= 180
    )
  }

  const [resolvedCoords, setResolvedCoords] = useState<Coords>(toNumCoord(coords))
  const mapRef = useRef<HTMLDivElement | null>(null)
  const [distanceKm, setDistanceKm] = useState<number | null>(null)
  const [locating, setLocating] = useState(false)

  // Fallback: geocode location text if coords look invalid
  useEffect(() => {
    const go = async () => {
      const c = toNumCoord(coords)
      if (isValidCoords(c)) {
        setResolvedCoords(c)
        return
      }
      const q = (locationQuery || "").trim()
      if (!q) return
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1`,
          {
            headers: {
              "Accept": "application/json",
              "User-Agent": "wedding-app/1.0 (admin@wedding.local)"
            }
          }
        )
        if (!res.ok) return
        const arr = await res.json()
        const first = Array.isArray(arr) ? arr[0] : null
        if (first?.lat && first?.lon) {
          setResolvedCoords({ lat: Number(first.lat), lon: Number(first.lon) })
        }
      } catch {}
    }
    go()
  }, [coords.lat, coords.lon, locationQuery])

  // Map init and marker rendering using the resolved coordinates only
  useEffect(() => {
    if (!isValidCoords(resolvedCoords)) return
    let map: any
    let venueMarker: any
    let userMarker: any
    let routeLine: any

    async function init() {
      await loadLeaflet()
      if (!mapRef.current || !window.L) return

      const L = window.L
      const c = toNumCoord(resolvedCoords)

      const eventIcon = L.icon({
        iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png",
        iconRetinaUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      })
      const userIcon = L.icon({
        iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
        iconRetinaUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      })

      map = L.map(mapRef.current).setView([c.lat, c.lon], zoom)
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map)

      venueMarker = L.marker([c.lat, c.lon], { icon: eventIcon }).addTo(map)
      venueMarker.bindPopup(`<b>${title}</b>`)
      venueMarker.bindTooltip(title, { permanent: true, direction: "top" })

      ;(mapRef as any)._leaflet = { L, map, venueMarker, userMarker, routeLine, userIcon, eventIcon }
    }

    init()

    return () => {
      try {
        const ref = (mapRef as any)._leaflet
        if (ref?.routeLine && ref.routeLine.remove) ref.routeLine.remove()
        if (ref?.userMarker && ref.userMarker.remove) ref.userMarker.remove()
        if (ref?.venueMarker && ref.venueMarker.remove) ref.venueMarker.remove()
        if (ref?.map && ref.map.remove) ref.map.remove()
      } catch {}
    }
  }, [resolvedCoords.lat, resolvedCoords.lon, zoom, title])

  function haversineKm(a: Coords, b: Coords) {
    const A = toNumCoord(a)
    const B = toNumCoord(b)
    const R = 6371
    const dLat = ((B.lat - A.lat) * Math.PI) / 180
    const dLon = ((B.lon - A.lon) * Math.PI) / 180
    const la1 = (A.lat * Math.PI) / 180
    const la2 = (B.lat * Math.PI) / 180
    const sinDLat = Math.sin(dLat / 2)
    const sinDLon = Math.sin(dLon / 2)
    const c = sinDLat * sinDLat + Math.cos(la1) * Math.cos(la2) * sinDLon * sinDLon
    const d = 2 * Math.atan2(Math.sqrt(c), Math.sqrt(1 - c))
    return R * d
  }

  async function drawDrivingRoute(user: Coords, dest: Coords) {
    const ref = (mapRef as any)._leaflet
    if (!ref?.map || !ref?.L) return
    const L = ref.L

    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${user.lon},${user.lat};${dest.lon},${dest.lat}?overview=full&geometries=geojson`
      const res = await fetch(url)
      const data = await res.json()

      if (data?.code === "Ok" && data.routes?.length) {
        const route = data.routes[0]
        const coords = route.geometry.coordinates.map(([lon, lat]: [number, number]) => [lat, lon])

        if (ref.routeLine) ref.routeLine.remove()
        ref.routeLine = L.polyline(coords, { color: "#1e88e5", weight: 4 }).addTo(ref.map)
        ref.map.fitBounds(ref.routeLine.getBounds(), { padding: [30, 30] })
        return
      }
    } catch {
      // silently fall through to straight-line fallback
    }

    // Fallback: straight-line polyline (dashed)
    const pts = [[user.lat, user.lon], [dest.lat, dest.lon]]
    if (ref.routeLine) ref.routeLine.remove()
    ref.routeLine = L.polyline(pts, { color: "#1e88e5", dashArray: "5,5", weight: 3 }).addTo(ref.map)
    ref.map.fitBounds(ref.routeLine.getBounds(), { padding: [30, 30] })
  }

  async function locateMe() {
    const ref = (mapRef as any)._leaflet
    if (!ref?.map || !ref?.L) return

    return new Promise<void>((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const user: Coords = { lat: pos.coords.latitude, lon: pos.coords.longitude }
          const L = ref.L

          // Create or update user marker
          if (ref.userMarker) ref.userMarker.setLatLng([user.lat, user.lon])
          else ref.userMarker = L.marker([user.lat, user.lon], { icon: ref.userIcon }).addTo(ref.map)

          // If event coords are valid, draw a driving route; otherwise just center on user
          if (isValidCoords(resolvedCoords)) {
            await drawDrivingRoute(user, resolvedCoords)
          } else {
            ref.map.setView([user.lat, user.lon], 16)
          }

          resolve()
        },
        () => resolve(), // ignore errors; user can retry
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      )
    })
  }

  const hasCoords = isValidCoords(resolvedCoords)
  const gmapsUrl =
    hasCoords
      ? `https://www.google.com/maps/dir/?api=1&destination=${resolvedCoords.lat},${resolvedCoords.lon}`
      : (locationQuery && locationQuery.length > 0)
          ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationQuery)}`
          : null

  return (
    <div>
      <div className="text-sm text-text-secondary mb-2">
        {hasCoords ? title : locationQuery ? "Locating venue from address..." : "Invalid coordinates — map unavailable"}
      </div>
      <div ref={mapRef} style={{ width: "100%", height: 320, borderRadius: 12, overflow: "hidden" }} />
      <div className="mt-3 flex items-center gap-3">
        <button
          onClick={locateMe}
          disabled={locating}
          className="px-3 py-1 border border-primary text-primary rounded-md hover:bg-primary/5 transition disabled:opacity-50"
        >
          {locating ? "Locating..." : "Use My Location"}
        </button>
        {gmapsUrl ? (
          <a
            href={gmapsUrl}
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1 border border-accent text-accent rounded-md hover:bg-accent/5 transition"
          >
            Open in Google Maps
          </a>
        ) : (
          <button
            disabled
            className="px-3 py-1 border border-border text-text-secondary rounded-md opacity-60 cursor-not-allowed"
            title="Add coordinates or location to enable Google Maps"
          >
            Open in Google Maps
          </button>
        )}
        {distanceKm != null && (
          <span className="text-xs text-text-secondary">Distance: {distanceKm} km</span>
        )}
      </div>
    </div>
  )
}