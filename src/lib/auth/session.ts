import { cookies } from 'next/headers'

export const USER_COOKIE_KEY = 'signlex.auth.user'
export const TOKEN_COOKIE_KEY = 'signlex.auth.token'

export type ServerAuthUser = {
  id?: string | number
  email?: string
  displayName?: string
  firstName?: string
  lastName?: string
  avatarUrl?: string
  [key: string]: unknown
}

export type ServerSession = {
  user: ServerAuthUser | null
  token: string | null
}

export async function getServerSession(): Promise<ServerSession> {
  const store = await cookies()
  const rawUser = store.get(USER_COOKIE_KEY)?.value ?? null
  const rawToken = store.get(TOKEN_COOKIE_KEY)?.value ?? null

  let user: ServerAuthUser | null = null
  if (rawUser) {
    try {
      user = JSON.parse(decodeURIComponent(rawUser)) as ServerAuthUser
    } catch {
      user = null
    }
  }

  return { user, token: rawToken }
}
