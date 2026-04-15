'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  PlayCircleIcon,
  Cancel01Icon,
  CheckmarkCircle02Icon,
  Cancel02Icon,
} from '@hugeicons/core-free-icons'
import { predictASLSign, type PredictionResult } from '@/lib/asl-api'
import { getLetterInfo } from '@/lib/game/asl-alphabet'
import { cn } from '@/lib/utils'
import { useSound } from '@/lib/use-sound'
import { ASL_IMGS } from '@/lib/asl-data'

type CameraFeedProps = {
  targetLetter?: string
  onResult?: (result: PredictionResult) => void
  onCorrect?: () => void
  autoCapture?: boolean
  captureIntervalMs?: number
  compact?: boolean
  showReference?: boolean
}

const BBOX_PADDING = 0.3
const CROP_SIZE = 224

type MediaPipeModules = {
  Hands: any
  drawConnectors: any
  drawLandmarks: any
  HAND_CONNECTIONS: any
}

async function loadMediaPipe(): Promise<MediaPipeModules> {
  const [handsModule, drawingModule] = await Promise.all([
    import('@mediapipe/hands'),
    import('@mediapipe/drawing_utils'),
  ])
  return {
    Hands: handsModule.Hands,
    drawConnectors: drawingModule.drawConnectors,
    drawLandmarks: drawingModule.drawLandmarks,
    HAND_CONNECTIONS: handsModule.HAND_CONNECTIONS,
  }
}

function getBoundingBox(
  landmarks: Array<{ x: number; y: number }>,
  width: number,
  height: number,
) {
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity
  for (const lm of landmarks) {
    minX = Math.min(minX, lm.x)
    minY = Math.min(minY, lm.y)
    maxX = Math.max(maxX, lm.x)
    maxY = Math.max(maxY, lm.y)
  }
  minX *= width
  maxX *= width
  minY *= height
  maxY *= height
  const w = maxX - minX,
    h = maxY - minY
  const pad = Math.max(w, h) * BBOX_PADDING
  const size = Math.max(w, h) + pad * 2
  const centerX = (minX + maxX) / 2,
    centerY = (minY + maxY) / 2
  return {
    x: Math.max(0, centerX - size / 2),
    y: Math.max(0, centerY - size / 2),
    width: Math.min(size, width - Math.max(0, centerX - size / 2)),
    height: Math.min(size, height - Math.max(0, centerY - size / 2)),
  }
}

