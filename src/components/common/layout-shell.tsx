'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import { Navbar } from './navbar'
import { Footer } from './footer'
import type { AuthUser } from '@/lib/providers'

type LayoutShellProps = {
  children: ReactNode
  initialUser?: AuthUser | null
}

/**
 * Wraps children with the site Navbar + Footer for public pages, but renders
 * a bare shell on /dashboard/* so the dashboard can own its entire layout
 * (sidebar, gamified topbar, etc).
 */
export function LayoutShell({ children, initialUser = null }: LayoutShellProps) {
  const pathname = usePathname()
  const isDashboard = pathname?.startsWith('/dashboard') ?? false

  if (isDashboard) {
    return <>{children}</>
  }

  return (
    <>
      <Navbar initialUser={initialUser} />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  )
}
