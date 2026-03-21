'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Heading, BodyText } from '../common/typography'
import { ArrowRight01Icon, RefreshIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { ASL_IMGS } from '@/lib/asl-data'
import { useSound } from '@/lib/use-sound'

// ─── Types ────────────────────────────────────────────────────────────────────
type Result = 'pending' | 'correct' | 'incorrect'

interface QuestionVariant {
  id: string
  letter: string
  img: string
  prompt: string
  choices: string[]
}

interface WordConfig {
  word: string
  hint: string
  slogan: string
}

// ─── Word pool ────────────────────────────────────────────────────────────────
const WORD_POOL: WordConfig[] = [
  { word: 'MCNEESE', hint: 'Mcneese State University · Lake Charles, LA', slogan: 'Spell the name of this proud Louisiana university!' },
  { word: 'COWBOYS', hint: 'The Mcneese Cowboys — the official athletic mascot', slogan: 'This is the nickname of the Mcneese State athletic teams!' },
  { word: 'CHARLES', hint: 'Lake Charles, LA — home city of Mcneese State University', slogan: 'Spell the name of the city where Mcneese is located!' },
  { word: 'CALCASIEU', hint: 'Calcasieu Parish — the parish where Mcneese is located', slogan: 'Spell the name of the parish that is home to Mcneese!' },
  { word: 'BURRIDGE', hint: 'Burridge-Wetsel Gymnasium — iconic Mcneese sports venue', slogan: 'Spell the name of a historic Mcneese athletic facility!' },
  { word: 'SULPHUR', hint: 'Sulphur, LA — a neighboring city to Mcneese\'s Lake Charles campus', slogan: 'Spell the name of a city neighboring Mcneese State!' },
  { word: 'LEGION', hint: 'Legion Field — the historic football stadium at Mcneese', slogan: 'Spell the name of Mcneese\'s storied football field!' },
]

// Use shared ASL image map
const IMGS = ASL_IMGS

const DISTRACTORS: Record<string, string[]> = {
  A: ['S', 'E', 'N'], B: ['P', 'F', 'K'], C: ['O', 'G', 'Q'], D: ['G', 'F', 'O'],
  E: ['A', 'S', 'O'], F: ['D', 'P', 'B'], G: ['C', 'D', 'Q'], H: ['U', 'N', 'V'],
  I: ['Y', 'J', 'L'], J: ['I', 'Y', 'X'], K: ['P', 'V', 'R'], L: ['I', 'Y', 'K'],
  M: ['N', 'W', 'T'], N: ['M', 'H', 'U'], O: ['C', 'G', 'D'], P: ['K', 'F', 'B'],
  Q: ['G', 'C', 'O'], R: ['U', 'V', 'K'], S: ['A', 'E', 'T'], T: ['M', 'N', 'D'],
  U: ['H', 'N', 'R'], V: ['U', 'K', 'R'], W: ['M', 'N', 'E'], X: ['D', 'G', 'J'],
  Y: ['I', 'J', 'L'], Z: ['X', 'J', 'I'],
}

const PROMPTS: Record<string, string[]> = {
  A: ['Thumb rests beside a closed fist — which letter?', 'A rounded fist with thumb to the side — what letter?'],
  B: ['Four fingers extended flat, thumb tucked in — which letter?', 'Flat vertical hand with thumb folded across — what letter?'],
  C: ['Hand curves like an open cup — which letter?', 'A half-circle shape with all fingers together — what letter?'],
  D: ['Index finger makes a circle with the thumb — which letter?', 'One finger pointing up, others curl to thumb — what letter?'],
  E: ['Four fingers curl down to meet the thumb — which letter?', 'A claw-like hand with all fingers bent — what letter?'],
  F: ['Index and thumb touch making a circle, others up — which letter?', 'OK-like shape with three fingers extended — what letter?'],
  G: ['Index points sideways, thumb parallel — which letter?', 'Hand like a gun pointing horizontally — what letter?'],
  H: ['Index and middle extend together sideways — which letter?', 'Two fingers extended flat and horizontal — what letter?'],
  I: ['Pinky extended straight up, fist closed — which letter?', 'Only the pinky finger raised — what letter?'],
  J: ['Pinky traces a J shape in the air — which letter?', 'Little finger draws a hook downward — what letter?'],
  K: ['Index up, middle points out, thumb between them — which letter?', 'Two fingers spread with thumb in the middle — what letter?'],
  L: ['Index points up, thumb points out like an L — which letter?', 'Thumb and index form a right angle — what letter?'],
  M: ['Three fingers draped over the tucked thumb — which letter?', 'A fist with thumb under three fingers — what letter?'],
  N: ['Two fingers rest on the thumb — which letter?', 'Index and middle tucked under the thumb — what letter?'],
  O: ['All fingers and thumb meet in a circle — which letter?', 'Hand forms a perfect round O shape — what letter?'],
  P: ['Like K but pointed downward — which letter?', 'Index and middle point down, thumb out — what letter?'],
  Q: ['Like G but pointing downward — which letter?', 'Index and thumb pinch, pointing down — what letter?'],
  R: ['Index and middle crossed over each other — which letter?', 'Two fingers twisted together — what letter?'],
  S: ['Closed fist with thumb across the fingers — which letter?', 'Thumb wraps in front of all curled fingers — what letter?'],
  T: ['Thumb pokes between index and middle fingers — which letter?', 'Fist with thumb tucked between two fingers — what letter?'],
  U: ['Index and middle point up together — which letter?', 'Two fingers extended straight up side by side — what letter?'],
  V: ['Index and middle spread apart like a V — which letter?', 'Two fingers spread wide, others curled in — what letter?'],
  W: ['Three fingers spread open like a W — which letter?', 'Index, middle and ring fan out separately — what letter?'],
  X: ['Index finger hooks like a bent hook — which letter?', 'A crooked index finger making a hook — what letter?'],
  Y: ['Thumb and pinky extended, others curled — which letter?', 'A hang-loose style shape with thumb and pinky — what letter?'],
  Z: ['Index finger traces a Z in the air — which letter?', 'Finger draws a zigzag shape — what letter?'],
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function buildChoices(letter: string): string[] {
  const distractors = shuffle(DISTRACTORS[letter] ?? ['A', 'B', 'C']).slice(0, 3)
  return shuffle([letter, ...distractors])
}

function buildQuestion(letter: string, idSuffix: string): QuestionVariant {
  const prompts = PROMPTS[letter] ?? [`Which ASL letter is this?`]
  return {
    id: `${letter}-${idSuffix}`,
    letter,
    img: IMGS[letter] ?? IMGS.A,
    prompt: pickRandom(prompts),
    choices: buildChoices(letter),
  }
}

interface Session {
  wordConfig: WordConfig
  questions: QuestionVariant[]
  wordOrder: number[]
}

function buildSession(): Session {
  const wordConfig = pickRandom(WORD_POOL)
  const word = wordConfig.word.replace(/[^A-Z]/g, '')
  const questionsByPosition: QuestionVariant[] = word.split('').map((letter, i) =>
    buildQuestion(letter, String(i))
  )
  const order = shuffle(word.split('').map((_, i) => i))
  const questions = order.map(i => questionsByPosition[i])
  return { wordConfig, questions, wordOrder: order }
}

// ─── Confetti canvas ──────────────────────────────────────────────────────────
const ConfettiCanvas = ({ active }: { active: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)

  useEffect(() => {
    if (!active) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const COLORS = ['#FFD51D', '#0064B2', '#ffffff', '#FFD51D', '#0064B2']
    const particles = Array.from({ length: 130 }, () => ({
      x: Math.random() * canvas.width,
      y: -10 - Math.random() * 200,
      vx: (Math.random() - 0.5) * 4,
      vy: 2 + Math.random() * 4,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: 6 + Math.random() * 8,
      angle: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.2,
      rect: Math.random() > 0.5,
    }))

    let frame = 0
    const draw = () => {
      if (!canvas || !ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        p.x += p.vx
        p.y += p.vy
        p.angle += p.spin
        p.vy += 0.06
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.angle)
        ctx.fillStyle = p.color
        if (p.rect) {
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2)
        } else {
          ctx.beginPath()
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.restore()
      })
      frame++
      if (frame < 200) {
        animRef.current = requestAnimationFrame(draw)
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }
    }
    animRef.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(animRef.current)
  }, [active])

  if (!active) return null
  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-20"
    />
  )
}

