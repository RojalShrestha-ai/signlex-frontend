'use client'

import { useMemo, useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  RankingIcon,
  Crown02Icon,
  StarIcon,
  Award01Icon,
  FireIcon,
  Target02Icon,
  Search01Icon,
} from '@hugeicons/core-free-icons'
import { useDashboardStats, useLeaderboard, useMyRank } from '@/lib/hooks'
import { cn } from '@/lib/utils'

const tabs = ['Weekly', 'Monthly', 'All time', 'Friends'] as const
type Tab = (typeof tabs)[number]

const rewards = [
  { place: '1st', gems: 500, badge: 'Gold Champion' },
  { place: '2nd', gems: 300, badge: 'Silver Star' },
  { place: '3rd', gems: 150, badge: 'Bronze Ace' },
  { place: 'Top 10', gems: 50, badge: null },
]

export default function LeaderboardPage() {
  const [tab, setTab] = useState<Tab>('Weekly')
  const [search, setSearch] = useState('')

  const { data: stats } = useDashboardStats()

  const period = tab === 'Weekly' ? 'weekly' : tab === 'Monthly' ? 'monthly' : 'global'
  const { data: lbData } = useLeaderboard(period, 50)
  const { data: myRankData } = useMyRank()

  const entries = (lbData?.rankings ?? []).map((e: any, i: number) => ({
    rank: e.rank ?? i + 1,
    name: e.displayName ?? 'Unknown',
    xp: e.totalXP ?? e.weeklyXP ?? e.monthlyXP ?? 0,
    level: Math.floor((e.totalXP ?? 0) / 500) + 1,
    avatar: (e.displayName ?? 'U').slice(0, 2).toUpperCase(),
  }))

  const top = entries
  const podium = top.slice(0, 3)
  const rest = top.slice(3)

  const you = myRankData?.rank ? {
    rank: myRankData.rank,
    name: 'You',
    xp: myRankData.totalXP ?? stats?.totalXp ?? 0,
    level: stats?.level ?? 1,
    avatar: 'YO',
    isYou: true,
  } : null

  const filteredRest = useMemo(() => {
    if (!search.trim()) return rest
    const q = search.toLowerCase()
    return rest.filter((e: any) => e.name.toLowerCase().includes(q))
  }, [rest, search])

  const leader = top[0]
  const xpGap = leader ? leader.xp - (you?.xp ?? 0) : 0
  const levelGap = leader ? leader.level - (you?.level ?? 0) : 0

  return (
    <div className="flex flex-col gap-6 max-w-[72rem] mx-auto w-full">
      {/* Banner */}
      <section className="relative overflow-hidden rounded-sm bg-gradient-to-br from-[#F59E0B] via-[#d97706] to-[#92400e] text-white p-6 md:p-8">
        <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-sm px-3 py-1 mb-3">
              <HugeiconsIcon icon={Crown02Icon} size={14} />
              <span className="text-xs font-semibold font-body">Leaderboard</span>
            </div>
            <h2 className="text-[1.75rem] md:text-[2.25rem] leading-tight font-bold font-display tracking-[-0.02em]">
              Climb the ranks
            </h2>
            <p className="text-white/85 font-body mt-2 max-w-xl">
              Earn XP to move up the board. Top 10 each week win gem rewards.
            </p>
          </div>
          {you && (
            <div className="bg-white/15 backdrop-blur-sm rounded-sm px-4 py-3 min-w-[12rem]">
              <div className="text-[11px] uppercase tracking-wider font-semibold font-body opacity-90">
                Your rank
              </div>
              <div className="text-[1.75rem] font-bold font-display leading-none mt-1">
                #{you.rank}
              </div>
              <div className="text-[11px] font-body opacity-90 mt-0.5">
                {you.xp.toLocaleString()} XP &middot; Level {you.level}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Stats comparison */}
      {you && leader && (
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            label="Your XP"
            value={you.xp.toLocaleString()}
            icon={StarIcon}
            color="#0064B2"
            bg="bg-blue-50"
          />
          <StatCard
            label="XP to #1"
            value={xpGap.toLocaleString()}
            icon={Target02Icon}
            color="#EF4444"
            bg="bg-red-50"
          />
          <StatCard
            label="Your level"
            value={`${you.level}`}
            icon={RankingIcon}
            color="#8B5CF6"
            bg="bg-purple-50"
          />
          <StatCard
            label="Streak"
            value={`${stats?.streak ?? 0}d`}
            icon={FireIcon}
            color="#F59E0B"
            bg="bg-orange-50"
          />
        </section>
      )}

      {/* Tabs + Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-2 rounded-sm bg-white border border-slate-100 p-1.5">
          {tabs.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={cn(
                'h-10 px-4 rounded-sm font-semibold text-sm font-body transition-all cursor-pointer',
                tab === t
                  ? 'bg-primary text-white shadow-[0_4px_12px_rgba(0,100,178,0.25)]'
                  : 'text-muted hover:text-foreground hover:bg-slate-100',
              )}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-auto">
          <HugeiconsIcon
            icon={Search01Icon}
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            type="text"
            placeholder="Search players..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full sm:w-60 pl-9 pr-4 rounded-sm border border-slate-200 bg-white text-sm font-body text-foreground placeholder:text-muted focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all"
          />
        </div>
      </div>

      {/* Podium */}
      <section className="rounded-sm bg-white border border-slate-100 p-6 md:p-8">
        <div className="grid grid-cols-3 gap-4 items-end max-w-2xl mx-auto">
          <PodiumCard entry={podium[1]} place={2} />
          <PodiumCard entry={podium[0]} place={1} />
          <PodiumCard entry={podium[2]} place={3} />
        </div>
      </section>

      {/* Weekly rewards */}
      <section className="rounded-sm bg-gradient-to-br from-secondary/15 to-secondary/5 border border-secondary/30 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-sm bg-secondary/30 flex items-center justify-center">
            <HugeiconsIcon icon={Award01Icon} size={18} className="text-[#B38A00]" />
          </div>
          <div>
            <h3 className="text-[1rem] font-bold font-display text-foreground">
              Weekly rewards
            </h3>
            <p className="text-[11px] text-muted font-body">
              Resets every Monday at midnight
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {rewards.map((r) => (
            <div
              key={r.place}
              className="rounded-sm bg-white border border-secondary/20 p-4 text-center"
            >
              <div className="text-[11px] uppercase tracking-wider font-semibold font-body text-[#B38A00]">
                {r.place}
              </div>
              <div className="text-[1.25rem] font-bold font-display text-foreground mt-1">
                {r.gems}
              </div>
              <div className="text-[11px] text-muted font-body">gems</div>
              {r.badge && (
                <div className="text-[10px] text-accent font-semibold font-body mt-2">
                  + &ldquo;{r.badge}&rdquo; badge
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Full ranking list */}
      <section className="rounded-sm bg-white border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-[1.125rem] font-bold font-display text-foreground">
            Full ranking
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-muted font-body">
              {filteredRest.length} players
            </span>
            <HugeiconsIcon icon={RankingIcon} size={18} className="text-muted" />
          </div>
        </div>
        <ul className="divide-y divide-slate-100">
          {filteredRest.map((entry: any) => (
            <li
              key={entry.rank}
              className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors"
            >
              <div className="w-8 text-center text-sm font-bold font-display text-muted">
                {entry.rank}
              </div>
              <div className="w-10 h-10 rounded-sm bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs font-bold font-display">
                {entry.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold font-body text-foreground truncate">
                  {entry.name}
                </div>
                <div className="text-[11px] text-muted font-body">
                  Level {entry.level}
                </div>
              </div>
              {/* XP bar relative to leader */}
              <div className="hidden md:flex items-center gap-3 w-40">
                <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary/60"
                    style={{
                      width: `${leader ? Math.round((entry.xp / leader.xp) * 100) : 100}%`,
                    }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-sm font-bold font-display text-primary min-w-[5rem] justify-end">
                <HugeiconsIcon icon={StarIcon} size={14} />
                {entry.xp.toLocaleString()}
              </div>
            </li>
          ))}

          {filteredRest.length === 0 && (
            <li className="px-6 py-10 text-center text-sm text-muted font-body">
              No players found matching &ldquo;{search}&rdquo;
            </li>
          )}

          {/* Your position */}
          {you && !search.trim() && (
            <li className="flex items-center gap-4 px-6 py-4 bg-primary/5 border-t-2 border-primary/30">
              <div className="w-8 text-center text-sm font-bold font-display text-primary">
                {you.rank}
              </div>
              <div className="w-10 h-10 rounded-sm bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs font-bold font-display ring-2 ring-primary/40 ring-offset-2">
                {you.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold font-body text-foreground">
                  {you.name}{' '}
                  <span className="text-[10px] uppercase tracking-wider font-bold text-primary ml-1">
                    (you)
                  </span>
                </div>
                <div className="text-[11px] text-muted font-body">
                  Level {you.level}
                </div>
              </div>
              <div className="hidden md:flex items-center gap-3 w-40">
                <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{
                      width: `${leader ? Math.round((you.xp / leader.xp) * 100) : 100}%`,
                    }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-sm font-bold font-display text-primary min-w-[5rem] justify-end">
                <HugeiconsIcon icon={StarIcon} size={14} />
                {you.xp.toLocaleString()}
              </div>
            </li>
          )}
        </ul>
      </section>
    </div>
  )
}

function StatCard({
  label,
  value,
  icon,
  color,
  bg,
}: {
  label: string
  value: string
  icon: Parameters<typeof HugeiconsIcon>[0]['icon']
  color: string
  bg: string
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

function PodiumCard({
  entry,
  place,
}: {
  entry?: {
    rank: number
    name: string
    xp: number
    level: number
    avatar: string
  }
  place: 1 | 2 | 3
}) {
  if (!entry) return <div />

  const styles = {
    1: {
      podium: 'h-40 bg-gradient-to-b from-secondary to-[#F59E0B]',
      badge: 'bg-secondary text-foreground',
      icon: Crown02Icon,
      size: 'w-20 h-20 text-lg',
    },
    2: {
      podium: 'h-32 bg-gradient-to-b from-slate-300 to-slate-400',
      badge: 'bg-slate-300 text-foreground',
      icon: null,
      size: 'w-16 h-16 text-sm',
    },
    3: {
      podium: 'h-28 bg-gradient-to-b from-orange-300 to-orange-400',
      badge: 'bg-orange-300 text-foreground',
      icon: null,
      size: 'w-16 h-16 text-sm',
    },
  }[place]

  return (
    <div className="flex flex-col items-center">
      <div
        className={cn(
          'rounded-sm bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold font-display ring-4 ring-white shadow-[0_8px_24px_rgba(0,0,0,0.1)]',
          styles.size,
        )}
      >
        {entry.avatar}
      </div>
      <div className="text-center mt-3">
        <div className="text-[13px] font-semibold font-body text-foreground truncate max-w-[8rem]">
          {entry.name}
        </div>
        <div className="flex items-center justify-center gap-1 text-[11px] font-bold font-display text-primary mt-0.5">
          <HugeiconsIcon icon={StarIcon} size={11} />
          {entry.xp.toLocaleString()}
        </div>
        <div className="text-[10px] text-muted font-body">
          Level {entry.level}
        </div>
      </div>
      <div
        className={cn(
          'w-full mt-3 rounded-t-sm flex items-start justify-center pt-3 relative',
          styles.podium,
        )}
      >
        <div className="absolute -top-4 flex items-center justify-center w-10 h-10 rounded-sm bg-white border border-slate-100 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
          {styles.icon ? (
            <HugeiconsIcon icon={styles.icon} size={18} className="text-secondary" />
          ) : (
            <span className="text-sm font-bold font-display text-foreground">
              {place}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
