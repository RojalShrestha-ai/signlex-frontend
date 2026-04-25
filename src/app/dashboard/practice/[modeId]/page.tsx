'use client'

import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Cancel01Icon,
  Clock01Icon,
  StarIcon,
  FlashIcon,
  CheckmarkCircle02Icon,
  Cancel02Icon,
  Rocket01Icon,
  FireIcon,
  ArrowRight02Icon,
} from '@hugeicons/core-free-icons'
import { practiceModes, pickQuestions } from '@/lib/game/data'
import { getRandomLetters, getLetterInfo } from '@/lib/game/asl-alphabet'
import { CameraFeed } from '@/components/dashboard/camera-feed'
import { ASL_IMGS } from '@/lib/asl-data'
import { useRecordSession, useAwardXP, useDueCards, useNewCards, useFlashcardStats, useSubmitReview } from '@/lib/hooks'
import { cn } from '@/lib/utils'

const modeDurations: Record<string, number> = {
  'ai-recognition': 0,
  flashcards: 0,
  'quick-fire': 60,
  'daily-challenge': 300,
  'word-builder': 300,
  'streak-saver': 120,
  'boss-battle': 600,
}

const modeQuestions: Record<string, number> = {
  'ai-recognition': 10,
  flashcards: 10,
  'quick-fire': 20,
  'daily-challenge': 15,
  'word-builder': 12,
  'streak-saver': 8,
  'boss-battle': 18,
}

export default function PracticeSessionPage() {
  const params = useParams<{ modeId: string }>()
  const modeId = params?.modeId

  if (modeId === 'flashcards') {
    return <FlashcardSession />
  }

  return <GenericPracticeSession modeId={modeId} />
}

