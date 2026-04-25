'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Cancel01Icon,
  FavouriteIcon,
  CheckmarkCircle02Icon,
  Cancel02Icon,
  ArrowRight02Icon,
  Rocket01Icon,
  StarIcon,
} from '@hugeicons/core-free-icons'
import { useDashboardStats, useRecordSession, useAwardXP, useCompleteLesson, useUpdateLessonProgress, useLessonProgress } from '@/lib/hooks'
import { CameraFeed } from '@/components/dashboard/camera-feed'
import { cn } from '@/lib/utils'

type Sign = { sign: string; image: string }

type Question = {
  answer: string
  image: string
  options: string[]
  isAlphabet: boolean
}

type Phase = 'quiz' | 'sign-it'

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function buildQuestions(signs: Sign[]): Question[] {
  return signs.map((s) => {
    const isAlphabet = s.sign.length === 1 && /^[A-Z]$/i.test(s.sign)
    const wrong = shuffle(signs.filter((o) => o.sign !== s.sign))
      .slice(0, 3)
      .map((o) => o.sign)
    const options = shuffle([s.sign, ...wrong])
    return { answer: s.sign, image: s.image, options, isAlphabet }
  })
}

export default function LessonPlayerPage() {
  const params = useParams<{ lessonId: string }>()
  const router = useRouter()
  const lessonId = params?.lessonId
  const { data: stats } = useDashboardStats()
  const { data: progressData } = useLessonProgress()
  const recordSession = useRecordSession()
  const awardXP = useAwardXP()
  const completeLesson = useCompleteLesson()
  const updateLessonProgress = useUpdateLessonProgress()

  const allLessons = (progressData?.lessons ?? []) as Array<{
    lessonId: string
    title: string
    description: string
    xp: number
    total: number
    difficulty: string
    status: string
    progress: number
    signs: Sign[]
  }>

  const lesson = useMemo(
    () => allLessons.find((l) => l.lessonId === lessonId),
    [allLessons, lessonId],
  )

  const questions = useMemo(() => {
    if (!lesson || !lesson.signs || lesson.signs.length === 0) return []
    return buildQuestions(lesson.signs)
  }, [lesson])

  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [checked, setChecked] = useState(false)
  const [hearts, setHearts] = useState(5)
  const [correctCount, setCorrectCount] = useState(0)
  const [finished, setFinished] = useState(false)

  const [phase, setPhase] = useState<Phase>('quiz')
  const [signItLetter, setSignItLetter] = useState<string | null>(null)
  const [signItDone, setSignItDone] = useState(false)
  const [bonusXp, setBonusXp] = useState(0)

  useEffect(() => {
    if (stats?.hearts !== undefined) setHearts(stats.hearts)
  }, [stats?.hearts])

  useEffect(() => {
    if (!finished || !lesson || !lessonId) return
    const total = questions.length
    const xp = Math.round((correctCount / total) * (lesson.xp ?? 0)) + bonusXp
    const passed = correctCount >= Math.ceil(total * 0.6) && hearts > 0

    if (xp > 0) awardXP.mutate({ amount: xp, reason: 'lesson' })

    recordSession.mutate({
      sessionType: 'lesson',
      duration: 0,
      signsAttempted: questions.map((q: Question, i: number) => ({
        sign: q.answer,
        correct: i < correctCount,
      })),
    })

    if (passed) {
      completeLesson.mutate({
        lessonId,
        correctAnswers: correctCount,
        total,
      })
    } else {
      updateLessonProgress.mutate({
        lessonId,
        progress: correctCount,
        total,
        correctAnswers: correctCount,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished])

  if (!lesson) {
    return <NotFoundCard href="/dashboard/learn" label="Back to lessons" title="Lesson not found" />
  }

  if (questions.length === 0) {
    return <NotFoundCard href="/dashboard/learn" label="Back to lessons" title="No signs in this lesson" />
  }

  const total = questions.length
  const q = questions[current]
  const progressPct = Math.round(((current + (checked || phase === 'sign-it' ? 1 : 0)) / total) * 100)
  const earnedXp = Math.round((correctCount / total) * lesson.xp) + bonusXp

  function onCheck() {
    if (!selected) return
    const isRight = selected === q.answer
    if (isRight) setCorrectCount((c) => c + 1)
    else setHearts((h) => Math.max(0, h - 1))
    setChecked(true)
  }

  function onContinue() {
    if (checked && selected === q.answer && q.isAlphabet && phase === 'quiz') {
      setPhase('sign-it')
      setSignItLetter(q.answer.toUpperCase())
      setSignItDone(false)
      return
    }

    if (current + 1 >= total || hearts <= 0) {
      setFinished(true)
      return
    }
    setCurrent((c) => c + 1)
    setSelected(null)
    setChecked(false)
    setPhase('quiz')
    setSignItLetter(null)
    setSignItDone(false)
  }

  function skipSignIt() {
    if (current + 1 >= total || hearts <= 0) {
      setFinished(true)
      return
    }
    setCurrent((c) => c + 1)
    setSelected(null)
    setChecked(false)
    setPhase('quiz')
    setSignItLetter(null)
    setSignItDone(false)
  }

  function handleSignItCorrect() {
    setSignItDone(true)
    setBonusXp((b) => b + 5)
  }

  if (finished) {
    const passed = correctCount >= Math.ceil(total * 0.6) && hearts > 0
    return (
      <div className="flex flex-col gap-6 max-w-3xl mx-auto w-full">
        <div
          className={cn(
            'relative overflow-hidden rounded-sm text-white p-8 md:p-10 text-center',
            passed
              ? 'bg-gradient-to-br from-accent via-accent to-[#007a4f]'
              : 'bg-gradient-to-br from-[#EF4444] via-[#dc2626] to-[#991b1b]',
          )}
        >
          <div className="absolute -right-10 -top-10 w-56 h-56 rounded-full bg-white/10 blur-2xl" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-sm px-3 py-1 mb-4">
              <HugeiconsIcon icon={passed ? Rocket01Icon : FavouriteIcon} size={14} />
              <span className="text-xs font-semibold font-body">
                {passed ? 'Lesson complete' : 'Out of hearts'}
              </span>
            </div>
            <h2 className="text-[2rem] md:text-[2.5rem] font-bold font-display tracking-[-0.02em]">
              {passed ? 'Nicely done!' : 'So close!'}
            </h2>
            <p className="text-white/80 font-body mt-2 max-w-md mx-auto">
              {passed
                ? `You finished "${lesson.title}" and earned XP toward the next level.`
                : 'Take a short break and try this lesson again to keep your streak alive.'}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8 max-w-lg mx-auto">
              <SummaryStat label="Accuracy" value={`${Math.round((correctCount / total) * 100)}%`} />
              <SummaryStat label="XP earned" value={`+${earnedXp}`} />
              <SummaryStat label="Hearts left" value={`${hearts}`} />
              {bonusXp > 0 && <SummaryStat label="Camera bonus" value={`+${bonusXp}`} />}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={() => {
              setCurrent(0)
              setSelected(null)
              setChecked(false)
              setCorrectCount(0)
              setHearts(stats?.hearts ?? 5)
              setFinished(false)
              setPhase('quiz')
              setSignItLetter(null)
              setSignItDone(false)
              setBonusXp(0)
            }}
            className="inline-flex items-center justify-center h-11 px-6 rounded-sm border border-slate-200 bg-white text-foreground hover:bg-slate-50 font-semibold text-sm font-body transition-all cursor-pointer"
          >
            Try again
          </button>
          <button
            type="button"
            onClick={() => router.push('/dashboard/learn')}
            className="inline-flex items-center justify-center h-11 px-6 rounded-sm bg-primary text-white hover:bg-[#0056a0] font-semibold text-sm font-body transition-all cursor-pointer"
          >
            Back to lessons
          </button>
        </div>
      </div>
    )
  }

  const isRight = checked && selected === q.answer
  const isWrong = checked && selected !== q.answer

  if (phase === 'sign-it' && signItLetter) {
    return (
      <div className="flex flex-col gap-6 max-w-3xl mx-auto w-full">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/learn"
            aria-label="Exit lesson"
            className="w-10 h-10 flex items-center justify-center rounded-sm border border-slate-200 bg-white hover:bg-slate-50 text-muted transition-all"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={18} />
          </Link>
          <div className="flex-1 h-3 rounded-full bg-slate-200 overflow-hidden">
            <div
              className="h-full bg-accent transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 h-10 rounded-sm bg-white border border-slate-200">
            <HugeiconsIcon icon={FavouriteIcon} size={16} className="text-destructive" />
            <span className="text-sm font-bold font-display">{hearts}</span>
          </div>
        </div>

        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent rounded-sm px-3 py-1 mb-2">
            <span className="text-xs font-semibold font-body">Bonus Challenge</span>
          </div>
          <h1 className="text-[1.25rem] font-bold font-display text-foreground">
            Now sign it yourself!
          </h1>
          <p className="text-sm text-muted font-body mt-1">
            Practice signing the letter &ldquo;{signItLetter}&rdquo; with your camera to earn +5 bonus XP
          </p>
        </div>

        <div className="rounded-sm bg-white border border-slate-100 p-5 md:p-6">
          <CameraFeed
            key={signItLetter}
            targetLetter={signItLetter}
            onCorrect={handleSignItCorrect}
            autoCapture
            captureIntervalMs={1500}
            showReference
            compact
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={skipSignIt}
            className="text-sm text-muted hover:text-foreground font-body font-semibold transition-all cursor-pointer"
          >
            Skip
          </button>
          {signItDone && (
            <button
              type="button"
              onClick={skipSignIt}
              className="inline-flex items-center gap-2 h-11 px-6 rounded-sm bg-accent text-white hover:bg-accent/90 font-semibold text-sm font-body transition-all cursor-pointer"
            >
              Continue
              <HugeiconsIcon icon={ArrowRight02Icon} size={15} />
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto w-full">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/learn"
          aria-label="Exit lesson"
          className="w-10 h-10 flex items-center justify-center rounded-sm border border-slate-200 bg-white hover:bg-slate-50 text-muted transition-all"
        >
          <HugeiconsIcon icon={Cancel01Icon} size={18} />
        </Link>
        <div className="flex-1 h-3 rounded-full bg-slate-200 overflow-hidden">
          <div
            className="h-full bg-accent transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 h-10 rounded-sm bg-white border border-slate-200">
          <HugeiconsIcon icon={FavouriteIcon} size={16} className="text-destructive" />
          <span className="text-sm font-bold font-display">{hearts}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-wider font-semibold font-body text-muted">
            {lesson.difficulty} lesson
          </div>
          <h1 className="text-[1.25rem] font-bold font-display text-foreground">
            {lesson.title}
          </h1>
        </div>
        <div className="text-[11px] font-body text-muted">
          Question <span className="font-bold font-display text-foreground">{current + 1}</span>{' '}
          of {total}
        </div>
      </div>

      <div className="rounded-sm bg-white border border-slate-100 p-6 md:p-8">
        <p className="text-sm font-body text-muted uppercase tracking-wider font-semibold">
          What sign is this?
        </p>

        <div className="mt-6 flex items-center justify-center">
          <div className="w-48 h-48 md:w-56 md:h-56 rounded-sm bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 border border-primary/20 flex items-center justify-center overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={q.image}
              alt="Sign to identify"
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
          {q.options.map((opt: string) => {
            const isSelected = selected === opt
            const isAnswer = opt === q.answer
            return (
              <button
                key={opt}
                type="button"
                disabled={checked}
                onClick={() => setSelected(opt)}
                className={cn(
                  'h-20 rounded-sm border-2 text-lg font-bold font-display transition-all cursor-pointer select-none',
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
                <div className="text-sm font-bold font-display text-accent">Correct!</div>
                <div className="text-xs text-muted font-body">
                  +{Math.round(lesson.xp / total)} XP added
                  {q.isAlphabet && (
                    <span className="text-accent"> — Sign it next for bonus XP!</span>
                  )}
                </div>
              </div>
            </>
          )}
          {isWrong && (
            <>
              <div className="w-10 h-10 rounded-sm bg-destructive flex items-center justify-center text-white">
                <HugeiconsIcon icon={Cancel02Icon} size={20} />
              </div>
              <div>
                <div className="text-sm font-bold font-display text-destructive">Not quite</div>
                <div className="text-xs text-muted font-body">
                  Correct answer:{' '}
                  <span className="font-bold text-foreground">{q.answer}</span>
                </div>
              </div>
            </>
          )}
          {!checked && (
            <div className="text-sm text-muted font-body">
              Select an option, then check your answer.
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
            onClick={onContinue}
            className="inline-flex items-center gap-2 h-11 px-6 rounded-sm bg-primary text-white hover:bg-[#0056a0] font-semibold text-sm font-body transition-all cursor-pointer"
          >
            {isRight && q.isAlphabet ? 'Sign it!' : current + 1 >= total ? 'Finish' : 'Continue'}
            <HugeiconsIcon icon={ArrowRight02Icon} size={15} />
          </button>
        )}
      </div>
    </div>
  )
}

function SummaryStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-sm bg-white/15 backdrop-blur-sm p-4">
      <div className="text-[10px] uppercase tracking-wider font-semibold font-body opacity-90">
        {label}
      </div>
      <div className="text-[1.5rem] font-bold font-display leading-none mt-1 flex items-center justify-center gap-1">
        {label.includes('XP') && <HugeiconsIcon icon={StarIcon} size={16} />}
        {value}
      </div>
    </div>
  )
}

function NotFoundCard({
  title,
  href,
  label,
}: {
  title: string
  href: string
  label: string
}) {
  return (
    <div className="max-w-md mx-auto text-center py-16">
      <h2 className="text-2xl font-bold font-display text-foreground">{title}</h2>
      <p className="text-sm text-muted font-body mt-2">
        The item you&apos;re looking for doesn&apos;t exist or is no longer available.
      </p>
      <Link
        href={href}
        className="inline-flex items-center gap-2 mt-6 h-11 px-6 rounded-sm bg-primary text-white hover:bg-[#0056a0] font-semibold text-sm font-body transition-all"
      >
        {label}
      </Link>
    </div>
  )
}
