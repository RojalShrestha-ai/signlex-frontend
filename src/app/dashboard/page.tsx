'use client'

import Link from 'next/link'
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react'
import {
  FireIcon,
  StarIcon,
  RankingIcon,
  Diamond01Icon,
  Target02Icon,
  BookOpen01Icon,
  TaskDaily02Icon,
  Award01Icon,
  Rocket01Icon,
  CheckmarkCircle02Icon,
  PlayCircleIcon,
  Crown02Icon,
  ArrowRight01Icon,
  StepOverFreeIcons,
} from '@hugeicons/core-free-icons'
import { useAuth } from '@/lib/providers'
import { useDashboardStats, useLeaderboard, useRecentActivity, useAvailableBadges, useLessonProgress } from '@/lib/hooks'
import { cn } from '@/lib/utils'

function getFirstName(user: { firstName?: string; displayName?: string; email?: string } | null) {
  if (!user) return 'Signer'
  if (user.firstName) return user.firstName
  if (user.displayName) return user.displayName.split(' ')[0]
  if (user.email) return user.email.split('@')[0]
  return 'Signer'
}

const activityIcons: Record<string, IconSvgElement> = {
  lesson: BookOpen01Icon,
  practice: Target02Icon,
  test: TaskDaily02Icon,
  badge: Award01Icon,
  streak: FireIcon,
}

const activityColors: Record<string, string> = {
  lesson: 'bg-primary/10 text-primary',
  practice: 'bg-accent/10 text-accent',
  test: 'bg-secondary/20 text-[#B38A00]',
  badge: 'bg-purple-100 text-purple-600',
  streak: 'bg-orange-100 text-[#F59E0B]',
}

