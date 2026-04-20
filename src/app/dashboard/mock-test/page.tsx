'use client'

import Link from 'next/link'
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react'
import {
  TaskDaily02Icon,
  Clock01Icon,
  StarIcon,
  CheckmarkCircle02Icon,
  PlayCircleIcon,
  Award01Icon,
  Target02Icon,
} from '@hugeicons/core-free-icons'
import { mockTests } from '@/lib/game/data'
import { cn } from '@/lib/utils'

const difficultyStyles: Record<string, string> = {
  easy: 'bg-accent/10 text-accent border-accent/20',
  medium: 'bg-secondary/20 text-[#B38A00] border-secondary/40',
  hard: 'bg-red-100 text-destructive border-red-200',
}

export default function MockTestPage() {
  const totalAttempts = mockTests.reduce((acc, t) => acc + t.attempts, 0)
  const bestScores = mockTests.filter((t) => t.bestScore !== undefined)
  const avgScore =
    bestScores.length > 0
      ? Math.round(
          bestScores.reduce((acc, t) => acc + (t.bestScore ?? 0), 0) / bestScores.length,
        )
      : 0

  return (
    <div className="flex flex-col gap-6 max-w-[90rem] mx-auto w-full">
      {/* Banner */}
      <section className="relative overflow-hidden rounded-sm bg-gradient-to-br from-[#8B5CF6] via-[#7c3aed] to-[#5b21b6] text-white p-6 md:p-8">
        <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-sm px-3 py-1 mb-3">
              <HugeiconsIcon icon={TaskDaily02Icon} size={14} />
              <span className="text-xs font-semibold font-body">Mock Tests</span>
            </div>
            <h2 className="text-[1.75rem] md:text-[2.25rem] leading-tight font-bold font-display tracking-[-0.02em]">
              Prove your fluency
            </h2>
            <p className="text-white/80 font-body mt-2 max-w-xl">
              Timed assessments that mirror real evaluations. Every test earns XP
              and progress toward the Mock Champion badge. Uses AI camera recognition
              to verify your signing.
            </p>
          </div>
        </div>
      </section>

      {/* Stats row */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MiniStat
          icon={TaskDaily02Icon}
          color="#8B5CF6"
          bg="bg-purple-50"
          label="Tests available"
          value={`${mockTests.length}`}
        />
        <MiniStat
          icon={CheckmarkCircle02Icon}
          color="#00A86B"
          bg="bg-green-50"
          label="Total attempts"
          value={`${totalAttempts}`}
        />
        <MiniStat
          icon={Target02Icon}
          color="#0064B2"
          bg="bg-blue-50"
          label="Average score"
          value={avgScore > 0 ? `${avgScore}%` : '\u2014'}
        />
        <MiniStat
          icon={Award01Icon}
          color="#F59E0B"
          bg="bg-orange-50"
          label="Tests passed"
          value={`${bestScores.filter((t) => (t.bestScore ?? 0) >= 70).length}`}
        />
      </section>

      {/* Tests grid */}
      <section className="grid md:grid-cols-2 gap-4">
        {mockTests.map((test) => (
          <div
            key={test.id}
            className="rounded-sm bg-white border border-slate-100 p-6 hover:border-primary/30 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-sm bg-purple-100 flex items-center justify-center">
                  <HugeiconsIcon
                    icon={TaskDaily02Icon}
                    size={22}
                    className="text-purple-600"
                  />
                </div>
                <div>
                  <span
                    className={cn(
                      'inline-block text-[10px] uppercase tracking-wider font-semibold font-body px-2 py-0.5 rounded-sm border',
                      difficultyStyles[test.difficulty],
                    )}
                  >
                    {test.difficulty}
                  </span>
                </div>
              </div>
              {test.bestScore !== undefined && (
                <div className="text-right">
                  <div className="text-[10px] uppercase tracking-wider font-semibold font-body text-muted">
                    Best score
                  </div>
                  <div className="text-[1.25rem] font-bold font-display text-accent leading-none mt-0.5">
                    {test.bestScore}%
                  </div>
                </div>
              )}
            </div>

            <h3 className="text-[1.125rem] font-bold font-display text-foreground">
              {test.title}
            </h3>
            <p className="text-sm text-muted font-body mt-1 line-clamp-2">
              {test.description}
            </p>

            <div className="grid grid-cols-3 gap-2 mt-5">
              <TestMeta
                icon={TaskDaily02Icon}
                label="Questions"
                value={`${test.questions}`}
              />
              <TestMeta
                icon={Clock01Icon}
                label="Duration"
                value={`${test.duration}m`}
              />
              <TestMeta
                icon={StarIcon}
                label="Attempts"
                value={`${test.attempts}`}
              />
            </div>

            <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-100">
              <div className="text-xs text-muted font-body">
                {test.attempts > 0 ? 'Retake to improve your score' : 'First attempt'}
              </div>
              <Link
                href={`/dashboard/mock-test/${test.id}`}
                className="inline-flex items-center gap-2 h-10 px-5 rounded-sm bg-primary text-white hover:bg-[#0056a0] active:scale-[0.98] font-semibold text-sm font-body transition-all"
              >
                <HugeiconsIcon icon={PlayCircleIcon} size={16} />
                {test.attempts > 0 ? 'Retake' : 'Start test'}
              </Link>
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}

function MiniStat({
  icon,
  color,
  bg,
  label,
  value,
}: {
  icon: IconSvgElement
  color: string
  bg: string
  label: string
  value: string
}) {
  return (
    <div className="rounded-sm bg-white border border-slate-100 p-5">
      <div className={cn('w-10 h-10 rounded-sm flex items-center justify-center mb-3', bg)}>
        <HugeiconsIcon icon={icon} size={18} style={{ color }} />
      </div>
      <div className="text-[11px] uppercase tracking-wider text-muted font-semibold font-body">
        {label}
      </div>
      <div className="text-[1.5rem] font-bold font-display text-foreground leading-none mt-1">
        {value}
      </div>
    </div>
  )
}

function TestMeta({
  icon,
  label,
  value,
}: {
  icon: IconSvgElement
  label: string
  value: string
}) {
  return (
    <div className="flex flex-col items-center gap-1 p-2 rounded-sm bg-slate-50">
      <HugeiconsIcon icon={icon} size={14} className="text-muted" />
      <div className="text-[10px] uppercase tracking-wider font-semibold font-body text-muted">
        {label}
      </div>
      <div className="text-[13px] font-bold font-display text-foreground">{value}</div>
    </div>
  )
}