export function CameraFeed({
  targetLetter,
  onResult,
  onCorrect,
  autoCapture = true,
  captureIntervalMs = 1500,
  compact = false,
  showReference = true,
}: CameraFeedProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null)
  const cropCanvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const handsRef = useRef<any>(null)
  const animFrameRef = useRef<number | null>(null)
  const matchedRef = useRef(false)
  const processingRef = useRef(false)
  const lastPredictRef = useRef(0)
  const mpRef = useRef<MediaPipeModules | null>(null)

  const [active, setActive] = useState(false)
  const [prediction, setPrediction] = useState<PredictionResult | null>(null)
  const [capturing, setCapturing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [matched, setMatched] = useState(false)
  const [handDetected, setHandDetected] = useState(false)
  const [mpLoading, setMpLoading] = useState(true)

  const letterInfo = targetLetter ? getLetterInfo(targetLetter) : null
  const { play } = useSound()

  const sendPrediction = useCallback(
    async (bbox: { x: number; y: number; width: number; height: number }) => {
      if (!videoRef.current || !cropCanvasRef.current || matchedRef.current || processingRef.current) return

      const now = Date.now()
      if (now - lastPredictRef.current < captureIntervalMs) return
      lastPredictRef.current = now

      const video = videoRef.current
      const cropCanvas = cropCanvasRef.current
      cropCanvas.width = CROP_SIZE
      cropCanvas.height = CROP_SIZE
      const cropCtx = cropCanvas.getContext('2d')
      if (!cropCtx) return

      cropCtx.fillStyle = '#7a7a7a'
      cropCtx.fillRect(0, 0, CROP_SIZE, CROP_SIZE)
      const scale = Math.min(CROP_SIZE / bbox.width, CROP_SIZE / bbox.height)
      const drawW = bbox.width * scale,
        drawH = bbox.height * scale
      const offsetX = (CROP_SIZE - drawW) / 2,
        offsetY = (CROP_SIZE - drawH) / 2
      cropCtx.drawImage(
        video,
        bbox.x,
        bbox.y,
        bbox.width,
        bbox.height,
        offsetX,
        offsetY,
        drawW,
        drawH,
      )

      processingRef.current = true
      setCapturing(true)
      try {
        const imageBase64 = cropCanvas.toDataURL('image/jpeg', 0.9)
        const result = await predictASLSign(imageBase64)
        setPrediction(result)
        onResult?.(result)

        if (
          targetLetter &&
          result.prediction === targetLetter.toUpperCase() &&
          result.confidence >= 0.4
        ) {
          setMatched(true)
          matchedRef.current = true
          play('correct', 0.6)
          onCorrect?.()
        }
      } catch {
        // silently ignore — keep trying
      } finally {
        processingRef.current = false
        setCapturing(false)
      }
    },
    [targetLetter, onResult, onCorrect, play, captureIntervalMs],
  )

  const stopCamera = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current)
      animFrameRef.current = null
    }
    if (handsRef.current) {
      handsRef.current.close()
      handsRef.current = null
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t: MediaStreamTrack) => t.stop())
      streamRef.current = null
    }
    setActive(false)
  }, [])

  const processFrame = useCallback(async () => {
    if (!videoRef.current || !handsRef.current || !active) return
    const video = videoRef.current
    if (video.readyState >= 2) {
      try {
        await handsRef.current.send({ image: video })
      } catch {
        // mediapipe may throw if frame isn't ready
      }
    }
    animFrameRef.current = requestAnimationFrame(processFrame)
  }, [active])

  const startCamera = useCallback(async () => {
    try {
      setError(null)
      setMatched(false)
      matchedRef.current = false
      setPrediction(null)
      setMpLoading(true)

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }

      const mp = await loadMediaPipe()
      mpRef.current = mp

      const hands = new mp.Hands({
        locateFile: (file: string) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
      })
      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.5,
      })

      hands.onResults((results: any) => {
        const overlay = overlayCanvasRef.current
        const video = videoRef.current
        if (!overlay || !video) return
        const ctx = overlay.getContext('2d')
        if (!ctx) return

        overlay.width = video.videoWidth || 640
        overlay.height = video.videoHeight || 480
        ctx.clearRect(0, 0, overlay.width, overlay.height)

        if (
          !results.multiHandLandmarks ||
          results.multiHandLandmarks.length === 0
        ) {
          setHandDetected(false)
          return
        }

        setHandDetected(true)
        const landmarks = results.multiHandLandmarks[0]

        mp.drawConnectors(ctx, landmarks, mp.HAND_CONNECTIONS, {
          color: '#003478',
          lineWidth: 3,
        })
        mp.drawLandmarks(ctx, landmarks, {
          color: '#C9A84C',
          lineWidth: 1,
          radius: 4,
        })

        const bbox = getBoundingBox(landmarks, overlay.width, overlay.height)
        ctx.strokeStyle = '#C9A84C'
        ctx.lineWidth = 2
        ctx.strokeRect(bbox.x, bbox.y, bbox.width, bbox.height)

        if (autoCapture && !matchedRef.current) {
          sendPrediction(bbox)
        }
      })

      handsRef.current = hands
      setMpLoading(false)
      setActive(true)
    } catch {
      setError('Camera access denied. Please allow camera permissions in your browser.')
      setMpLoading(false)
    }
  }, [autoCapture, sendPrediction])

  useEffect(() => {
    if (active && handsRef.current) {
      animFrameRef.current = requestAnimationFrame(processFrame)
      return () => {
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
      }
    }
  }, [active, processFrame])

  useEffect(() => {
    setMatched(false)
    matchedRef.current = false
    setPrediction(null)
  }, [targetLetter])

  useEffect(() => {
    startCamera()
    return () => {
      stopCamera()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const confidencePct = prediction ? Math.round(prediction.confidence * 100) : 0

  if (error) {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center gap-4 rounded-sm border border-red-200 bg-red-50 p-6',
          compact ? 'py-6' : 'py-10',
        )}
      >
        <HugeiconsIcon icon={Cancel02Icon} size={28} className="text-destructive" />
        <p className="text-sm text-destructive font-body text-center max-w-sm">{error}</p>
        <button
          type="button"
          onClick={startCamera}
          className="inline-flex items-center gap-2 h-10 px-5 rounded-sm bg-primary text-white font-semibold text-sm font-body hover:bg-[#0056a0] transition-all cursor-pointer"
        >
          <HugeiconsIcon icon={PlayCircleIcon} size={16} />
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className={cn('flex flex-col gap-4', compact ? 'gap-3' : 'gap-4')}>
      {targetLetter && showReference && (
        <div className="flex items-center gap-4">
          {targetLetter && ASL_IMGS[targetLetter.toUpperCase()] && (
            <div className="w-20 h-20 rounded-sm bg-primary/5 border border-primary/15 flex items-center justify-center flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={ASL_IMGS[targetLetter.toUpperCase()]}
                alt={`ASL reference for ${targetLetter}`}
                className="w-18 h-18 object-contain"
              />
            </div>
          )}
          <div
            className={cn(
              'flex items-center justify-center rounded-sm bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 font-bold font-display text-primary',
              compact ? 'w-16 h-16 text-[2rem]' : 'w-20 h-20 text-[2.5rem]',
            )}
          >
            {targetLetter}
          </div>
          
          {letterInfo && (
            <div className="flex-1">
              <div className="text-[11px] uppercase tracking-wider font-semibold font-body text-muted">
                Sign this letter
              </div>
              <h3
                className={cn(
                  'font-bold font-display text-foreground',
                  compact ? 'text-base' : 'text-lg',
                )}
              >
                Letter {targetLetter}
              </h3>
              <p className="text-sm text-muted font-body mt-0.5">{letterInfo.description}</p>
            </div>
          )}
        </div>
      )}

      <div
        className="relative overflow-hidden rounded-sm border border-slate-200 bg-black"
        style={{ aspectRatio: '4 / 3' }}
      >
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
          style={{ transform: 'scaleX(-1)' }}
        />
        <canvas
          ref={overlayCanvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ transform: 'scaleX(-1)' }}
        />
        <canvas ref={cropCanvasRef} className="hidden" />

        {capturing && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm text-white text-[11px] font-semibold font-body px-2.5 py-1.5 rounded-sm">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            Analyzing...
          </div>
        )}

        {handDetected && !matched && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-[#003478]/80 backdrop-blur-sm text-white text-[11px] font-semibold font-body px-2.5 py-1.5 rounded-sm">
            <span className="w-2 h-2 rounded-full bg-[#C9A84C] animate-pulse" />
            Hand detected
          </div>
        )}

        {(!active || mpLoading) && !error && (
          <div className="absolute inset-0 bg-slate-900/80 flex flex-col items-center justify-center gap-3">
            <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center">
              <HugeiconsIcon icon={PlayCircleIcon} size={28} className="text-white" />
            </div>
            <p className="text-sm text-white/80 font-body">
              {mpLoading ? 'Loading hand detection model...' : 'Starting camera...'}
            </p>
          </div>
        )}

        {matched && (
          <div className="absolute inset-0 bg-accent/20 backdrop-blur-[2px] flex items-center justify-center">
            <div className="bg-white rounded-sm shadow-lg p-6 text-center">
              <div className="w-14 h-14 rounded-full bg-accent mx-auto flex items-center justify-center text-white mb-3">
                <HugeiconsIcon icon={CheckmarkCircle02Icon} size={28} />
              </div>
              <div className="text-lg font-bold font-display text-accent">Correct!</div>
              <div className="text-sm text-muted font-body mt-1">
                You signed &ldquo;{targetLetter}&rdquo; perfectly
              </div>
            </div>
          </div>
        )}

        {prediction && !matched && active && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4 pt-8">
            <div className="flex items-end gap-3">
              <div
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-sm backdrop-blur-sm font-body',
                  prediction.prediction === targetLetter?.toUpperCase()
                    ? 'bg-accent/90 text-white'
                    : 'bg-white/15 text-white',
                )}
              >
                <span className="text-3xl font-bold font-display leading-none">
                  {prediction.prediction || '?'}
                </span>
                <div className="flex flex-col leading-tight">
                  <span className="text-[10px] uppercase tracking-wider opacity-80">Detected</span>
                  <span className="text-lg font-bold font-display">{confidencePct}%</span>
                </div>
              </div>

              <div className="flex-1 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-white/70 font-body uppercase tracking-wider">
                    Confidence
                  </span>
                  <span className="text-xs text-white/90 font-bold font-display">
                    {confidencePct}%
                  </span>
                </div>
                <div className="h-3 rounded-full bg-white/20 overflow-hidden">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all duration-300',
                      confidencePct >= 70
                        ? 'bg-accent'
                        : confidencePct >= 40
                          ? 'bg-[#F59E0B]'
                          : 'bg-red-400',
                    )}
                    style={{ width: `${confidencePct}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {active && !autoCapture && !matched && (
        <button
          type="button"
          onClick={() => {
            if (!videoRef.current || !overlayCanvasRef.current) return
            const overlay = overlayCanvasRef.current
            const fullBbox = {
              x: 0,
              y: 0,
              width: overlay.width || 640,
              height: overlay.height || 480,
            }
            sendPrediction(fullBbox)
          }}
          disabled={capturing}
          className={cn(
            'inline-flex items-center justify-center gap-2 h-11 rounded-sm font-semibold text-sm font-body transition-all cursor-pointer',
            capturing
              ? 'bg-slate-100 text-muted cursor-wait'
              : 'bg-primary text-white hover:bg-[#0056a0]',
          )}
        >
          {capturing ? 'Analyzing...' : 'Capture & Check'}
        </button>
      )}

      {active && (
        <button
          type="button"
          onClick={stopCamera}
          className="inline-flex items-center justify-center gap-2 h-9 text-sm text-muted hover:text-destructive font-body transition-all cursor-pointer"
        >
          <HugeiconsIcon icon={Cancel01Icon} size={14} />
          Stop camera
        </button>
      )}
    </div>
  )
}
