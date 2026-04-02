'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useMutation, type UseMutationResult } from '@tanstack/react-query'
import { loginApi, signupApi } from '@/api/auth'

export type AuthUser = {
  id?: string | number
  email?: string
  displayName?: string
  firstName?: string
  lastName?: string
  avatarUrl?: string
  [key: string]: unknown
}

type LoginPayload = { username: string; password: string }
type SignupPayload = {
  firstName: string
  lastName: string
  email: string
  password: string
}

type AuthContextValue = {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  isHydrated: boolean
  loginMutation: UseMutationResult<any, Error, LoginPayload>
  signupMutation: UseMutationResult<any, Error, SignupPayload>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const USER_STORAGE_KEY = 'signlex.auth.user'
const TOKEN_STORAGE_KEY = 'signlex.auth.token'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30 // 30 days

function extractToken(data: any): string | null {
  if (!data) return null
  return (
    data.token ??
    data.accessToken ??
    data.access_token ??
    data?.data?.token ??
    data?.data?.accessToken ??
    null
  )
}

function extractUser(data: any): AuthUser | null {
  if (!data) return null
  return data.user ?? data?.data?.user ?? data?.data ?? null
}

function writeCookie(name: string, value: string | null) {
  if (typeof document === 'undefined') return
  if (value === null) {
    document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`
    return
  }
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`
}

export function AuthProvider({
  children,
  initialUser = null,
  initialToken = null,
}: {
  children: ReactNode
  initialUser?: AuthUser | null
  initialToken?: string | null
}) {
  // Seed state from the server so the first client render already knows
  // whether the user is logged in — no logged-out flash.
  const [user, setUser] = useState<AuthUser | null>(initialUser)
  const [token, setToken] = useState<string | null>(initialToken)
  const [isHydrated, setIsHydrated] = useState(Boolean(initialUser || initialToken))

  // Reconcile with localStorage on the client (in case it has fresher state
  // than the cookie, e.g. after a soft logout on another tab).
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(USER_STORAGE_KEY)
      const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY)
      if (storedUser && !initialUser) setUser(JSON.parse(storedUser))
      if (storedToken && !initialToken) setToken(storedToken)
    } catch {
      // ignore malformed storage
    } finally {
      setIsHydrated(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const persistSession = useCallback(
    (nextUser: AuthUser | null, nextToken: string | null) => {
      setUser(nextUser)
      setToken(nextToken)
      if (typeof window === 'undefined') return

      if (nextUser) {
        const serialized = JSON.stringify(nextUser)
        localStorage.setItem(USER_STORAGE_KEY, serialized)
        writeCookie(USER_STORAGE_KEY, serialized)
      } else {
        localStorage.removeItem(USER_STORAGE_KEY)
        writeCookie(USER_STORAGE_KEY, null)
      }

      if (nextToken) {
        localStorage.setItem(TOKEN_STORAGE_KEY, nextToken)
        writeCookie(TOKEN_STORAGE_KEY, nextToken)
      } else {
        localStorage.removeItem(TOKEN_STORAGE_KEY)
        writeCookie(TOKEN_STORAGE_KEY, null)
      }
    },
    [],
  )

  const loginMutation = useMutation({
    mutationFn: (payload: LoginPayload) => loginApi(payload),
    onSuccess: (data) => {
      persistSession(extractUser(data), extractToken(data))
    },
  })

  const signupMutation = useMutation({
    mutationFn: (payload: SignupPayload) => signupApi(payload),
    onSuccess: (data) => {
      const nextUser = extractUser(data)
      const nextToken = extractToken(data)
      if (nextUser || nextToken) {
        persistSession(nextUser, nextToken)
      }
    },
  })

  const logout = useCallback(() => {
    persistSession(null, null)
  }, [persistSession])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(user || token),
      isHydrated,
      loginMutation,
      signupMutation,
      logout,
    }),
    [user, token, isHydrated, loginMutation, signupMutation, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return ctx
}