function timeAgo(dateStr: string): string {
  const now = Date.now()
  const then = new Date(dateStr).getTime()
  const diff = now - then
  const minutes = Math.floor(diff / 60000)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export default function DashboardHome() {
  const { user } = useAuth()
  const { data: stats } = useDashboardStats()
  const { data: lbData } = useLeaderboard('global', 10)
  const { data: activityData } = useRecentActivity()
  const { data: badgesData } = useAvailableBadges()
  const { data: lessonData } = useLessonProgress()
  const firstName = getFirstName(user)

  const level = stats?.level ?? 1
  const xp = stats?.xp ?? 0
  const xpToNextLevel = stats?.xpToNextLevel ?? 100
  const totalXp = stats?.totalXp ?? 0
  const streak = stats?.streak ?? 0
  const longestStreak = stats?.longestStreak ?? 0
  const gems = stats?.gems ?? 0
  const rank = stats?.rank ?? 0
  const dailyGoalXp = stats?.dailyGoalXp ?? 50
  const dailyGoalProgress = stats?.dailyGoalProgress ?? 0

  const xpPct = xpToNextLevel > 0 ? Math.min(100, Math.round((xp / xpToNextLevel) * 100)) : 0
  const dailyPct = dailyGoalXp > 0 ? Math.min(100, Math.round((dailyGoalProgress / dailyGoalXp) * 100)) : 0

  const allLessons = (lessonData?.lessons ?? []) as Array<any>
  const continueLesson = allLessons.find((l: any) => l.status === 'in-progress')
    || allLessons.find((l: any) => l.status === 'available')
    || allLessons[0]
    || { lessonId: '', title: 'Start learning', description: 'Complete lessons to track your progress', difficulty: 'beginner', xp: 50, progress: 0, total: 5 }

  const rankings = lbData?.rankings ?? []
  const topThree = rankings.slice(0, 3).map((e: any, i: number) => ({
    rank: e.rank ?? i + 1,
    name: e.displayName ?? 'Unknown',
    xp: e.totalXP ?? e.weeklyXP ?? 0,
    level: Math.floor((e.totalXP ?? 0) / 500) + 1,
    avatar: (e.displayName ?? 'U').slice(0, 2).toUpperCase(),
  }))

  const activities = (activityData?.activities ?? []).slice(0, 5)

  const badges = (badgesData?.badges ?? []).filter((b: any) => b.unlocked).slice(0, 4)

  return (
    <div className="flex flex-col gap-6 max-w-[90rem] mx-auto w-full">
      <section className="relative overflow-hidden rounded-sm bg-gradient-to-br from-primary via-primary to-[#004a84] text-white p-6 md:p-8">
        <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute right-20 bottom-0 w-32 h-32 rounded-full bg-secondary/20 blur-3xl" />
        <div className="relative flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-sm px-3 py-1 mb-3">
              <HugeiconsIcon icon={FireIcon} size={14} className="text-secondary" />
              <span className="text-xs font-semibold font-body">
                {streak} day streak — keep it alive!
              </span>
            </div>
            <h2 className="text-[1.75rem] md:text-[2.5rem] leading-tight font-bold font-display tracking-[-0.02em]">
              Welcome back, {firstName}!
            </h2>
            <p className="text-white/80 font-body mt-2 max-w-xl">
              You&apos;re <span className="font-bold text-secondary">{xpToNextLevel - xp} XP</span>{' '}
              away from Level {level + 1}. Let&apos;s crush today&apos;s goal.
            </p>
          </div>
          <Link
            href={`/dashboard/learn`}
            className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-sm bg-secondary text-foreground font-semibold font-display hover:brightness-95 active:scale-[0.98] transition-all whitespace-nowrap"
          >
            Continue learning
            <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={FireIcon}
          color="#F59E0B"
          bg="bg-orange-50"
          border="border-orange-100"
          label="Current Streak"
          value={`${streak} days`}
          sub={`Longest: ${longestStreak}`}
        />
        <StatCard
          icon={StarIcon}
          color="#0064B2"
          bg="bg-blue-50"
          border="border-blue-100"
          label="Total XP"
          value={totalXp.toLocaleString()}
          sub={`Level ${level}`}
        />
        <StatCard
          icon={StepOverFreeIcons}
          color="#00A86B"
          bg="bg-green-50"
          border="border-green-100"
          label="Level"
          value={level.toLocaleString()}
          sub="Climb The Levels"
        />
        <StatCard
          icon={RankingIcon}
          color="#8B5CF6"
          bg="bg-purple-50"
          border="border-purple-100"
          label="Global Rank"
          value={rank > 0 ? `#${rank}` : '—'}
          sub={rank > 0 ? 'Keep climbing' : 'Start learning!'}
        />
      </section>

      <section className="grid lg:grid-cols-2 gap-4">
        <div className="rounded-sm bg-white border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-muted font-semibold font-body">
                Daily Goal
              </div>
              <h3 className="text-[1.25rem] font-bold font-display text-foreground mt-0.5">
                {dailyGoalProgress} / {dailyGoalXp} XP
              </h3>
            </div>
            <div className="w-12 h-12 rounded-sm bg-secondary/20 flex items-center justify-center">
              <HugeiconsIcon icon={Target02Icon} size={22} className="text-[#B38A00]" />
            </div>
          </div>
          <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-secondary to-[#F59E0B] transition-all"
              style={{ width: `${dailyPct}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-muted font-body">
              {dailyPct}% complete
            </span>
            <Link
              href="/dashboard/practice"
              className="text-xs text-primary font-semibold font-body hover:underline"
            >
              Practice now →
            </Link>
          </div>
        </div>

        <div className="rounded-sm bg-white border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-muted font-semibold font-body">
                Level Progress
              </div>
              <h3 className="text-[1.25rem] font-bold font-display text-foreground mt-0.5">
                Level {level} → {level + 1}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-sm bg-primary/10 flex items-center justify-center">
              <HugeiconsIcon icon={Rocket01Icon} size={22} className="text-primary" />
            </div>
          </div>
          <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all"
              style={{ width: `${xpPct}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-muted font-body">
              {xp} / {xpToNextLevel} XP
            </span>
            <span className="text-xs text-primary font-semibold font-body">
              {xpToNextLevel - xp} XP to go
            </span>
          </div>
        </div>
      </section>

      <section className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-sm bg-white border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[1.125rem] font-bold font-display text-foreground">
              Continue learning
            </h3>
            <Link
              href="/dashboard/learn"
              className="text-xs text-primary font-semibold font-body hover:underline"
            >
              All lessons →
            </Link>
          </div>

          <div className="rounded-sm border border-slate-100 bg-gradient-to-br from-primary/5 to-accent/5 p-5">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-sm bg-white border border-slate-100 flex items-center justify-center flex-shrink-0">
                <HugeiconsIcon icon={BookOpen01Icon} size={24} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] uppercase tracking-wider font-semibold text-primary font-body">
                  {continueLesson.difficulty}
                </div>
                <h4 className="text-[1rem] font-bold font-display text-foreground mt-0.5 truncate">
                  {continueLesson.title}
                </h4>
                <p className="text-[13px] text-muted font-body mt-1 line-clamp-2">
                  {continueLesson.description}
                </p>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex-1">
                    <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-accent"
                        style={{
                          width: `${(continueLesson.progress / continueLesson.total) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                  <span className="text-xs text-muted font-body font-semibold">
                    {continueLesson.progress}/{continueLesson.total}
                  </span>
                </div>
              </div>
              <Link
                href="/dashboard/learn"
                className="flex-shrink-0 inline-flex items-center justify-center w-11 h-11 rounded-sm bg-primary text-white hover:bg-[#0056a0] active:scale-95 transition-all"
                aria-label="Continue lesson"
              >
                <HugeiconsIcon icon={PlayCircleIcon} size={20} />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-4">
            <Link
              href="/dashboard/practice"
              className="flex flex-col items-center gap-2 p-4 rounded-sm border border-slate-100 hover:border-primary/40 hover:bg-slate-50 transition-all"
            >
              <div className="w-10 h-10 rounded-sm bg-accent/10 flex items-center justify-center">
                <HugeiconsIcon icon={Target02Icon} size={18} className="text-accent" />
              </div>
              <span className="text-[13px] font-semibold font-body text-foreground">
                Practice
              </span>
            </Link>
            <Link
              href="/dashboard/mock-test"
              className="flex flex-col items-center gap-2 p-4 rounded-sm border border-slate-100 hover:border-primary/40 hover:bg-slate-50 transition-all"
            >
              <div className="w-10 h-10 rounded-sm bg-secondary/20 flex items-center justify-center">
                <HugeiconsIcon
                  icon={TaskDaily02Icon}
                  size={18}
                  className="text-[#B38A00]"
                />
              </div>
              <span className="text-[13px] font-semibold font-body text-foreground">
                Mock Test
              </span>
            </Link>
            <Link
              href="/dashboard/leaderboard"
              className="flex flex-col items-center gap-2 p-4 rounded-sm border border-slate-100 hover:border-primary/40 hover:bg-slate-50 transition-all"
            >
              <div className="w-10 h-10 rounded-sm bg-purple-100 flex items-center justify-center">
                <HugeiconsIcon
                  icon={RankingIcon}
                  size={18}
                  className="text-purple-600"
                />
              </div>
              <span className="text-[13px] font-semibold font-body text-foreground">
                Ranks
              </span>
            </Link>
          </div>
        </div>

        <div className="rounded-sm bg-white border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[1.125rem] font-bold font-display text-foreground">
              Top signers
            </h3>
            <Link
              href="/dashboard/leaderboard"
              className="text-xs text-primary font-semibold font-body hover:underline"
            >
              View all →
            </Link>
          </div>
          <ul className="flex flex-col gap-2">
            {topThree.map((entry: any) => (
              <li
                key={entry.rank}
                className="flex items-center gap-3 p-2.5 rounded-sm bg-slate-50"
              >
                <div
                  className={cn(
                    'w-7 h-7 rounded-sm flex items-center justify-center text-xs font-bold font-display',
                    entry.rank === 1 && 'bg-secondary text-foreground',
                    entry.rank === 2 && 'bg-slate-200 text-foreground',
                    entry.rank === 3 && 'bg-orange-200 text-orange-800',
                  )}
                >
                  {entry.rank === 1 ? (
                    <HugeiconsIcon icon={Crown02Icon} size={14} />
                  ) : (
                    entry.rank
                  )}
                </div>
                <div className="w-8 h-8 rounded-sm bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-[11px] font-bold font-display">
                  {entry.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold font-body text-foreground truncate">
                    {entry.name}
                  </div>
                  <div className="text-[11px] text-muted font-body">
                    Lvl {entry.level}
                  </div>
                </div>
                <div className="text-[12px] font-bold font-display text-primary">
                  {entry.xp.toLocaleString()}
                </div>
              </li>
            ))}
            {topThree.length === 0 && (
              <li className="text-sm text-muted font-body text-center py-4">
                No rankings yet
              </li>
            )}
          </ul>
        </div>
      </section>

      <section className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-sm bg-white border border-slate-100 p-6">
          <h3 className="text-[1.125rem] font-bold font-display text-foreground mb-4">
            Recent activity
          </h3>
          <ul className="flex flex-col gap-2">
            {activities.map((activity: any) => {
              const Icon = activityIcons[activity.type] ?? CheckmarkCircle02Icon
              const color = activityColors[activity.type] ?? 'bg-slate-100 text-muted'
              return (
                <li
                  key={activity.id}
                  className="flex items-center gap-3 p-3 rounded-sm hover:bg-slate-50 transition-colors"
                >
                  <div
                    className={cn(
                      'w-10 h-10 rounded-sm flex items-center justify-center',
                      color,
                    )}
                  >
                    <HugeiconsIcon icon={Icon} size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold font-body text-foreground">
                      {activity.title}
                    </div>
                    <div className="text-[11px] text-muted font-body mt-0.5">
                      {activity.at ? timeAgo(activity.at) : ''}
                    </div>
                  </div>
                  {activity.xp !== undefined && activity.xp > 0 && (
                    <div className="text-xs font-bold font-display text-accent">
                      +{activity.xp} XP
                    </div>
                  )}
                </li>
              )
            })}
            {activities.length === 0 && (
              <li className="text-sm text-muted font-body text-center py-6">
                No activity yet — start a lesson to get going!
              </li>
            )}
          </ul>
        </div>

        <div className="rounded-sm bg-white border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[1.125rem] font-bold font-display text-foreground">
              Badges earned
            </h3>
            <Link
              href="/dashboard/profile"
              className="text-xs text-primary font-semibold font-body hover:underline"
            >
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {badges.map((badge: any) => (
              <div
                key={badge.badgeId}
                className="flex flex-col items-center text-center gap-2 p-3 rounded-sm bg-slate-50 border border-slate-100"
              >
                <div
                  className="w-12 h-12 rounded-sm flex items-center justify-center"
                  style={{
                    backgroundColor: '#00A86B20',
                  }}
                >
                  <HugeiconsIcon
                    icon={Award01Icon}
                    size={22}
                    style={{ color: '#00A86B' }}
                  />
                </div>
                <div className="text-[11px] font-semibold font-body text-foreground line-clamp-1">
                  {badge.badgeName}
                </div>
              </div>
            ))}
            {badges.length === 0 && (
              <div className="col-span-2 text-sm text-muted font-body text-center py-4">
                No badges yet
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

function StatCard({
  icon,
  color,
  bg,
  border,
  label,
  value,
  sub,
}: {
  icon: IconSvgElement
  color: string
  bg: string
  border: string
  label: string
  value: string
  sub: string
}) {
  return (
    <div className={cn('rounded-sm bg-white border border-slate-100 p-5')}>
      <div
        className={cn(
          'w-10 h-10 rounded-sm flex items-center justify-center mb-3',
          bg,
          border,
          'border',
        )}
      >
        <HugeiconsIcon icon={icon} size={18} style={{ color }} />
      </div>
      <div className="text-[11px] uppercase tracking-wider text-muted font-semibold font-body">
        {label}
      </div>
      <div className="text-[1.5rem] font-bold font-display text-foreground leading-none mt-1">
        {value}
      </div>
      <div className="text-[11px] text-muted font-body mt-1">{sub}</div>
    </div>
  )
}
