'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import { Button } from '../ui/Button'
import {
  ArrowRight01Icon,
  ArrowDown01Icon,
  DashboardCircleIcon,
  UserCircleIcon,
  Logout01Icon,
  Settings01Icon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useAuth, type AuthUser } from '@/lib/providers'
import { cn } from '@/lib/utils'

type NavbarProps = {
  initialUser?: AuthUser | null
}

const publicLinks = [
  { href: '/about', label: 'Team Info' },
  { href: '/credits', label: 'Credits' },
  // { href: '/pricing', label: 'Pricing' },
  // { href: '/contact', label: 'Contact' },
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
  if (!user) return ''
  return (
    user.displayName ||
    [user.firstName, user.lastName].filter(Boolean).join(' ').trim() ||
    (typeof user.email === 'string' ? user.email.split('@')[0] : 'Account')
  )
}

const Navbar = ({ initialUser = null }: NavbarProps) => {
  // Read from context for live updates (login/logout), but use initialUser
  // as the first-paint source of truth so there's no logged-out flicker.
  const { user: ctxUser, logout, isHydrated } = useAuth()
  const user = isHydrated ? ctxUser : initialUser
  const isAuthed = Boolean(user)

  const pathname = usePathname()
  const router = useRouter()

  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [menuOpen])

  // Menu closes via onClick handlers on individual links / handleLogout.

  const handleLogout = () => {
    logout()
    setMenuOpen(false)
    router.push('/')
  }

  return (
    <header className="w-full h-[4.5rem] flex justify-between items-center border-b border-slate-100 bg-white/90 backdrop-blur-sm sticky top-0 z-40">
      <div className="capsule flex items-center justify-between border-l border-r border-slate-100 w-full h-full">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link href={isAuthed ? '/dashboard' : '/'}>
            <Image
              className="w-[10.5rem]"
              src="/logo.svg"
              alt="SignLex Logo"
              width={2000}
              height={2000}
            />
          </Link>
        </div>

        {/* Center links — same for everyone, logged in or out */}
        <nav className="hidden md:flex gap-1 items-center">
          {publicLinks.map((item) => {
            const active = pathname?.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'px-4 h-10 flex items-center rounded-sm font-body text-sm transition-all',
                  active
                    ? 'bg-primary/10 text-primary font-semibold'
                    : 'text-muted hover:text-foreground hover:bg-slate-100',
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {isAuthed ? (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2.5 pl-1.5 pr-3 py-1.5 rounded-sm border border-slate-200 hover:border-primary/40 hover:bg-slate-50 transition-all cursor-pointer"
              >
                <div className="w-8 h-8 rounded-sm bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs font-bold font-display">
                  {getInitials(user)}
                </div>
                <div className="hidden sm:flex flex-col items-start leading-tight">
                  <span className="text-[13px] font-semibold text-foreground font-body max-w-[120px] truncate">
                    {getDisplayName(user)}
                  </span>
                  <span className="text-[11px] text-muted font-body">
                    My account
                  </span>
                </div>
                <HugeiconsIcon
                  icon={ArrowDown01Icon}
                  size={14}
                  className={cn(
                    'text-muted transition-transform',
                    menuOpen && 'rotate-180',
                  )}
                />
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-[calc(100%+0.5rem)] w-64 bg-white border border-slate-200 rounded-sm shadow-[0_12px_40px_rgba(0,0,0,0.08)] overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
                    <div className="text-[13px] font-semibold text-foreground font-body truncate">
                      {getDisplayName(user)}
                    </div>
                    {user?.email && (
                      <div className="text-[11px] text-muted font-body truncate">
                        {user.email}
                      </div>
                    )}
                  </div>
                  <div className="py-1">
                    <Link
                      href="/dashboard"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-slate-50 font-body"
                    >
                      <HugeiconsIcon
                        icon={DashboardCircleIcon}
                        size={16}
                        className="text-muted"
                      />
                      Dashboard
                    </Link>
                    <Link
                      href="/dashboard/profile"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-slate-50 font-body"
                    >
                      <HugeiconsIcon
                        icon={UserCircleIcon}
                        size={16}
                        className="text-muted"
                      />
                      Profile
                    </Link>
                    <Link
                      href="/dashboard/profile"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-slate-50 font-body"
                    >
                      <HugeiconsIcon
                        icon={Settings01Icon}
                        size={16}
                        className="text-muted"
                      />
                      Settings
                    </Link>
                  </div>
                  <div className="border-t border-slate-100 py-1">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-red-50 font-body cursor-pointer"
                    >
                      <HugeiconsIcon icon={Logout01Icon} size={16} />
                      Log out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/auth/login">
                <Button
                  label="Login"
                  variant="outline"
                  size="md"
                  rightIcon={ArrowRight01Icon}
                />
              </Link>
              <Link href="/auth/signup" className="hidden sm:block">
                <Button
                  label="Signup"
                  variant="primary"
                  size="md"
                  rightIcon={ArrowRight01Icon}
                />
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export { Navbar }
