'use client'

import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react'
import {
  FireIcon,
  StarIcon,
  Diamond01Icon,
  RankingIcon,
  Award01Icon,
  CheckmarkCircle02Icon,
  LockIcon,
  PencilEdit01Icon,
  BookOpen01Icon,
  TaskDaily02Icon,
  Target02Icon,
} from '@hugeicons/core-free-icons'
import { useAuth, type AuthUser } from '@/lib/providers'
import { useDashboardStats, useAvailableBadges, useRecentActivity } from '@/lib/hooks'
import { cn } from '@/lib/utils'

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

function getInitials(user: AuthUser | null): string {
  if (!user) return 'U'
  const display =
    user.displayName ||
    [user.firstName, user.lastName].filter(Boolean).join(' ').trim() ||
    user.email ||
    ''
  const parts = display.split(/\s+/).filter(Boolean)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return 'U'
}

function getDisplayName(user: AuthUser | null): string {
  if (!user) return 'Signer'
  return (
    user.displayName ||
    [user.firstName, user.lastName].filter(Boolean).join(' ').trim() ||
    (typeof user.email === 'string' ? user.email.split('@')[0] : 'Signer')
  )
}

const activityIcons: Record<string, IconSvgElement> = {
  lesson: BookOpen01Icon,
  practice: Target02Icon,
  test: TaskDaily02Icon,
  badge: Award01Icon,
  streak: FireIcon,
}

