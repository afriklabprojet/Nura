"use client"

import { trackRecentlyViewed } from "@lib/data/recently-viewed"
import { useEffect } from "react"

const TrackRecentlyViewed = ({ handle }: { handle: string }) => {
  useEffect(() => {
    trackRecentlyViewed(handle)
  }, [handle])

  return null
}

export default TrackRecentlyViewed
