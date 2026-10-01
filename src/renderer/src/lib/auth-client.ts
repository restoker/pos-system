import { createAuthClient } from 'better-auth/react'

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_BETTER_AUTH_URL || 'http://127.0.0.1:5173'
})

export const { useSession, signIn, signUp, signOut } = authClient
