'use client'

import { useCallback, useRef } from 'react'
import { SFX, type SfxKey } from './asl-data'


export function useSound() {

  const ctxRef = useRef<AudioContext | null>(null)

  const play = useCallback((keyOrUrl: SfxKey | (string & {}), volume = 0.7) => {
    try {
      const url = (SFX as Record<string, string>)[keyOrUrl] ?? keyOrUrl
      const audio = new Audio(url)
      audio.volume = Math.max(0, Math.min(1, volume))
      audio.play().catch(() => {})
    } catch {
    }
  }, [])

  return { play }
}
