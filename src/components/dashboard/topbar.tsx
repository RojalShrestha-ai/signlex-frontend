'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  FireIcon,
  Diamond01Icon,
  HeartCheckIcon,
  Notification02Icon,
  Menu01Icon,
  DashboardCircleIcon,
  BookOpen01Icon,
  Target02Icon,
  TaskDaily02Icon,
  RankingIcon,
  UserCircleIcon,
  Logout01Icon,
  Cancel01Icon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { useAuth } from '@/lib/providers'
import { useRouter } from 'next/navigation'
import type { IconSvgElement } from '@hugeicons/react'
import { useDashboardStats } from '@/lib/hooks'

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/dashboard/learn': 'Learn',
  '/dashboard/practice': 'Practice',
  '/dashboard/mock-test': 'Mock Test',
  '/dashboard/leaderboard': 'Leaderboard',
  '/dashboard/profile': 'Profile',
}

const pageSubtitles: Record<string, string> = {
  '/dashboard': 'Welcome back — keep the streak going',
  '/dashboard/learn': 'Structured lessons to build fluency',
  '/dashboard/practice': 'Sharpen your skills with targeted drills',
  '/dashboard/mock-test': 'Put your knowledge to the test',
  '/dashboard/leaderboard': 'See how you stack up against other signers',
  '/dashboard/profile': 'Your journey, badges and achievements',
}

type MobileNavItem = {
  href: string
  label: string
  icon: IconSvgElement
  exact?: boolean
}

const mobileNav: MobileNavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: DashboardCircleIcon, exact: true },
  { href: '/dashboard/learn', label: 'Learn', icon: BookOpen01Icon },
  { href: '/dashboard/practice', label: 'Practice', icon: Target02Icon },
  { href: '/dashboard/mock-test', label: 'Mock Test', icon: TaskDaily02Icon },
  { href: '/dashboard/leaderboard', label: 'Leaderboard', icon: RankingIcon },
  { href: '/dashboard/profile', label: 'Profile', icon: UserCircleIcon },
]

export function DashboardTopbar() {
  const pathname = usePathname() ?? '/dashboard'
  const title = pageTitles[pathname] ?? 'Dashboard'
  const subtitle = pageSubtitles[pathname] ?? ''
  const [mobileOpen, setMobileOpen] = useState(false)
  const { logout } = useAuth()
  const router = useRouter()
  const { data: stats } = useDashboardStats()

  const streak = stats?.streak ?? 0
  const gems = stats?.gems ?? 0
  const hearts = stats?.hearts ?? 5
  const maxHearts = stats?.maxHearts ?? 5

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <>
      <header className="sticky top-0 z-20 w-full h-[4.5rem] bg-white/95 backdrop-blur-sm border-b border-slate-100 flex items-center">
        <div className="w-full px-4 md:px-8 flex items-center justify-between gap-4">
          <div className="hidden md:flex flex-col leading-tight">
            <h1 className="text-[1.25rem] font-bold font-display text-foreground tracking-[-0.01em]">
              {title}
            </h1>
            {subtitle && (
              <span className="text-[12px] text-muted font-body">{subtitle}</span>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-sm border border-slate-200 text-foreground cursor-pointer"
            aria-label="Open menu"
          >
            <HugeiconsIcon icon={Menu01Icon} size={18} />
          </button>

          <div className="flex items-center gap-2 md:gap-3">
            <div className="flex items-center gap-1.5 h-10 px-3 rounded-sm bg-orange-50 border border-orange-100">
              <HugeiconsIcon icon={FireIcon} size={16} className="text-[#F59E0B]" />
              <span className="text-sm font-bold font-display text-[#F59E0B]">
                {streak}
              </span>
            </div>

            {/* <div className="hidden sm:flex items-center gap-1.5 h-10 px-3 rounded-sm bg-blue-50 border border-blue-100">
              <HugeiconsIcon icon={Diamond01Icon} size={16} className="text-primary" />
              <span className="text-sm font-bold font-display text-primary">
                {gems.toLocaleString()}
              </span>
            </div> */}

            {/* <div className="hidden sm:flex items-center gap-1.5 h-10 px-3 rounded-sm bg-red-50 border border-red-100">
              <HugeiconsIcon icon={HeartCheckIcon} size={16} className="text-destructive" />
              <span className="text-sm font-bold font-display text-destructive">
                {hearts}/{maxHearts}
              </span>
            </div> */}

            {/* <button
              type="button"
              className="hidden md:flex relative items-center justify-center w-10 h-10 rounded-sm border border-slate-200 hover:bg-slate-50 transition-all cursor-pointer"
              aria-label="Notifications"
            >
              <HugeiconsIcon icon={Notification02Icon} size={16} className="text-muted" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-destructive" />
            </button> */}
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="absolute top-0 left-0 h-full w-[17rem] bg-white shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between h-[4.5rem] px-4 border-b border-slate-100">
              <span className="font-display font-bold text-foreground">Menu</span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="w-9 h-9 flex items-center justify-center rounded-sm hover:bg-slate-100 cursor-pointer"
                aria-label="Close menu"
              >
                <HugeiconsIcon icon={Cancel01Icon} size={18} />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto p-3">
              <ul className="flex flex-col gap-1">
                {mobileNav.map((item) => {
                  const active = item.exact
                    ? pathname === item.href
                    : pathname?.startsWith(item.href)
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          'flex items-center gap-3 px-3 h-11 rounded-sm font-body text-sm transition-all',
                          active
                            ? 'bg-primary text-white font-semibold'
                            : 'text-muted hover:text-foreground hover:bg-slate-100',
                        )}
                      >
                        <HugeiconsIcon icon={item.icon} size={18} />
                        {item.label}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </nav>
            <div className="border-t border-slate-100 p-3 flex flex-col gap-1">
              <Link
                href="/"
                className="flex items-center gap-3 px-3 h-10 rounded-sm text-sm text-muted hover:bg-slate-100 font-body"
              >
                Back to site
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 h-10 rounded-sm text-sm text-destructive hover:bg-red-50 font-body cursor-pointer"
              >
                <HugeiconsIcon icon={Logout01Icon} size={16} />
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