function FlashcardSession() {
  const router = useRouter()
  const mode = practiceModes.find((m) => m.id === 'flashcards')!
  const { data: dueData, isLoading: dueLoading } = useDueCards(20)
  const { data: newData, isLoading: newLoading } = useNewCards(5)
  const { data: statsData } = useFlashcardStats()
  const submitReview = useSubmitReview()
  const recordSession = useRecordSession()
  const awardXP = useAwardXP()

  const cards = useMemo(() => {
    const due = (dueData?.cards ?? []).map((c: any) => ({ sign: c.sign, isNew: false }))
    const fresh = (newData?.nextCards ?? []).map((s: string) => ({ sign: s, isNew: true }))
    return [...due, ...fresh]
  }, [dueData, newData])

  const [current, setCurrent] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [score, setScore] = useState(0)
  const [reviewed, setReviewed] = useState(0)
  const [finished, setFinished] = useState(false)

  useEffect(() => {
    if (!finished || reviewed === 0) return
    const xp = Math.round((score / reviewed) * mode.xp)
    if (xp > 0) awardXP.mutate({ amount: xp, reason: 'practice' })
    recordSession.mutate({
      sessionType: 'flashcard',
      duration: 0,
      signsAttempted: [],
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished])

  if (dueLoading || newLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-sm text-muted font-body">Loading flashcards...</div>
      </div>
    )
  }

  if (cards.length === 0) {
    return (
      <div className="flex flex-col gap-6 max-w-3xl mx-auto w-full">
        <div className="rounded-sm bg-white border border-slate-100 p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-accent/10 mx-auto flex items-center justify-center mb-4">
            <HugeiconsIcon icon={CheckmarkCircle02Icon} size={28} className="text-accent" />
          </div>
          <h2 className="text-[1.5rem] font-bold font-display text-foreground">
            All caught up!
          </h2>
          <p className="text-sm text-muted font-body mt-2 max-w-sm mx-auto">
            No cards due for review right now. Complete lessons to add new signs to your deck, or check back later.
          </p>
          <div className="flex items-center justify-center gap-3 mt-4 text-sm font-body text-muted">
            <span>Mastered: {statsData?.overview?.mastered ?? 0}</span>
            <span>·</span>
            <span>Learning: {statsData?.overview?.learning ?? 0}</span>
            <span>·</span>
            <span>Not started: {statsData?.overview?.notStarted ?? 26}</span>
          </div>
          <button
            type="button"
            onClick={() => router.push('/dashboard/practice')}
            className="inline-flex items-center justify-center h-11 px-6 mt-6 rounded-sm bg-primary text-white hover:bg-[#0056a0] font-semibold text-sm font-body transition-all cursor-pointer"
          >
            Back to practice
          </button>
        </div>
      </div>
    )
  }

  const card = cards[current]
  const progressPct = cards.length > 0 ? Math.round((current / cards.length) * 100) : 0
  const letterInfo = getLetterInfo(card?.sign)

  function handleRating(rating: 'easy' | 'good' | 'hard') {
    const correct = rating !== 'hard'
    submitReview.mutate({ sign: card.sign, rating, correct })
    if (correct) setScore((s) => s + 1)
    setReviewed((r) => r + 1)

    if (current + 1 >= cards.length) {
      setFinished(true)
    } else {
      setCurrent((c) => c + 1)
      setFlipped(false)
    }
  }

  if (finished) {
    const accuracy = reviewed > 0 ? Math.round((score / reviewed) * 100) : 0
    const earnedXp = Math.round((score / Math.max(reviewed, 1)) * mode.xp)
    return (
      <div className="flex flex-col gap-6 max-w-3xl mx-auto w-full">
        <div
          className="relative overflow-hidden rounded-sm text-white p-8 md:p-10 text-center"
          style={{
            background: `linear-gradient(135deg, ${mode.color}, ${mode.color}dd 60%, ${mode.color}99)`,
          }}
        >
          <div className="absolute -right-10 -top-10 w-56 h-56 rounded-full bg-white/10 blur-2xl" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-sm px-3 py-1 mb-4">
              <HugeiconsIcon icon={Rocket01Icon} size={14} />
              <span className="text-xs font-semibold font-body">Review complete</span>
            </div>
            <h2 className="text-[2rem] md:text-[2.5rem] font-bold font-display tracking-[-0.02em]">
              Flashcards done!
            </h2>
            <p className="text-white/80 font-body mt-2 max-w-md mx-auto">
              {accuracy >= 80
                ? 'Excellent memory! Your spaced repetition is paying off.'
                : accuracy >= 50
                  ? 'Good progress. Keep reviewing to strengthen retention.'
                  : 'Some signs need more practice. Come back soon!'}
            </p>
            <div className="grid grid-cols-3 gap-3 mt-8 max-w-md mx-auto">
              <SummaryStat label="Reviewed" value={`${reviewed}`} />
              <SummaryStat label="Accuracy" value={`${accuracy}%`} />
              <SummaryStat label="XP earned" value={`+${earnedXp}`} icon="star" />
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={() => router.push('/dashboard/practice')}
            className="inline-flex items-center justify-center h-11 px-6 rounded-sm bg-primary text-white hover:bg-[#0056a0] font-semibold text-sm font-body transition-all cursor-pointer"
          >
            Back to practice
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto w-full">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/practice"
          aria-label="Exit practice"
          className="w-10 h-10 flex items-center justify-center rounded-sm border border-slate-200 bg-white hover:bg-slate-50 text-muted transition-all"
        >
          <HugeiconsIcon icon={Cancel01Icon} size={18} />
        </Link>
        <div className="flex-1 h-3 rounded-full bg-slate-200 overflow-hidden">
          <div
            className="h-full transition-all duration-300"
            style={{ width: `${progressPct}%`, backgroundColor: mode.color }}
          />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 h-10 rounded-sm bg-white border border-slate-200">
          <HugeiconsIcon icon={FlashIcon} size={15} className="text-accent" />
          <span className="text-xs font-semibold font-body text-muted">
            {current + 1}/{cards.length}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-wider font-semibold font-body" style={{ color: mode.color }}>
            {card.isNew ? 'New Card' : 'Review'}
          </div>
          <h1 className="text-[1.25rem] font-bold font-display text-foreground">
            What sign is this?
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <StatChip icon="star" label="Score" value={`${score}`} color="#00A86B" />
        </div>
      </div>

      <div
        className="rounded-sm bg-white border border-slate-100 p-8 md:p-10 cursor-pointer select-none"
        onClick={() => setFlipped(true)}
      >
        <div className="flex flex-col items-center gap-6">
          {ASL_IMGS[card.sign] && (
            <div className="w-44 h-44 md:w-56 md:h-56 rounded-sm border-2 border-primary/20 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={ASL_IMGS[card.sign]}
                alt="Identify this ASL sign"
                className="w-full h-full object-contain"
              />
            </div>
          )}

          {!flipped ? (
            <div className="text-center">
              <p className="text-sm text-muted font-body">Tap to reveal the answer</p>
              <div className="mt-3 w-20 h-20 rounded-sm bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold font-display text-muted">?</span>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="w-20 h-20 rounded-sm bg-primary/10 border-2 border-primary flex items-center justify-center mx-auto">
                <span className="text-[3rem] font-bold font-display text-primary">{card.sign}</span>
              </div>
              {letterInfo && (
                <p className="text-sm text-muted font-body mt-3 max-w-sm">
                  {letterInfo.description}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {flipped && (
        <div className="rounded-sm border border-slate-100 bg-white p-5">
          <p className="text-sm text-muted font-body text-center mb-4">
            How well did you know this sign?
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => handleRating('hard')}
              className="flex-1 max-w-[10rem] h-12 rounded-sm border-2 border-destructive/30 bg-destructive/5 text-destructive font-bold text-sm font-display hover:bg-destructive/10 transition-all cursor-pointer"
            >
              Hard
            </button>
            <button
              type="button"
              onClick={() => handleRating('good')}
              className="flex-1 max-w-[10rem] h-12 rounded-sm border-2 border-primary/30 bg-primary/5 text-primary font-bold text-sm font-display hover:bg-primary/10 transition-all cursor-pointer"
            >
              Good
            </button>
            <button
              type="button"
              onClick={() => handleRating('easy')}
              className="flex-1 max-w-[10rem] h-12 rounded-sm border-2 border-accent/30 bg-accent/5 text-accent font-bold text-sm font-display hover:bg-accent/10 transition-all cursor-pointer"
            >
              Easy
            </button>
          </div>
        </div>
      )}

      {!flipped && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => setFlipped(true)}
            className="inline-flex items-center gap-2 h-11 px-6 rounded-sm bg-primary text-white hover:bg-[#0056a0] font-semibold text-sm font-body transition-all cursor-pointer"
          >
            Reveal answer
            <HugeiconsIcon icon={ArrowRight02Icon} size={15} />
          </button>
        </div>
      )}
    </div>
  )
}

function GenericPracticeSession({ modeId }: { modeId: string | undefined }) {
  const router = useRouter()
  const recordSession = useRecordSession()
  const awardXP = useAwardXP()

  const mode = useMemo(
    () => practiceModes.find((m) => m.id === modeId),
    [modeId],
  )

  const isCamera = modeId === 'ai-recognition'
  const totalQuestions = modeId ? (modeQuestions[modeId] ?? 10) : 10
  const totalSeconds = modeId ? (modeDurations[modeId] ?? 0) : 0
  const isTimed = totalSeconds > 0

  const questions = useMemo(() => {
    if (!mode || isCamera) return []
    const idx = practiceModes.findIndex((m) => m.id === mode.id)
    return pickQuestions(totalQuestions, idx * 3 + 1)
  }, [mode, totalQuestions, isCamera])

  const cameraLetters = useMemo(() => {
    if (!isCamera) return []
    return getRandomLetters(totalQuestions, 42)
  }, [isCamera, totalQuestions])

  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [checked, setChecked] = useState(false)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [timeLeft, setTimeLeft] = useState(totalSeconds)
  const [finished, setFinished] = useState(false)
  const timerRef = useRef<number | null>(null)

  const [letterTimeLeft, setLetterTimeLeft] = useState(15)
  const letterTimerRef = useRef<number | null>(null)
  const [cameraCorrect, setCameraCorrect] = useState(false)

  useEffect(() => {
    if (!finished || !mode) return
    const xp = Math.round((score / totalQuestions) * mode.xp)
    if (xp > 0) awardXP.mutate({ amount: xp, reason: 'practice' })
    recordSession.mutate({
      sessionType: 'practice',
      duration: totalSeconds > 0 ? totalSeconds - timeLeft : 0,
      signsAttempted: [],
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished])

  useEffect(() => {
    if (!isTimed || finished) return
    if (timerRef.current) window.clearInterval(timerRef.current)
    timerRef.current = window.setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          window.clearInterval(timerRef.current!)
          setFinished(true)
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current)
    }
  }, [isTimed, finished])

  useEffect(() => {
    if (!isCamera || finished || cameraCorrect) {
      if (letterTimerRef.current) clearInterval(letterTimerRef.current)
      return
    }
    setLetterTimeLeft(15)
    letterTimerRef.current = window.setInterval(() => {
      setLetterTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(letterTimerRef.current!)
          advanceCameraQuestion(false)
          return 15
        }
        return t - 1
      })
    }, 1000)
    return () => {
      if (letterTimerRef.current) clearInterval(letterTimerRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCamera, finished, current, cameraCorrect])

  const advanceCameraQuestion = useCallback(
    (correct: boolean) => {
      if (correct) {
        setScore((s) => s + 1)
        setStreak((s) => {
          const next = s + 1
          setBestStreak((b) => Math.max(b, next))
          return next
        })
      } else {
        setStreak(0)
      }

      setCameraCorrect(false)

      if (current + 1 >= totalQuestions) {
        setFinished(true)
      } else {
        setCurrent((c) => c + 1)
      }
    },
    [current, totalQuestions],
  )

  const handleCameraCorrect = useCallback(() => {
    setCameraCorrect(true)
    if (letterTimerRef.current) clearInterval(letterTimerRef.current)
    setTimeout(() => advanceCameraQuestion(true), 1200)
  }, [advanceCameraQuestion])

  if (!mode) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <h2 className="text-2xl font-bold font-display text-foreground">
          Practice mode not found
        </h2>
        <Link
          href="/dashboard/practice"
          className="inline-flex items-center gap-2 mt-6 h-11 px-6 rounded-sm bg-primary text-white hover:bg-[#0056a0] font-semibold text-sm font-body transition-all"
        >
          Back to practice
        </Link>
      </div>
    )
  }

  const progressPct = isCamera
    ? Math.round((current / totalQuestions) * 100)
    : Math.round(((current + (checked ? 1 : 0)) / totalQuestions) * 100)
  const timePct = isTimed ? Math.round((timeLeft / totalSeconds) * 100) : 100
  const accuracy = current > 0 ? Math.round((score / current) * 100) : 0

  function formatTime(s: number) {
    const mm = Math.floor(s / 60)
      .toString()
      .padStart(2, '0')
    const ss = (s % 60).toString().padStart(2, '0')
    return `${mm}:${ss}`
  }

  function onCheck() {
    if (!selected) return
    const q = questions[current]
    if (selected === q.answer) {
      setScore((s) => s + 1)
      setStreak((s) => {
        const next = s + 1
        setBestStreak((b) => Math.max(b, next))
        return next
      })
    } else {
      setStreak(0)
    }
    setChecked(true)
  }

  function onNext() {
    if (current + 1 >= totalQuestions) {
      setFinished(true)
      return
    }
    setCurrent((c) => c + 1)
    setSelected(null)
    setChecked(false)
  }

  function resetSession() {
    setCurrent(0)
    setSelected(null)
    setChecked(false)
    setScore(0)
    setStreak(0)
    setBestStreak(0)
    setTimeLeft(totalSeconds)
    setFinished(false)
    setCameraCorrect(false)
    setLetterTimeLeft(15)
  }

  if (finished) {
    const finalTotal = totalQuestions
    const earnedXp = Math.round((score / finalTotal) * mode.xp)
    return (
      <div className="flex flex-col gap-6 max-w-3xl mx-auto w-full">
        <div
          className="relative overflow-hidden rounded-sm text-white p-8 md:p-10 text-center"
          style={{
            background: `linear-gradient(135deg, ${mode.color}, ${mode.color}dd 60%, ${mode.color}99)`,
          }}
        >
          <div className="absolute -right-10 -top-10 w-56 h-56 rounded-full bg-white/10 blur-2xl" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-sm px-3 py-1 mb-4">
              <HugeiconsIcon icon={Rocket01Icon} size={14} />
              <span className="text-xs font-semibold font-body">Session complete</span>
            </div>
            <h2 className="text-[2rem] md:text-[2.5rem] font-bold font-display tracking-[-0.02em]">
              {mode.title} wrapped!
            </h2>
            <p className="text-white/80 font-body mt-2 max-w-md mx-auto">
              {score >= finalTotal * 0.8
                ? 'Outstanding work! You nailed it.'
                : score >= finalTotal * 0.5
                  ? 'Solid effort. Keep practicing daily to climb the leaderboard.'
                  : 'Keep at it! Practice makes perfect.'}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8 max-w-xl mx-auto">
              <SummaryStat label="Correct" value={`${score}/${finalTotal}`} />
              <SummaryStat label="Accuracy" value={`${Math.round((score / finalTotal) * 100)}%`} />
              <SummaryStat label="Best streak" value={`${bestStreak}`} icon="fire" />
              <SummaryStat label="XP earned" value={`+${earnedXp}`} icon="star" />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={resetSession}
            className="inline-flex items-center justify-center h-11 px-6 rounded-sm border border-slate-200 bg-white text-foreground hover:bg-slate-50 font-semibold text-sm font-body transition-all cursor-pointer"
          >
            Play again
          </button>
          <button
            type="button"
            onClick={() => router.push('/dashboard/practice')}
            className="inline-flex items-center justify-center h-11 px-6 rounded-sm bg-primary text-white hover:bg-[#0056a0] font-semibold text-sm font-body transition-all cursor-pointer"
          >
            Back to practice
          </button>
        </div>
      </div>
    )
  }

  if (isCamera) {
    const currentLetter = cameraLetters[current]
    const letterTimePct = Math.round((letterTimeLeft / 15) * 100)

    return (
      <div className="flex flex-col gap-6 max-w-3xl mx-auto w-full">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/practice"
            aria-label="Exit practice"
            className="w-10 h-10 flex items-center justify-center rounded-sm border border-slate-200 bg-white hover:bg-slate-50 text-muted transition-all"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={18} />
          </Link>
          <div className="flex-1 h-3 rounded-full bg-slate-200 overflow-hidden">
            <div
              className="h-full transition-all duration-300"
              style={{
                width: `${progressPct}%`,
                backgroundColor: mode.color,
              }}
            />
          </div>
          <div
            className={cn(
              'inline-flex items-center gap-1.5 px-3 h-10 rounded-sm bg-white border font-mono text-sm font-bold',
              letterTimeLeft <= 5
                ? 'border-destructive/30 text-destructive'
                : 'border-slate-200 text-foreground',
            )}
          >
            <HugeiconsIcon icon={Clock01Icon} size={15} />
            0:{letterTimeLeft.toString().padStart(2, '0')}
          </div>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <div
              className="text-[10px] uppercase tracking-wider font-semibold font-body"
              style={{ color: mode.color }}
            >
              {mode.title}
            </div>
            <h1 className="text-[1.25rem] font-bold font-display text-foreground">
              Letter {current + 1} of {totalQuestions}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <StatChip icon="star" label="Score" value={`${score}`} color="#00A86B" />
            <StatChip icon="fire" label="Streak" value={`${streak}`} color="#F59E0B" />
            <StatChip icon="star" label="Accuracy" value={`${accuracy}%`} color="#0064B2" />
          </div>
        </div>

        <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-1000',
              letterTimeLeft <= 5 ? 'bg-destructive' : 'bg-accent',
            )}
            style={{ width: `${letterTimePct}%` }}
          />
        </div>

        <div className="rounded-sm bg-white border border-slate-100 p-5 md:p-6">
          <CameraFeed
            key={currentLetter + current}
            targetLetter={currentLetter}
            onCorrect={handleCameraCorrect}
            autoCapture
            captureIntervalMs={1500}
            showReference
          />
        </div>

        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => advanceCameraQuestion(false)}
            className="text-sm text-muted hover:text-foreground font-body font-semibold transition-all cursor-pointer"
          >
            Skip this letter
          </button>
        </div>
      </div>
    )
  }

  const q = questions[current]
  const isRight = checked && selected === q.answer
  const isWrong = checked && selected !== q.answer

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto w-full">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/practice"
          aria-label="Exit practice"
          className="w-10 h-10 flex items-center justify-center rounded-sm border border-slate-200 bg-white hover:bg-slate-50 text-muted transition-all"
        >
          <HugeiconsIcon icon={Cancel01Icon} size={18} />
        </Link>
        <div className="flex-1 h-3 rounded-full bg-slate-200 overflow-hidden">
          <div
            className="h-full transition-all duration-300"
            style={{
              width: `${progressPct}%`,
              backgroundColor: mode.color,
            }}
          />
        </div>
        {isTimed ? (
          <div
            className={cn(
              'inline-flex items-center gap-1.5 px-3 h-10 rounded-sm bg-white border font-mono text-sm font-bold',
              timePct < 20
                ? 'border-destructive/30 text-destructive'
                : 'border-slate-200 text-foreground',
            )}
          >
            <HugeiconsIcon icon={Clock01Icon} size={15} />
            {formatTime(timeLeft)}
          </div>
        ) : (
          <div className="inline-flex items-center gap-1.5 px-3 h-10 rounded-sm bg-white border border-slate-200">
            <HugeiconsIcon icon={FlashIcon} size={15} className="text-accent" />
            <span className="text-xs font-semibold font-body text-muted">
              Untimed
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div
            className="text-[10px] uppercase tracking-wider font-semibold font-body"
            style={{ color: mode.color }}
          >
            {mode.title}
          </div>
          <h1 className="text-[1.25rem] font-bold font-display text-foreground">
            Question {current + 1} of {totalQuestions}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <StatChip
            icon="star"
            label="Score"
            value={`${score}`}
            color="#00A86B"
          />
          <StatChip
            icon="fire"
            label="Streak"
            value={`${streak}`}
            color="#F59E0B"
          />
          <StatChip
            icon="star"
            label="Accuracy"
            value={`${accuracy}%`}
            color="#0064B2"
          />
        </div>
      </div>

      <div className="rounded-sm bg-white border border-slate-100 p-6 md:p-8">
        <p className="text-sm font-body text-muted uppercase tracking-wider font-semibold">
          Prompt
        </p>
        <h2 className="text-[1.35rem] md:text-[1.5rem] font-bold font-display text-foreground mt-1 leading-snug">
          {q.prompt}
        </h2>

        {q.answer.length === 1 && ASL_IMGS[q.answer.toUpperCase()] ? (
          <div className="mt-6 flex items-center justify-center">
            <div
              className="w-36 h-36 md:w-44 md:h-44 rounded-sm border-2 flex items-center justify-center p-3"
              style={{
                borderColor: `${mode.color}44`,
                background: `linear-gradient(135deg, ${mode.color}10, ${mode.color}05)`,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={ASL_IMGS[q.answer.toUpperCase()]}
                alt="Identify this ASL sign"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        ) : null}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
          {q.options.map((opt) => {
            const isSelected = selected === opt
            const isAnswer = opt === q.answer
            return (
              <button
                key={opt}
                type="button"
                disabled={checked}
                onClick={() => setSelected(opt)}
                className={cn(
                  'h-20 rounded-sm border-2 text-lg font-bold font-display transition-all cursor-pointer select-none px-2',
                  !checked && !isSelected && 'border-slate-200 bg-white hover:border-primary/40 hover:bg-primary/5',
                  !checked && isSelected && 'border-primary bg-primary/10 text-primary',
                  checked && isAnswer && 'border-accent bg-accent/10 text-accent',
                  checked && !isAnswer && isSelected && 'border-destructive bg-destructive/10 text-destructive',
                  checked && !isAnswer && !isSelected && 'border-slate-100 bg-slate-50 text-muted opacity-60',
                  checked && 'cursor-default',
                )}
              >
                {opt}
              </button>
            )
          })}
        </div>
      </div>

      <div
        className={cn(
          'rounded-sm border p-5 flex flex-col md:flex-row md:items-center gap-4 justify-between transition-all',
          !checked && 'bg-white border-slate-100',
          isRight && 'bg-accent/5 border-accent/30',
          isWrong && 'bg-destructive/5 border-destructive/30',
        )}
      >
        <div className="flex items-center gap-3">
          {isRight && (
            <>
              <div className="w-10 h-10 rounded-sm bg-accent flex items-center justify-center text-white">
                <HugeiconsIcon icon={CheckmarkCircle02Icon} size={20} />
              </div>
              <div>
                <div className="text-sm font-bold font-display text-accent">
                  {streak >= 3 ? `${streak}-in-a-row!` : 'Correct!'}
                </div>
                <div className="text-xs text-muted font-body">Keep it going.</div>
              </div>
            </>
          )}
          {isWrong && (
            <>
              <div className="w-10 h-10 rounded-sm bg-destructive flex items-center justify-center text-white">
                <HugeiconsIcon icon={Cancel02Icon} size={20} />
              </div>
              <div>
                <div className="text-sm font-bold font-display text-destructive">Missed it</div>
                <div className="text-xs text-muted font-body">
                  Correct answer:{' '}
                  <span className="font-bold text-foreground">{q.answer}</span>
                </div>
              </div>
            </>
          )}
          {!checked && (
            <div className="text-sm text-muted font-body">
              Select your answer{isTimed ? ' before time runs out.' : '.'}
            </div>
          )}
        </div>

        {!checked ? (
          <button
            type="button"
            onClick={onCheck}
            disabled={!selected}
            className={cn(
              'inline-flex items-center justify-center h-11 px-6 rounded-sm font-semibold text-sm font-body transition-all',
              selected
                ? 'bg-primary text-white hover:bg-[#0056a0] cursor-pointer'
                : 'bg-slate-100 text-muted cursor-not-allowed',
            )}
          >
            Check
          </button>
        ) : (
          <button
            type="button"
            onClick={onNext}
            className="inline-flex items-center justify-center h-11 px-6 rounded-sm bg-primary text-white hover:bg-[#0056a0] font-semibold text-sm font-body transition-all cursor-pointer"
          >
            {current + 1 >= totalQuestions ? 'Finish' : 'Next question'}
          </button>
        )}
      </div>
    </div>
  )
}

function StatChip({
  icon,
  label,
  value,
  color,
}: {
  icon: 'star' | 'fire'
  label: string
  value: string
  color: string
}) {
  return (
    <div className="inline-flex items-center gap-2 px-3 h-10 rounded-sm bg-white border border-slate-200">
      <HugeiconsIcon
        icon={icon === 'fire' ? FireIcon : StarIcon}
        size={14}
        style={{ color }}
      />
      <div className="flex flex-col leading-none">
        <span className="text-[9px] uppercase tracking-wider font-semibold font-body text-muted">
          {label}
        </span>
        <span className="text-[13px] font-bold font-display text-foreground">
          {value}
        </span>
      </div>
    </div>
  )
}

function SummaryStat({
  label,
  value,
  icon,
}: {
  label: string
  value: string
  icon?: 'star' | 'fire'
}) {
  return (
    <div className="rounded-sm bg-white/15 backdrop-blur-sm p-4">
      <div className="text-[10px] uppercase tracking-wider font-semibold font-body opacity-90">
        {label}
      </div>
      <div className="text-[1.5rem] font-bold font-display leading-none mt-1 flex items-center justify-center gap-1">
        {icon === 'star' && <HugeiconsIcon icon={StarIcon} size={16} />}
        {icon === 'fire' && <HugeiconsIcon icon={FireIcon} size={16} />}
        {value}
      </div>
    </div>
  )
}
