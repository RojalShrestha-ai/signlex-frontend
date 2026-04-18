'use client'

import Link from 'next/link'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Target02Icon,
  StarIcon,
  Clock01Icon,
  FireIcon,
  PlayCircleIcon,
  FlashIcon,
  GiftIcon,
} from '@hugeicons/core-free-icons'
import { practiceModes } from '@/lib/game/data'
import { useDashboardStats } from '@/lib/hooks'
import { cn } from '@/lib/utils'

export default function PracticePage() {
  const { data: stats } = useDashboardStats()
  const dailyPct = Math.min(
    100,
    Math.round(((stats?.dailyGoalProgress ?? 0) / (stats?.dailyGoalXp ?? 50)) * 100),
  )

  return (
    <div className="flex flex-col gap-6 max-w-[90rem] mx-auto w-full">
      <section className="relative overflow-hidden rounded-sm bg-gradient-to-br from-[#EF4444] via-[#dc2626] to-[#991b1b] text-white p-6 md:p-8">
        <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute right-20 bottom-0 w-32 h-32 rounded-full bg-secondary/20 blur-3xl" />
        <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-sm px-3 py-1 mb-3">
              <HugeiconsIcon icon={FlashIcon} size={14} className="text-secondary" />
              <span className="text-xs font-semibold font-body">
                Practice Arena
              </span>
            </div>
            <h2 className="text-[1.75rem] md:text-[2.25rem] leading-tight font-bold font-display tracking-[-0.02em]">
              Pick your challenge
            </h2>
            <p className="text-white/80 font-body mt-2 max-w-xl">
              Short drills, daily challenges and boss battles to sharpen your
              skills and earn bonus XP.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-sm p-4 min-w-[16rem]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] uppercase tracking-wider font-semibold font-body opacity-90">
                Daily goal
              </span>
              <span className="text-[11px] font-bold font-display">
                {stats?.dailyGoalProgress ?? 0}/{stats?.dailyGoalXp ?? 50} XP
              </span>
            </div>
            <div className="h-2 rounded-full bg-white/20 overflow-hidden">
              <div
                className="h-full rounded-full bg-secondary"
                style={{ width: `${dailyPct}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {practiceModes.map((mode) => {
          const isAI = mode.id === 'ai-recognition'
          return (
            <Link
              key={mode.id}
              href={`/dashboard/practice/${mode.id}`}
              className={cn(
                'group relative overflow-hidden rounded-sm bg-white border border-slate-100 p-6 hover:border-primary/30 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all',
                isAI && 'ring-2 ring-accent/30 border-accent/20',
              )}
            >
              <div
                className="absolute top-0 left-0 w-full h-1"
                style={{ backgroundColor: mode.color }}
              />
              {isAI && (
                <div className="absolute top-3 right-3 text-[9px] uppercase tracking-wider font-bold font-body bg-accent text-white px-2 py-0.5 rounded-sm">
                  AI Powered
                </div>
              )}
              <div
                className="w-12 h-12 rounded-sm flex items-center justify-center mb-4"
                style={{
                  backgroundColor: `${mode.color}18`,
                }}
              >
                <HugeiconsIcon
                  icon={Target02Icon}
                  size={22}
                  style={{ color: mode.color }}
                />
              </div>
              <h3 className="text-[1.125rem] font-bold font-display text-foreground">
                {mode.title}
              </h3>
              <p className="text-sm text-muted font-body mt-1 line-clamp-2">
                {mode.description}
              </p>
              <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1 text-[11px] text-muted font-body font-semibold">
                    <HugeiconsIcon icon={Clock01Icon} size={12} />
                    {mode.duration}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] text-accent font-body font-semibold">
                    <HugeiconsIcon icon={StarIcon} size={12} />+{mode.xp} XP
                  </span>
                </div>
                <span
                  className="inline-flex items-center justify-center w-9 h-9 rounded-sm bg-foreground/5 group-hover:bg-primary group-hover:text-white text-foreground transition-all"
                  aria-label={`Start ${mode.title}`}
                >
                  <HugeiconsIcon icon={PlayCircleIcon} size={16} />
                </span>
              </div>
            </Link>
          )
        })}
      </section>

      {/* <section className="grid lg:grid-cols-2 gap-4">
        <div className="rounded-sm bg-gradient-to-br from-secondary/20 to-secondary/5 border border-secondary/30 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-11 h-11 rounded-sm bg-secondary/30 flex items-center justify-center">
              <HugeiconsIcon icon={GiftIcon} size={20} className="text-[#B38A00]" />
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider font-semibold font-body text-[#B38A00]">
                Daily reward
              </div>
              <h3 className="text-[1.125rem] font-bold font-display text-foreground">
                +50 gems waiting
              </h3>
            </div>
          </div>
          <p className="text-sm text-muted font-body mb-4">
            Finish any practice mode today to unlock your daily gem chest.
          </p>
          <button
            type="button"
            className="inline-flex items-center gap-2 h-10 px-5 rounded-sm bg-foreground text-white font-semibold text-sm font-body hover:bg-foreground/90 transition-all cursor-pointer"
          >
            Claim when ready
          </button>
        </div>

        <Link
          href="/dashboard/practice/streak-saver"
          className="rounded-sm bg-gradient-to-br from-orange-100 to-orange-50 border border-orange-200 p-6 hover:border-orange-300 transition-all"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-11 h-11 rounded-sm bg-orange-200 flex items-center justify-center">
              <HugeiconsIcon icon={FireIcon} size={20} className="text-[#F59E0B]" />
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider font-semibold font-body text-[#F59E0B]">
                Streak protect
              </div>
              <h3 className="text-[1.125rem] font-bold font-display text-foreground">
                {stats?.streak ?? 0} day streak alive
              </h3>
            </div>
          </div>
          <p className="text-sm text-muted font-body mb-4">
            Complete Streak Saver now to lock in today&apos;s streak and keep the fire burning.
          </p>
          <span
            className={cn(
              'inline-flex items-center gap-2 h-10 px-5 rounded-sm',
              'bg-[#F59E0B] text-white font-semibold text-sm font-body',
            )}
          >
            <HugeiconsIcon icon={FireIcon} size={14} />
            Start Streak Saver
          </span>
        </Link>
      </section> */}
    </div>
  )
}