// ─── Reveal tile ──────────────────────────────────────────────────────────────
const RevealTile = ({ letter, status, delay, active }: {
  letter: string; status: Result; delay: number; active: boolean
}) => {
  const [shown, setShown] = useState(false)
  useEffect(() => {
    if (!active) { setShown(false); return }
    const t = setTimeout(() => setShown(true), delay)
    return () => clearTimeout(t)
  }, [active, delay])

  return (
    <div
      className={`w-11 h-11 rounded-sm flex items-center justify-center text-base font-bold font-display border-2 transition-all duration-500
        ${status === 'correct'
          ? 'bg-[var(--success)]/15 text-[var(--success)] border-[var(--success)]'
          : status === 'incorrect'
          ? 'bg-[var(--destructive)]/15 text-[var(--destructive)] border-[var(--destructive)]'
          : 'bg-white/40 border-white/50 text-[var(--primary)]'}
        ${shown ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-50 translate-y-4'}
      `}
    >
      {letter}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
const _initSession = buildSession()

const ASLQuizSection = () => {
  const [session, setSession] = useState<Session>(_initSession)
  const [step, setStep] = useState(0)
  const [results, setResults] = useState<Result[]>(
    () => Array(_initSession.wordConfig.word.replace(/[^A-Z]/g, '').length).fill('pending')
  )
  const [chosen, setChosen] = useState<string | null>(null)
  const [finished, setFinished] = useState(false)
  const [revealActive, setRevealActive] = useState(false)
  const [confettiActive, setConfettiActive] = useState(false)

  // ── Audio via shared useSound hook ─────────────────────────────────────────
  const { play } = useSound()

  function playCorrect() { play('correct', 0.7) }
  function playWrong()   { play('wrong',   0.6) }

  function playGoodScore() {
    play('applause', 0.8)
    setTimeout(() => play('firecrackers', 0.9), 700)
  }

  function playBadScore() { play('fail', 0.7) }

  function startNew() {
    const s = buildSession()
    setSession(s)
    setStep(0)
    setResults(Array(s.wordConfig.word.replace(/[^A-Z]/g, '').length).fill('pending'))
    setChosen(null)
    setFinished(false)
    setRevealActive(false)
    setConfettiActive(false)
  }

  const { wordConfig, questions, wordOrder } = session
  const cleanWord = wordConfig.word.replace(/[^A-Z]/g, '')
  const totalSteps = questions.length
  const q = questions[step]
  const wordPosForStep = wordOrder[step]
  const answeredCount = results.filter(r => r !== 'pending').length
  const isWrong = chosen !== null && chosen !== q.letter

  // Unique letters to preload
  const allImgUrls = [...new Set(questions.map(q => q.img))]

  function handleChoice(choice: string) {
    if (chosen) return
    setChosen(choice)
    const correct = choice === q.letter
    const newResults = [...results]
    newResults[wordPosForStep] = correct ? 'correct' : 'incorrect'
    setResults(newResults)
    if (correct) playCorrect()
    else playWrong()
  }

  function handleNext() {
    if (step + 1 >= totalSteps) {
      // finalScore includes current answer already in results
      const finalScore = results.filter(r => r === 'correct').length
      const goodScore = finalScore / totalSteps >= 0.6
      setFinished(true)
      setTimeout(() => {
        setRevealActive(true)
        if (goodScore) {
          setConfettiActive(true)
          playGoodScore()
        } else {
          playBadScore()
        }
      }, 400)
    } else {
      setStep(s => s + 1)
      setChosen(null)
    }
  }

  const score = results.filter(r => r === 'correct').length

  return (
    <section className="w-full bg-[var(--secondary)] overflow-hidden relative">
      {/* Preload all letter images for this session so switching is instant */}
      <div className="hidden">
        {allImgUrls.map(url => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={url} src={url} alt="" />
        ))}
      </div>
      {/* Dot pattern matching CTA section */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, var(--primary) 1px, transparent 1px),
                            radial-gradient(circle at 80% 20%, var(--primary) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10">
        <div className="capsule py-16 md:py-24 border-l border-r border-[var(--primary)]/20">

          {/* ── Section header ── */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--primary)] mb-4">
              <span className="text-xs font-bold text-white font-body uppercase tracking-wider">
                Interactive ASL Quiz
              </span>
            </div>
            <Heading variant="h2" className="text-[var(--primary)] mb-3">
              Can You Spell It in ASL?
            </Heading>
            <BodyText variant="medium" className="text-[var(--primary)]/70 max-w-xl mx-auto">
              Signs appear in a <span className="font-semibold text-[var(--primary)]">random jumbled order</span> — identify each letter and reveal the hidden word connected to Mcneese State University!
            </BodyText>
          </div>

          {/* ── Quiz card — same bg as section, bordered ── */}
          <div className="w-full rounded-sm border border-[var(--primary)]/25 bg-[var(--secondary)] p-4 md:p-6 relative overflow-hidden">
            <ConfettiCanvas active={confettiActive} />

            {!finished ? (
              <>
                {/* ── Two-panel grid ── */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

                  {/* ── LEFT PANEL ── */}
                  <div className="bg-white/90 border border-[var(--primary)]/20 rounded-sm p-5 md:p-6 flex flex-col justify-between gap-4">

                    {/* Top: slogan pill + heading + body */}
                    <div className="flex flex-col gap-3">
                      <div className="self-start">
                        <div className="inline-flex items-center bg-[var(--primary)] rounded-sm px-4 py-1.5">
                          <span className="text-xs font-bold text-white font-body uppercase tracking-wide">ASL Finger Spelling</span>
                        </div>
                      </div>
                      <Heading variant="h3" className="text-[var(--primary)] leading-snug">
                        {wordConfig.slogan}
                      </Heading>
                      <BodyText variant="regular" className="text-[var(--primary)]/60">
                        Study the hand shape on the right. Pick the correct ASL letter from the four options. Letters appear in jumbled order — can you figure out the hidden word?
                      </BodyText>
                    </div>

                    {/* ── Letter tiles — live inside left panel ── */}
                    <div className="flex flex-col gap-2">
                      <BodyText variant="small" className="text-[var(--primary)]/50 text-xs uppercase tracking-widest font-semibold">
                        Letters collected — jumbled order
                      </BodyText>
                      <div className="flex gap-2 flex-wrap">
                        {wordOrder.map((wordIdx, qi) => {
                          const r = results[wordIdx]
                          const isCurrentStep = qi === step
                          const isAnsweredNow = isCurrentStep && !!chosen
                          const showLetter = isAnsweredNow || (r !== 'pending' && !isCurrentStep)

                          let cls = 'w-10 h-10 rounded-sm flex items-center justify-center text-sm font-bold font-display border-2 transition-all duration-300'

                          if (isAnsweredNow) {
                            cls += r === 'correct'
                              ? ' bg-[var(--success)] border-[var(--success)] text-white'
                              : ' bg-[var(--destructive)] border-[var(--destructive)] text-white'
                          } else if (isCurrentStep) {
                            cls += ' bg-[var(--secondary)] border-[var(--primary)] text-transparent scale-110'
                          } else if (r === 'correct') {
                            cls += ' bg-[var(--success)] border-[var(--success)] text-white'
                          } else if (r === 'incorrect') {
                            cls += ' bg-[var(--destructive)] border-[var(--destructive)] text-white'
                          } else {
                            cls += ' bg-[var(--secondary)]/40 border-[var(--primary)]/20 text-transparent'
                          }

                          return (
                            <div key={qi} className={cls}>
                              {showLetter ? cleanWord[wordIdx] : ''}
                            </div>
                          )
                        })}
                      </div>
                      <BodyText variant="small" className="text-[var(--primary)]/40 italic text-xs">
                        Rearrange mentally to guess the hidden word!
                      </BodyText>
                    </div>

                    {/* Bottom: progress pinned to bottom of panel */}
                    <div className="pt-4 border-t border-[var(--primary)]/15">
                      <div className="flex justify-between mb-2">
                        <BodyText variant="small" className="text-[var(--primary)]/70 font-semibold">
                          Sign {step + 1} of {totalSteps}
                        </BodyText>
                        <BodyText variant="small" className="text-[var(--primary)]/50">
                          {answeredCount} collected
                        </BodyText>
                      </div>
                      <div className="h-1.5 bg-[var(--primary)]/15 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[var(--primary)] rounded-full transition-all duration-500"
                          style={{ width: `${((step + (chosen ? 1 : 0)) / totalSteps) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* ── RIGHT PANEL ── */}
                  <div className="bg-white/90 border border-[var(--primary)]/20 rounded-sm p-4 flex flex-col gap-3">

                    {/* Question given by system — top bar */}
                    <div className="bg-[var(--primary)] rounded-sm px-4 py-2.5 text-center">
                      <BodyText variant="small" className="text-white font-semibold">
                        {q.prompt}
                      </BodyText>
                    </div>

                    {/* ASL hand image — large area */}
                    <div className="flex-1 bg-white border border-[var(--primary)]/10 rounded-sm flex items-center justify-center py-6 min-h-[160px]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={q.img}
                        alt="ASL hand sign"
                        className="w-36 h-36 object-contain"
                      />
                    </div>

                    {/* 4 choice buttons */}
                    <div className="grid grid-cols-2 gap-2.5">
                      {q.choices.map((c) => {
                        const isCorrect = c === q.letter
                        const isChosen = chosen === c
                        let cls = 'rounded-sm border-2 py-3.5 text-xl font-bold font-display text-center cursor-pointer transition-all duration-200 select-none'
                        if (!chosen) {
                          cls += ' bg-white border-[var(--primary)]/25 text-[var(--primary)] hover:border-[var(--primary)] hover:bg-white hover:scale-[1.02]'
                        } else if (isCorrect) {
                          cls += ' bg-[var(--success)] border-[var(--success)] text-white'
                        } else if (isChosen) {
                          cls += ' bg-[var(--destructive)] border-[var(--destructive)] text-white'
                        } else {
                          cls += ' bg-white/40 border-[var(--primary)]/10 text-[var(--primary)]/20 cursor-default'
                        }
                        return (
                          <button key={c} className={cls} onClick={() => handleChoice(c)} disabled={!!chosen}>
                            {c}
                          </button>
                        )
                      })}
                    </div>

                    {/* Wrong + Correct indicators — bottom two slots */}
                    {/* Wrong: only appears when user picks wrong. Correct: only appears after any answer */}
                    <div className="grid grid-cols-2 gap-2.5">
                      {/* Wrong indicator — invisible until wrong answer */}
                      <div
                        className={`rounded-sm px-3 py-2.5 text-center text-xs font-semibold border-2 transition-all duration-300 ${
                          isWrong
                            ? 'bg-[var(--destructive)] border-[var(--destructive)] text-white opacity-100'
                            : 'opacity-0 pointer-events-none border-transparent'
                        }`}
                      >
                        ✕ Wrong answer
                      </div>

                      {/* Correct indicator — appears after any answer */}
                      <div
                        className={`rounded-sm px-3 py-2.5 text-center text-xs font-semibold border-2 transition-all duration-300 ${
                          chosen
                            ? 'bg-[var(--success)] border-[var(--success)] text-white opacity-100'
                            : 'opacity-0 pointer-events-none border-transparent'
                        }`}
                      >
                        ✓ It&apos;s &ldquo;{q.letter}&rdquo;
                      </div>
                    </div>
                  </div>
                </div>

                {/* Next / Reveal button — full width */}
                {chosen && (
                  <button
                    onClick={handleNext}
                    className="w-full rounded-sm bg-[var(--primary)] text-white py-4 font-semibold font-body flex items-center justify-center gap-2 hover:bg-[var(--primary)]/90 transition-all mb-4"
                  >
                    {step + 1 < totalSteps
                      ? <><span>Next Sign</span><HugeiconsIcon icon={ArrowRight01Icon} className="w-4 h-4" /></>
                      : <><span>Reveal the Word!</span><HugeiconsIcon icon={ArrowRight01Icon} className="w-4 h-4" /></>
                    }
                  </button>
                )}

              </>
            ) : (
              /* ── Finished screen ── */
              <div className="flex flex-col items-center gap-6 text-center py-8 md:py-12 relative">
                <div className="text-6xl">🎉</div>
                <div>
                  <Heading variant="h3" className="text-[var(--primary)] mb-2">All signs identified!</Heading>
                  <BodyText variant="medium" className="text-[var(--primary)]/60 max-w-md mx-auto">
                    Watch the letters snap into their correct order to reveal the hidden word…
                  </BodyText>
                </div>

                <div className="flex items-center gap-4 bg-[var(--primary)] rounded-sm px-10 py-5">
                  <span className="text-4xl font-bold text-white font-display">{score}/{totalSteps}</span>
                  <BodyText variant="regular" className="text-white/70 text-left">letters<br />correct</BodyText>
                </div>

                <div>
                  <BodyText variant="small" className="text-[var(--primary)]/60 uppercase tracking-wider font-semibold text-xs mb-4">
                    The hidden word
                  </BodyText>
                  <div className="flex gap-2 justify-center flex-wrap">
                    {cleanWord.split('').map((letter, i) => (
                      <RevealTile
                        key={i}
                        letter={letter}
                        status={results[i]}
                        delay={200 + i * 130}
                        active={revealActive}
                      />
                    ))}
                  </div>
                </div>

                <BodyText variant="small" className="text-[var(--primary)]/50">{wordConfig.hint}</BodyText>

                <div className="flex flex-col sm:flex-row gap-3 mt-2">
                  <button
                    onClick={startNew}
                    className="flex items-center justify-center gap-2 rounded-sm border-2 border-[var(--primary)] bg-transparent text-[var(--primary)] px-7 py-3.5 font-semibold font-body hover:bg-[var(--primary)]/10 transition-all"
                  >
                    <HugeiconsIcon icon={RefreshIcon} className="w-4 h-4" />
                    Play Again
                  </button>
                  <a
                    href="/lessons"
                    className="flex items-center justify-center gap-2 rounded-sm bg-[var(--primary)] text-white px-7 py-3.5 font-semibold font-body hover:bg-[var(--primary)]/90 transition-all"
                  >
                    Continue Learning
                    <HugeiconsIcon icon={ArrowRight01Icon} className="w-4 h-4" />
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom stats-style strip — mirrors CTA section structure */}
        <div className="capsule py-6 border-r border-l border-t border-[var(--primary)]/20 flex items-center justify-center">
          <BodyText variant="small" className="text-[var(--primary)]/40 text-xs font-semibold uppercase tracking-widest">
            ASL Fingerspelling · Mcneese State University Edition
          </BodyText>
        </div>
      </div>
    </section>
  )
}

export { ASLQuizSection }