'use client'

import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Cancel01Icon,
  Clock01Icon,
  StarIcon,
  CheckmarkCircle02Icon,
  Cancel02Icon,
  Rocket01Icon,
  Award01Icon,
  TaskDaily02Icon,
  Target02Icon,
  FireIcon,
  PlayCircleIcon,
} from '@hugeicons/core-free-icons'
import { mockTests, pickQuestions } from '@/lib/game/data'
import { getRandomLetters, getLetterInfo } from '@/lib/game/asl-alphabet'
import { CameraFeed } from '@/components/dashboard/camera-feed'
import { ASL_IMGS } from '@/lib/asl-data'
import { useRecordSession, useAwardXP } from '@/lib/hooks'
import { cn } from '@/lib/utils'

type TestQuestion = {
  type: 'camera' | 'quiz'
  /** For camera: the letter to sign. For quiz: questionBank index. */
  letter?: string
  prompt?: string
  answer?: string
  options?: string[]
}

export default function MockTestSessionPage() {
  const params = useParams<{ testId: string }>()
  const router = useRouter()
  const testId = params?.testId
  const recordSession = useRecordSession()
  const awardXP = useAwardXP()

  const test = useMemo(
    () => mockTests.find((t) => t.id === testId),
    [testId],
  )

  // Build questions mix: camera alphabet questions + quiz questions
  const questions = useMemo<TestQuestion[]>(() => {
    if (!test) return []

    const total = test.questions
    const testIdx = mockTests.findIndex((t) => t.id === test.id)

    // Alphabet Mastery (mt-1): all camera
    // Others: mix camera + quiz
    if (test.id === 'mt-1') {
      return getRandomLetters(total, testIdx * 7).map((l) => ({
        type: 'camera' as const,
        letter: l,
      }))
    }

    // Mix: roughly 60% camera, 40% quiz
    const cameraCount = Math.round(total * 0.6)
    const quizCount = total - cameraCount

    const cameraQs: TestQuestion[] = getRandomLetters(cameraCount, testIdx * 7).map(
      (l) => ({ type: 'camera' as const, letter: l }),
    )

    const quizQs: TestQuestion[] = pickQuestions(quizCount, testIdx * 5).map(
      (q) => ({
        type: 'quiz' as const,
        prompt: q.prompt,
        answer: q.answer,
        options: q.options,
      }),
    )

    // Interleave
    const mixed: TestQuestion[] = []
    let ci = 0
    let qi = 0
    for (let i = 0; i < total; i++) {
      if (ci < cameraQs.length && (qi >= quizQs.length || i % 3 !== 2)) {
        mixed.push(cameraQs[ci++])
      } else if (qi < quizQs.length) {
        mixed.push(quizQs[qi++])
      } else if (ci < cameraQs.length) {
        mixed.push(cameraQs[ci++])
      }
    }
    return mixed
  }, [test])

  const totalSeconds = (test?.duration ?? 15) * 60

  /* ---- state ---- */
  const [started, setStarted] = useState(false)
  const [current, setCurrent] = useState(0)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(totalSeconds)
  const [finished, setFinished] = useState(false)
  const [answers, setAnswers] = useState<boolean[]>([])
  const timerRef = useRef<number | null>(null)

  // Quiz question state
  const [selected, setSelected] = useState<string | null>(null)
  const [checked, setChecked] = useState(false)

  // Camera question state
  const [letterTimeLeft, setLetterTimeLeft] = useState(12)
  const letterTimerRef = useRef<number | null>(null)
  const [cameraMatched, setCameraMatched] = useState(false)

  /* ---- overall timer ---- */
  useEffect(() => {
    if (!started || finished) return
    timerRef.current = window.setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!)
          setFinished(true)
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [started, finished])

  /* ---- per-letter timer for camera questions ---- */
  useEffect(() => {
    if (!started || finished) return
    const q = questions[current]
    if (q?.type !== 'camera' || cameraMatched) {
      if (letterTimerRef.current) clearInterval(letterTimerRef.current)
      return
    }
    setLetterTimeLeft(12)
    letterTimerRef.current = window.setInterval(() => {
      setLetterTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(letterTimerRef.current!)
          advanceQuestion(false)
          return 12
        }
        return t - 1
      })
    }, 1000)
    return () => {
      if (letterTimerRef.current) clearInterval(letterTimerRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, finished, current, cameraMatched])

  useEffect(() => {
    if (!finished || !test) return
    const pct = Math.round((score / questions.length) * 100)
    const xp = Math.round((score / questions.length) * 100)
    if (xp > 0) awardXP.mutate({ amount: xp, reason: 'test' })
    recordSession.mutate({
      sessionType: 'test',
      duration: totalSeconds - timeLeft,
      signsAttempted: answers.map((correct, i) => ({
        sign: questions[i]?.letter ?? questions[i]?.answer ?? 'unknown',
        correct,
      })),
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished])

  const advanceQuestion = useCallback(
    (correct: boolean) => {
      setAnswers((prev) => [...prev, correct])
      if (correct) setScore((s) => s + 1)
      setCameraMatched(false)
      setSelected(null)
      setChecked(false)

      if (current + 1 >= questions.length) {
        setFinished(true)
      } else {
        setCurrent((c) => c + 1)
      }
    },
    [current, questions.length],
  )

  const handleCameraCorrect = useCallback(() => {
    setCameraMatched(true)
    if (letterTimerRef.current) clearInterval(letterTimerRef.current)
    setTimeout(() => advanceQuestion(true), 800)
  }, [advanceQuestion])

  function handleQuizCheck() {
    if (!selected) return
    const q = questions[current]
    const correct = selected === q.answer
    setChecked(true)
    setTimeout(() => advanceQuestion(correct), 1000)
  }

  function formatTime(s: number) {
    const mm = Math.floor(s / 60).toString().padStart(2, '0')
    const ss = (s % 60).toString().padStart(2, '0')
    return `${mm}:${ss}`
  }

  /* ---- Not found ---- */
  if (!test) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <h2 className="text-2xl font-bold font-display text-foreground">
          Test not found
        </h2>
        <Link
          href="/dashboard/mock-test"
          className="inline-flex items-center gap-2 mt-6 h-11 px-6 rounded-sm bg-primary text-white hover:bg-[#0056a0] font-semibold text-sm font-body transition-all"
        >
          Back to tests
        </Link>
      </div>
    )
  }

  /* ---- Start screen ---- */
  if (!started) {
    return (
      <div className="flex flex-col gap-6 max-w-2xl mx-auto w-full">
        <div className="relative overflow-hidden rounded-sm bg-gradient-to-br from-[#8B5CF6] via-[#7c3aed] to-[#5b21b6] text-white p-8 md:p-10 text-center">
          <div className="absolute -right-10 -top-10 w-56 h-56 rounded-full bg-white/10 blur-2xl" />
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-white/15 mx-auto flex items-center justify-center mb-4">
              <HugeiconsIcon icon={TaskDaily02Icon} size={30} />
            </div>
            <h2 className="text-[1.75rem] md:text-[2.25rem] font-bold font-display tracking-[-0.02em]">
              {test.title}
            </h2>
            <p className="text-white/80 font-body mt-2 max-w-md mx-auto">
              {test.description}
            </p>

            <div className="grid grid-cols-3 gap-3 mt-8 max-w-sm mx-auto">
              <div className="rounded-sm bg-white/15 backdrop-blur-sm p-3">
                <div className="text-[10px] uppercase tracking-wider font-semibold font-body opacity-80">
                  Questions
                </div>
                <div className="text-[1.25rem] font-bold font-display mt-0.5">
                  {test.questions}
                </div>
              </div>
              <div className="rounded-sm bg-white/15 backdrop-blur-sm p-3">
                <div className="text-[10px] uppercase tracking-wider font-semibold font-body opacity-80">
                  Time limit
                </div>
                <div className="text-[1.25rem] font-bold font-display mt-0.5">
                  {test.duration}m
                </div>
              </div>
              <div className="rounded-sm bg-white/15 backdrop-blur-sm p-3">
                <div className="text-[10px] uppercase tracking-wider font-semibold font-body opacity-80">
                  Difficulty
                </div>
                <div className="text-[1.25rem] font-bold font-display mt-0.5 capitalize">
                  {test.difficulty}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="rounded-sm bg-white border border-slate-100 p-6">
          <h3 className="text-[1.125rem] font-bold font-display text-foreground mb-4">
            Before you begin
          </h3>
          <ul className="flex flex-col gap-3 text-sm font-body text-muted">
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-[11px] font-bold font-display text-purple-600">1</span>
              </div>
              <span>
                This test uses your <strong className="text-foreground">camera</strong> to recognize ASL alphabet signs.
                Make sure your webcam is accessible and well-lit.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-[11px] font-bold font-display text-purple-600">2</span>
              </div>
              <span>
                For camera questions, you have <strong className="text-foreground">12 seconds</strong> to sign each letter.
                The AI will detect your sign automatically.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-[11px] font-bold font-display text-purple-600">3</span>
              </div>
              <span>
                Some questions are <strong className="text-foreground">multiple choice</strong> — select the correct answer
                from the options provided.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-[11px] font-bold font-display text-purple-600">4</span>
              </div>
              <span>
                Score <strong className="text-foreground">70% or higher</strong> to pass. Good luck!
              </span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/dashboard/mock-test"
            className="inline-flex items-center justify-center h-11 px-6 rounded-sm border border-slate-200 bg-white text-foreground hover:bg-slate-50 font-semibold text-sm font-body transition-all"
          >
            Go back
          </Link>
          <button
            type="button"
            onClick={() => setStarted(true)}
            className="inline-flex items-center justify-center gap-2 h-11 px-8 rounded-sm bg-[#8B5CF6] text-white hover:bg-[#7c3aed] font-semibold text-sm font-body transition-all cursor-pointer"
          >
            <HugeiconsIcon icon={PlayCircleIcon} size={16} />
            Begin Test
          </button>
        </div>
      </div>
    )
  }

  /* ---- Results screen ---- */
  if (finished) {
    const totalQ = questions.length
    const pct = Math.round((score / totalQ) * 100)
    const passed = pct >= 70
    const cameraQs = answers.filter((_, i) => questions[i]?.type === 'camera')
    const cameraCorrect = cameraQs.filter(Boolean).length
    const quizQs = answers.filter((_, i) => questions[i]?.type === 'quiz')
    const quizCorrect = quizQs.filter(Boolean).length

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
              <HugeiconsIcon icon={passed ? Award01Icon : Cancel02Icon} size={14} />
              <span className="text-xs font-semibold font-body">
                {passed ? 'Test passed!' : 'Not quite — try again'}
              </span>
            </div>
            <h2 className="text-[2rem] md:text-[2.5rem] font-bold font-display tracking-[-0.02em]">
              {test.title}
            </h2>
            <p className="text-white/80 font-body mt-2 max-w-md mx-auto">
              {passed
                ? 'Excellent work! You demonstrated strong ASL knowledge.'
                : 'Keep practicing and come back when you\'re ready to try again.'}
            </p>

            {/* Score circle */}
            <div className="mt-8 mb-6">
              <div
                className={cn(
                  'w-28 h-28 rounded-full mx-auto flex flex-col items-center justify-center border-4',
                  passed ? 'border-white/40' : 'border-white/30',
                )}
              >
                <span className="text-[2.5rem] font-bold font-display leading-none">
                  {pct}%
                </span>
                <span className="text-[10px] uppercase tracking-wider font-body opacity-80">
                  Score
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-xl mx-auto">
              <div className="rounded-sm bg-white/15 backdrop-blur-sm p-3">
                <div className="text-[10px] uppercase tracking-wider font-semibold font-body opacity-80">
                  Correct
                </div>
                <div className="text-[1.25rem] font-bold font-display mt-0.5">
                  {score}/{totalQ}
                </div>
              </div>
              <div className="rounded-sm bg-white/15 backdrop-blur-sm p-3">
                <div className="text-[10px] uppercase tracking-wider font-semibold font-body opacity-80">
                  Camera signs
                </div>
                <div className="text-[1.25rem] font-bold font-display mt-0.5">
                  {cameraCorrect}/{cameraQs.length}
                </div>
              </div>
              <div className="rounded-sm bg-white/15 backdrop-blur-sm p-3">
                <div className="text-[10px] uppercase tracking-wider font-semibold font-body opacity-80">
                  Quiz answers
                </div>
                <div className="text-[1.25rem] font-bold font-display mt-0.5">
                  {quizCorrect}/{quizQs.length}
                </div>
              </div>
              <div className="rounded-sm bg-white/15 backdrop-blur-sm p-3">
                <div className="text-[10px] uppercase tracking-wider font-semibold font-body opacity-80">
                  Time used
                </div>
                <div className="text-[1.25rem] font-bold font-display mt-0.5">
                  {formatTime(totalSeconds - timeLeft)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Answer breakdown */}
        <div className="rounded-sm bg-white border border-slate-100 p-6">
          <h3 className="text-[1rem] font-bold font-display text-foreground mb-4">
            Question breakdown
          </h3>
          <div className="flex flex-wrap gap-2">
            {answers.map((correct, i) => (
              <div
                key={i}
                className={cn(
                  'w-9 h-9 rounded-sm flex items-center justify-center text-[11px] font-bold font-display border',
                  correct
                    ? 'bg-accent/10 border-accent/30 text-accent'
                    : 'bg-destructive/10 border-destructive/30 text-destructive',
                )}
                title={`Q${i + 1}: ${questions[i]?.type === 'camera' ? `Sign "${questions[i]?.letter}"` : 'Quiz'} — ${correct ? 'Correct' : 'Wrong'}`}
              >
                {i + 1}
              </div>
            ))}
            {/* Unanswered (if time ran out) */}
            {Array.from({ length: questions.length - answers.length }).map((_, i) => (
              <div
                key={`u-${i}`}
                className="w-9 h-9 rounded-sm flex items-center justify-center text-[11px] font-bold font-display border border-slate-200 bg-slate-50 text-muted"
                title={`Q${answers.length + i + 1}: Unanswered`}
              >
                {answers.length + i + 1}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={() => {
              setStarted(false)
              setCurrent(0)
              setScore(0)
              setTimeLeft(totalSeconds)
              setFinished(false)
              setAnswers([])
              setSelected(null)
              setChecked(false)
              setCameraMatched(false)
              setLetterTimeLeft(12)
            }}
            className="inline-flex items-center justify-center h-11 px-6 rounded-sm border border-slate-200 bg-white text-foreground hover:bg-slate-50 font-semibold text-sm font-body transition-all cursor-pointer"
          >
            Retake test
          </button>
          <button
            type="button"
            onClick={() => router.push('/dashboard/mock-test')}
            className="inline-flex items-center justify-center h-11 px-6 rounded-sm bg-primary text-white hover:bg-[#0056a0] font-semibold text-sm font-body transition-all cursor-pointer"
          >
            Back to tests
          </button>
        </div>
      </div>
    )
  }

  /* ---- Active test ---- */
  const q = questions[current]
  const progressPct = Math.round((current / questions.length) * 100)
  const timePct = Math.round((timeLeft / totalSeconds) * 100)

  return (
    <div className="flex flex-col gap-5 max-w-3xl mx-auto w-full">
      {/* Top bar */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/mock-test"
          aria-label="Exit test"
          className="w-10 h-10 flex items-center justify-center rounded-sm border border-slate-200 bg-white hover:bg-slate-50 text-muted transition-all"
        >
          <HugeiconsIcon icon={Cancel01Icon} size={18} />
        </Link>
        <div className="flex-1 h-3 rounded-full bg-slate-200 overflow-hidden">
          <div
            className="h-full bg-[#8B5CF6] transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
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
      </div>

      {/* Stats strip */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="text-[10px] uppercase tracking-wider font-semibold font-body text-purple-600">
            {test.title}
          </div>
          <h1 className="text-[1.125rem] font-bold font-display text-foreground">
            Question {current + 1} of {questions.length}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-2 px-3 h-10 rounded-sm bg-white border border-slate-200">
            <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} className="text-accent" />
            <div className="flex flex-col leading-none">
              <span className="text-[9px] uppercase tracking-wider font-semibold font-body text-muted">
                Score
              </span>
              <span className="text-[13px] font-bold font-display text-foreground">
                {score}/{current}
              </span>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 px-3 h-10 rounded-sm bg-white border border-slate-200">
            <HugeiconsIcon
              icon={q.type === 'camera' ? Target02Icon : TaskDaily02Icon}
              size={14}
              className="text-purple-600"
            />
            <div className="flex flex-col leading-none">
              <span className="text-[9px] uppercase tracking-wider font-semibold font-body text-muted">
                Type
              </span>
              <span className="text-[13px] font-bold font-display text-foreground">
                {q.type === 'camera' ? 'Sign it' : 'Quiz'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Camera question */}
      {q.type === 'camera' && q.letter && (
        <>
          {/* Per-letter timer bar */}
          <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden">
            <div
              className={cn(
                'h-full rounded-full transition-all duration-1000',
                letterTimeLeft <= 4 ? 'bg-destructive' : 'bg-[#8B5CF6]',
              )}
              style={{ width: `${Math.round((letterTimeLeft / 12) * 100)}%` }}
            />
          </div>

          <div className="rounded-sm bg-white border border-slate-100 p-5 md:p-6">
            <CameraFeed
              key={`${q.letter}-${current}`}
              targetLetter={q.letter}
              onCorrect={handleCameraCorrect}
              autoCapture
              captureIntervalMs={1500}
              showReference
            />
          </div>

          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => advanceQuestion(false)}
              className="text-sm text-muted hover:text-foreground font-body font-semibold transition-all cursor-pointer"
            >
              Skip
            </button>
          </div>
        </>
      )}

      {/* Quiz question */}
      {q.type === 'quiz' && (
        <>
          <div className="rounded-sm bg-white border border-slate-100 p-6 md:p-8">
            <p className="text-sm font-body text-muted uppercase tracking-wider font-semibold">
              Prompt
            </p>
            <h2 className="text-[1.25rem] md:text-[1.35rem] font-bold font-display text-foreground mt-1 leading-snug">
              {q.prompt}
            </h2>

            {q.answer && q.answer.length === 1 && ASL_IMGS[q.answer.toUpperCase()] && (
              <div className="mt-5 flex items-center justify-center">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-sm border-2 border-purple-200 bg-purple-50/50 flex items-center justify-center p-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={ASL_IMGS[q.answer.toUpperCase()]}
                    alt="Identify this ASL sign"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 mt-6">
              {q.options?.map((opt) => {
                const isSelected = selected === opt
                const isAnswer = opt === q.answer
                return (
                  <button
                    key={opt}
                    type="button"
                    disabled={checked}
                    onClick={() => setSelected(opt)}
                    className={cn(
                      'h-16 rounded-sm border-2 text-base font-bold font-display transition-all cursor-pointer select-none px-3',
                      !checked && !isSelected && 'border-slate-200 bg-white hover:border-purple-400 hover:bg-purple-50',
                      !checked && isSelected && 'border-[#8B5CF6] bg-purple-50 text-[#8B5CF6]',
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

          <div className="flex justify-end">
            {!checked ? (
              <button
                type="button"
                onClick={handleQuizCheck}
                disabled={!selected}
                className={cn(
                  'inline-flex items-center justify-center h-11 px-6 rounded-sm font-semibold text-sm font-body transition-all',
                  selected
                    ? 'bg-[#8B5CF6] text-white hover:bg-[#7c3aed] cursor-pointer'
                    : 'bg-slate-100 text-muted cursor-not-allowed',
                )}
              >
                Submit
              </button>
            ) : (
              <div className="flex items-center gap-3">
                {selected === q.answer ? (
                  <div className="flex items-center gap-2 text-accent font-semibold text-sm font-body">
                    <HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} />
                    Correct!
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-destructive font-semibold text-sm font-body">
                    <HugeiconsIcon icon={Cancel02Icon} size={18} />
                    Wrong — answer: {q.answer}
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
