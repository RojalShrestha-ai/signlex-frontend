'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  DashboardCircleIcon,
  BookOpen01Icon,
  Target02Icon,
  TaskDaily02Icon,
  RankingIcon,
  UserCircleIcon,
  Logout01Icon,
  ArrowLeft01Icon,
  FireIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useAuth, type AuthUser } from '@/lib/providers'
import { cn } from '@/lib/utils'
import { useDashboardStats } from '@/lib/hooks'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: DashboardCircleIcon, exact: true },
  { href: '/dashboard/learn', label: 'Learn', icon: BookOpen01Icon },
  { href: '/dashboard/practice', label: 'Practice', icon: Target02Icon },
  { href: '/dashboard/mock-test', label: 'Mock Test', icon: TaskDaily02Icon },
  { href: '/dashboard/leaderboard', label: 'Leaderboard', icon: RankingIcon },
  { href: '/dashboard/profile', label: 'Profile', icon: UserCircleIcon },
]

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

export function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()
  const { data: stats } = useDashboardStats()

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const level = stats?.level ?? 1
  const xp = stats?.xp ?? 0
  const xpToNextLevel = stats?.xpToNextLevel ?? 100
  const streak = stats?.streak ?? 0
  const xpPct = xpToNextLevel > 0 ? Math.min(100, Math.round((xp / xpToNextLevel) * 100)) : 0

  return (
    <aside className="hidden lg:flex flex-col w-[17.5rem] h-screen sticky top-0 border-r border-slate-100 bg-white z-30">
      <div className="flex items-center h-[4.5rem] px-6 border-b border-slate-100">
        <Link href="/dashboard">
          <Image
            src="/logo.svg"
            alt="SignLex"
            width={2000}
            height={2000}
            className="w-[9rem]"
          />
        </Link>
      </div>

      <div className="px-4 pt-5 pb-4 border-b border-slate-100">
        <Link
          href="/dashboard/profile"
          className="flex items-center gap-3 p-3 rounded-sm bg-gradient-to-br from-primary/5 to-accent/5 border border-slate-100 hover:border-primary/30 transition-all"
        >
          <div className="relative">
            <div className="w-11 h-11 rounded-sm bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-sm font-bold font-display">
              {getInitials(user)}
            </div>
            <div className="absolute -bottom-1 -right-1 min-w-[1.25rem] h-5 px-1 rounded-full bg-secondary text-foreground text-[10px] font-bold font-display flex items-center justify-center border-2 border-white">
              {level}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-semibold text-foreground font-body truncate">
              {getDisplayName(user)}
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              <HugeiconsIcon icon={FireIcon} size={12} className="text-[#F59E0B]" />
              <span className="text-[11px] text-muted font-body font-semibold">
                {streak} day streak
              </span>
            </div>
          </div>
        </Link>

        <div className="mt-3 px-1">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-muted font-body">
              Level {level}
            </span>
            <span className="text-[10px] font-semibold text-muted font-body">
              {xp}/{xpToNextLevel} XP
            </span>
          </div>
          <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all"
              style={{ width: `${xpPct}%` }}
            />
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="text-[10px] uppercase tracking-wider font-semibold text-muted font-body px-3 pb-2">
          Menu
        </div>
        <ul className="flex flex-col gap-1">
          {navItems.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname?.startsWith(item.href)
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 h-10 rounded-sm font-body text-sm transition-all group',
                    active
                      ? 'bg-primary text-white font-semibold shadow-[0_4px_12px_rgba(0,100,178,0.25)]'
                      : 'text-muted hover:text-foreground hover:bg-slate-100',
                  )}
                >
                  <HugeiconsIcon
                    icon={item.icon}
                    size={18}
                    className={cn(
                      active ? 'text-white' : 'text-muted group-hover:text-foreground',
                    )}
                  />
                  <span>{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="px-3 py-4 border-t border-slate-100 flex flex-col gap-1">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 h-10 rounded-sm text-sm text-muted hover:text-foreground hover:bg-slate-100 font-body transition-all"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
          Back to site
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 h-10 rounded-sm text-sm text-destructive hover:bg-red-50 font-body transition-all cursor-pointer"
        >
          <HugeiconsIcon icon={Logout01Icon} size={16} />
          Log out
        </button>
      </div>
    </aside>
  )
}
