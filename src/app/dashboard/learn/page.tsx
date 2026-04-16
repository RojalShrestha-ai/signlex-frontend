'use client'

import Link from 'next/link'
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react'
import {
  BookOpen01Icon,
  CheckmarkCircle02Icon,
  LockIcon,
  PlayCircleIcon,
  StarIcon,
  Rocket01Icon,
  FireIcon,
} from '@hugeicons/core-free-icons'
import { useDashboardStats, useLessonProgress } from '@/lib/hooks'
import { cn } from '@/lib/utils'

const difficultyStyles: Record<string, string> = {
  beginner: 'bg-accent/10 text-accent border-accent/20',
  intermediate: 'bg-secondary/20 text-[#B38A00] border-secondary/40',
  advanced: 'bg-purple-100 text-purple-600 border-purple-200',
}

export default function LearnPage() {
  const { data: stats } = useDashboardStats()
  const { data: progressData, isLoading } = useLessonProgress()

  const lessons = (progressData?.lessons ?? []) as Array<{
    lessonId: string
    title: string
    description: string
    xp: number
    total: number
    difficulty: string
    status: 'locked' | 'available' | 'in-progress' | 'completed'
    progress: number
  }>

  const completed = lessons.filter((l) => l.status === 'completed').length
  const total = lessons.length
  const overallPct = total > 0 ? Math.round((completed / total) * 100) : 0

  return (
    <div className="flex flex-col gap-6 max-w-[90rem] mx-auto w-full">
      <section className="relative overflow-hidden rounded-sm bg-gradient-to-br from-accent via-accent to-[#007a4f] text-white p-6 md:p-8">
        <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-sm px-3 py-1 mb-3">
              <HugeiconsIcon icon={BookOpen01Icon} size={14} />
              <span className="text-xs font-semibold font-body">Learning Path</span>
            </div>
            <h2 className="text-[1.75rem] md:text-[2.25rem] leading-tight font-bold font-display tracking-[-0.02em]">
              Master the ASL alphabet
            </h2>
            <p className="text-white/80 font-body mt-2 max-w-xl">
              Progress through structured lessons, unlock new levels and earn XP as
              you build real fluency.
            </p>
          </div>
          <div className="flex flex-col items-start md:items-end gap-2 min-w-[14rem]">
            <div className="flex items-center gap-4">
              <Metric icon={FireIcon} value={`${stats?.streak ?? 0}d`} label="streak" />
              <Metric icon={StarIcon} value={`${(stats?.totalXp ?? 0).toLocaleString()}`} label="xp" />
              <Metric icon={Rocket01Icon} value={`Lvl ${stats?.level ?? 1}`} label="level" />
            </div>
            <div className="w-full mt-2">
              <div className="flex items-center justify-between text-[11px] font-body mb-1 opacity-90">
                <span>Path progress</span>
                <span className="font-bold">
                  {completed}/{total}
                </span>
              </div>
              <div className="h-2 rounded-full bg-white/20 overflow-hidden">
                <div
                  className="h-full bg-secondary"
                  style={{ width: `${overallPct}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-sm bg-white border border-slate-100 p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-[1.25rem] font-bold font-display text-foreground">
              Lessons
            </h3>
            <p className="text-sm text-muted font-body mt-0.5">
              Complete lessons in order to unlock the next challenge
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="text-sm text-muted font-body text-center py-10">Loading lessons...</div>
        ) : lessons.length === 0 ? (
          <div className="text-sm text-muted font-body text-center py-10">No lessons available yet. Run the seeder to populate lessons.</div>
        ) : (
          <ul className="flex flex-col gap-3">
            {lessons.map((lesson, i) => {
              const pct =
                lesson.total > 0 ? Math.round((lesson.progress / lesson.total) * 100) : 0
              const locked = lesson.status === 'locked'
              const isCompleted = lesson.status === 'completed'
              const inProgress = lesson.status === 'in-progress'

              const content = (
                <>
                  <div
                    className={cn(
                      'w-14 h-14 rounded-sm flex items-center justify-center flex-shrink-0 border-2',
                      locked && 'bg-slate-100 border-slate-200 text-muted',
                      isCompleted && 'bg-accent border-accent text-white',
                      inProgress && 'bg-primary border-primary text-white',
                      !locked && !isCompleted && !inProgress && 'bg-white border-slate-200 text-muted',
                    )}
                  >
                    {locked ? (
                      <HugeiconsIcon icon={LockIcon} size={20} />
                    ) : isCompleted ? (
                      <HugeiconsIcon icon={CheckmarkCircle02Icon} size={22} />
                    ) : (
                      <span className="text-lg font-bold font-display">{i + 1}</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span
                        className={cn(
                          'text-[10px] uppercase tracking-wider font-semibold font-body px-2 py-0.5 rounded-sm border',
                          difficultyStyles[lesson.difficulty] ?? '',
                        )}
                      >
                        {lesson.difficulty}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold font-body text-muted">
                        <HugeiconsIcon icon={StarIcon} size={11} />
                        {lesson.xp} XP
                      </span>
                    </div>
                    <h4 className="text-[1rem] font-bold font-display text-foreground">
                      {lesson.title}
                    </h4>
                    <p className="text-[13px] text-muted font-body mt-1">
                      {lesson.description}
                    </p>

                    {!locked && (
                      <div className="flex items-center gap-3 mt-3">
                        <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden max-w-sm">
                          <div
                            className={cn(
                              'h-full rounded-full transition-all',
                              isCompleted ? 'bg-accent' : 'bg-primary',
                            )}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-[11px] text-muted font-body font-semibold">
                          {lesson.progress}/{lesson.total}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex-shrink-0">
                    {locked ? (
                      <span className="text-[11px] font-semibold font-body text-muted">
                        Locked
                      </span>
                    ) : isCompleted ? (
                      <span className="inline-flex items-center gap-2 h-10 px-4 rounded-sm border border-accent/30 text-accent font-semibold text-sm font-body">
                        Review
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2 h-10 px-4 rounded-sm bg-primary text-white font-semibold text-sm font-body">
                        <HugeiconsIcon icon={PlayCircleIcon} size={16} />
                        {inProgress ? 'Continue' : 'Start'}
                      </span>
                    )}
                  </div>
                </>
              )

              if (locked) {
                return (
                  <li
                    key={lesson.lessonId}
                    className="relative flex flex-col md:flex-row md:items-center gap-4 p-5 rounded-sm border border-slate-100 bg-slate-50 opacity-70"
                  >
                    {content}
                  </li>
                )
              }

              return (
                <li key={lesson.lessonId}>
                  <Link
                    href={`/dashboard/learn/${lesson.lessonId}`}
                    className={cn(
                      'relative flex flex-col md:flex-row md:items-center gap-4 p-5 rounded-sm border transition-all',
                      isCompleted
                        ? 'border-accent/30 bg-accent/5 hover:border-accent/50'
                        : inProgress
                          ? 'border-primary/30 bg-primary/5 shadow-[0_4px_20px_rgba(0,100,178,0.08)] hover:border-primary/50'
                          : 'border-slate-100 bg-white hover:border-primary/30 hover:shadow-[0_4px_20px_rgba(0,0,0,0.04)]',
                    )}
                  >
                    {content}
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </div>
  )
}

function Metric({
  icon,
  value,
  label,
}: {
  icon: IconSvgElement
  value: string
  label: string
}) {
  return (
    <div className="flex flex-col items-center min-w-[3.5rem]">
      <div className="flex items-center gap-1">
        <HugeiconsIcon icon={icon} size={14} className="text-secondary" />
        <span className="text-sm font-bold font-display">{value}</span>
      </div>
      <span className="text-[10px] uppercase tracking-wider font-body opacity-80">
        {label}
      </span>
    </div>
  )
}
