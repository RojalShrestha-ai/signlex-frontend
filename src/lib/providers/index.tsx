'use client'

import type { ReactNode } from 'react'
import { QueryProvider } from './query-provider'
import { AuthProvider, type AuthUser } from './auth-provider'

export { useAuth } from './auth-provider'
export type { AuthUser } from './auth-provider'

export function AppProviders({
  children,
  initialUser = null,
  initialToken = null,
}: {
  children: ReactNode
  initialUser?: AuthUser | null
  initialToken?: string | null
}) {
  return (
    <QueryProvider>
      <AuthProvider initialUser={initialUser} initialToken={initialToken}>
        {children}
      </AuthProvider>
    </QueryProvider>
  )
}