export default function ProfilePage() {
  const { user } = useAuth()
  const { data: stats } = useDashboardStats()
  const { data: badgesData } = useAvailableBadges()
  const { data: activityData } = useRecentActivity()

  const level = stats?.level ?? 1
  const xp = stats?.xp ?? 0
  const xpToNextLevel = stats?.xpToNextLevel ?? 100
  const totalXp = stats?.totalXp ?? 0
  const streak = stats?.streak ?? 0
  const longestStreak = stats?.longestStreak ?? 0
  const gems = stats?.gems ?? 0
  const rank = stats?.rank ?? 0

  const badges = (badgesData?.badges ?? []).map((b: any) => ({
    id: b.badgeId,
    name: b.badgeName,
    description: b.criteria ?? '',
    unlocked: b.unlocked,
    color: b.tier === 'gold' ? '#FFD51D' : b.tier === 'silver' ? '#8B5CF6' : '#00A86B',
  }))

  const recentActivity = (activityData?.activities ?? []).slice(0, 5).map((a: any) => ({
    id: a.id,
    type: a.type,
    title: a.title,
    xp: a.xp,
    at: a.at ? timeAgo(a.at) : '',
  }))

  const xpPct = Math.min(100, Math.round((xp / xpToNextLevel) * 100))
  const unlockedCount = badges.filter((b: any) => b.unlocked).length

  return (
    <div className="flex flex-col gap-6 max-w-[90rem] mx-auto w-full">
      <section className="relative overflow-hidden rounded-sm bg-white border border-slate-100">
        <div className="h-32 md:h-40 bg-gradient-to-br from-primary via-[#005299] to-accent relative">
          <div className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 30%, white 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />
        </div>

        <div className="px-6 md:px-8 pb-6 -mt-16 md:-mt-20 relative">
          <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-6">
            <div className="relative">
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-sm bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-3xl md:text-4xl font-bold font-display ring-4 ring-white shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
                {getInitials(user)}
              </div>
              <div className="absolute -bottom-2 -right-2 min-w-[2rem] h-8 px-2 rounded-sm bg-secondary text-foreground text-sm font-bold font-display flex items-center justify-center border-2 border-white">
                Lvl {level}
              </div>
            </div>

            <div className="flex-1 min-w-0 md:pb-3">
              <h2 className="text-[1.5rem] md:text-[1.75rem] font-bold font-display text-foreground tracking-[-0.01em]">
                {getDisplayName(user)}
              </h2>
              {user?.email && (
                <p className="text-sm text-muted font-body">{user.email}</p>
              )}
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <Chip icon={FireIcon} color="#F59E0B" bg="bg-orange-50" label={`${streak} day streak`} />
                <Chip icon={StarIcon} color="#0064B2" bg="bg-blue-50" label={`${totalXp.toLocaleString()} XP`} />
                <Chip icon={RankingIcon} color="#8B5CF6" bg="bg-purple-50" label={`Rank #${rank}`} />
                <Chip icon={Award01Icon} color="#00A86B" bg="bg-green-50" label={`${unlockedCount} badges`} />
              </div>
            </div>

            <div className="md:pb-3">
              <button
                type="button"
                className="inline-flex items-center gap-2 h-10 px-4 rounded-sm border border-slate-200 text-foreground hover:bg-slate-50 font-semibold text-sm font-body cursor-pointer"
              >
                <HugeiconsIcon icon={PencilEdit01Icon} size={16} />
                Edit profile
              </button>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] uppercase tracking-wider font-semibold font-body text-muted">
                Level {level} → {level + 1}
              </span>
              <span className="text-[11px] font-semibold font-body text-muted">
                {xp} / {xpToNextLevel} XP
              </span>
            </div>
            <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                style={{ width: `${xpPct}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatTile
          icon={FireIcon}
          color="#F59E0B"
          bg="bg-orange-50"
          label="Current streak"
          value={`${streak} days`}
        />
        <StatTile
          icon={FireIcon}
          color="#EF4444"
          bg="bg-red-50"
          label="Longest streak"
          value={`${longestStreak} days`}
        />
        <StatTile
          icon={Diamond01Icon}
          color="#0064B2"
          bg="bg-blue-50"
          label="Gems collected"
          value={gems.toLocaleString()}
        />
        <StatTile
          icon={Award01Icon}
          color="#00A86B"
          bg="bg-green-50"
          label="Badges earned"
          value={`${unlockedCount}/${badges.length}`}
        />
      </section>

      <section className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-sm bg-white border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-[1.125rem] font-bold font-display text-foreground">
                Achievement badges
              </h3>
              <p className="text-sm text-muted font-body mt-0.5">
                {unlockedCount} of {badges.length} unlocked
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {badges.map((badge: any) => {
              const pct =
                badge.progress !== undefined && badge.total
                  ? Math.round((badge.progress / badge.total) * 100)
                  : 0
              return (
                <div
                  key={badge.id}
                  className={cn(
                    'group relative flex flex-col items-center text-center gap-2 p-4 rounded-sm border transition-all',
                    badge.unlocked
                      ? 'bg-white border-slate-100 hover:border-primary/30 hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)]'
                      : 'bg-slate-50 border-slate-100 opacity-70',
                  )}
                >
                  <div
                    className={cn(
                      'w-14 h-14 rounded-sm flex items-center justify-center relative',
                    )}
                    style={{
                      backgroundColor: badge.unlocked
                        ? `${badge.color}20`
                        : '#e2e8f0',
                    }}
                  >
                    <HugeiconsIcon
                      icon={badge.unlocked ? Award01Icon : LockIcon}
                      size={24}
                      style={{
                        color: badge.unlocked ? badge.color : '#94a3b8',
                      }}
                    />
                    {badge.unlocked && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-accent text-white flex items-center justify-center border-2 border-white">
                        <HugeiconsIcon icon={CheckmarkCircle02Icon} size={10} />
                      </div>
                    )}
                  </div>
                  <div className="text-[12px] font-bold font-display text-foreground line-clamp-1">
                    {badge.name}
                  </div>
                  <div className="text-[10px] text-muted font-body line-clamp-2 min-h-[1.8rem]">
                    {badge.description}
                  </div>
                  {!badge.unlocked && badge.progress !== undefined && badge.total && (
                    <div className="w-full mt-1">
                      <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden">
                        <div
                          className="h-full"
                          style={{
                            width: `${pct}%`,
                            backgroundColor: badge.color,
                          }}
                        />
                      </div>
                      <div className="text-[10px] font-semibold font-body text-muted mt-1">
                        {badge.progress}/{badge.total}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div className="rounded-sm bg-white border border-slate-100 p-6">
          <h3 className="text-[1.125rem] font-bold font-display text-foreground mb-4">
            Activity timeline
          </h3>
          <ul className="relative flex flex-col gap-4 before:content-[''] before:absolute before:left-[1.125rem] before:top-2 before:bottom-2 before:w-px before:bg-slate-200">
            {recentActivity.map((activity: any) => {
              const Icon = activityIcons[activity.type] ?? CheckmarkCircle02Icon
              return (
                <li key={activity.id} className="relative flex items-start gap-3 pl-0">
                  <div className="relative z-10 w-9 h-9 rounded-sm bg-white border border-slate-200 flex items-center justify-center flex-shrink-0">
                    <HugeiconsIcon icon={Icon} size={16} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0 pt-1">
                    <div className="text-[13px] font-semibold font-body text-foreground leading-tight">
                      {activity.title}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] text-muted font-body">
                        {activity.at}
                      </span>
                      {activity.xp !== undefined && (
                        <span className="text-[11px] font-bold font-display text-accent">
                          +{activity.xp} XP
                        </span>
                      )}
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </section>
    </div>
  )
}

function Chip({
  icon,
  color,
  bg,
  label,
}: {
  icon: IconSvgElement
  color: string
  bg: string
  label: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 h-7 px-2.5 rounded-sm text-[11px] font-semibold font-body border border-slate-100',
        bg,
      )}
      style={{ color }}
    >
      <HugeiconsIcon icon={icon} size={12} />
      {label}
    </span>
  )
}

function StatTile({
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
