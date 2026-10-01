import { create } from 'zustand'
import { authClient } from '../lib/auth-client'

export interface User {
  id: string
  name: string
  email: string
  image?: string | null
  role?: string
}

export interface AuthSession {
  id: string
  userId: string
  expiresAt: Date | string
}

export interface AuthState {
  user: User | null
  session: AuthSession | null
  isLoading: boolean
  isAuthenticated: boolean
  initSession: () => Promise<void>
  signIn: (credentials: { email: string; password: string }) => Promise<{ error?: { message: string } | null }>
  signUp: (data: { email: string; password: string; name: string }) => Promise<{ error?: { message: string } | null }>
  signOut: () => Promise<void>
  loginAsDemo: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  isLoading: true,
  isAuthenticated: false,
  initSession: async (): Promise<void> => {
    try {
      // 1. Try Better Auth React client getSession
      const res = await authClient.getSession()
      if (res?.data?.user) {
        const u = res.data.user as User
        const s = (res.data.session as unknown as AuthSession) ?? null
        set({
          user: u,
          session: s,
          isAuthenticated: true,
          isLoading: false
        })
        return
      }

      // 2. Try window.getUser IPC bridge from @better-auth/electron in Electron
      if (typeof window !== 'undefined' && typeof window.getUser === 'function') {
        const electronUser = await window.getUser()
        if (electronUser) {
          set({
            user: electronUser as User,
            session: null,
            isAuthenticated: true,
            isLoading: false
          })
          return
        }
      }

      // 3. Check local storage for persistent guest/demo session
      const stored = localStorage.getItem('kora_pos_session')
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          if (parsed?.user) {
            set({
              user: parsed.user,
              session: parsed.session ?? null,
              isAuthenticated: true,
              isLoading: false
            })
            return
          }
        } catch {
          localStorage.removeItem('kora_pos_session')
        }
      }

      set({
        user: null,
        session: null,
        isAuthenticated: false,
        isLoading: false
      })
    } catch (err) {
      console.warn('Session init error notice:', err)
      set({
        user: null,
        session: null,
        isAuthenticated: false,
        isLoading: false
      })
    }
  },
  signIn: async ({ email, password }): Promise<{ error?: { message: string } | null }> => {
    set({ isLoading: true })
    try {
      const result = await authClient.signIn.email({
        email,
        password
      })

      if (result.error) {
        set({ isLoading: false })
        return { error: { message: result.error.message || 'Credentials invalid. Please verify.' } }
      }

      if (result.data?.user) {
        const u = result.data.user as User
        const sess: AuthSession = {
          id: ('token' in result.data && result.data.token ? String(result.data.token) : 'sess-token'),
          userId: u.id,
          expiresAt: new Date(Date.now() + 86400000).toISOString()
        }
        set({
          user: u,
          session: sess,
          isAuthenticated: true,
          isLoading: false
        })
        localStorage.setItem(
          'kora_pos_session',
          JSON.stringify({ user: u, session: sess })
        )
      }
      set({ isLoading: false })
      return { error: null }
    } catch (err: unknown) {
      set({ isLoading: false })
      const message = err instanceof Error ? err.message : 'Authentication service unreachable.'
      return { error: { message } }
    }
  },
  signUp: async ({ email, password, name }): Promise<{ error?: { message: string } | null }> => {
    set({ isLoading: true })
    try {
      const result = await authClient.signUp.email({
        email,
        password,
        name
      })

      if (result.error) {
        set({ isLoading: false })
        return { error: { message: result.error.message || 'Registration failed.' } }
      }

      if (result.data?.user) {
        const u = result.data.user as User
        const sess: AuthSession = {
          id: ('token' in result.data && result.data.token ? String(result.data.token) : 'sess-token'),
          userId: u.id,
          expiresAt: new Date(Date.now() + 86400000).toISOString()
        }
        set({
          user: u,
          session: sess,
          isAuthenticated: true,
          isLoading: false
        })
        localStorage.setItem(
          'kora_pos_session',
          JSON.stringify({ user: u, session: sess })
        )
      }
      set({ isLoading: false })
      return { error: null }
    } catch (err: unknown) {
      set({ isLoading: false })
      const message = err instanceof Error ? err.message : 'Registration error. Please check server.'
      return { error: { message } }
    }
  },
  signOut: async (): Promise<void> => {
    set({ isLoading: true })
    try {
      await authClient.signOut()
      if (typeof window !== 'undefined' && typeof window.signOut === 'function') {
        await window.signOut()
      }
    } catch (err) {
      console.warn('Sign out call notice:', err)
    } finally {
      localStorage.removeItem('kora_pos_session')
      set({
        user: null,
        session: null,
        isAuthenticated: false,
        isLoading: false
      })
    }
  },
  loginAsDemo: async (): Promise<void> => {
    set({ isLoading: true })
    const demoUser: User = {
      id: 'demo-cashier-01',
      name: 'Elena Vance',
      email: 'elena.vance@korapos.local',
      role: 'Head Cashier'
    }
    const demoSession: AuthSession = {
      id: 'demo-sess-01',
      userId: demoUser.id,
      expiresAt: new Date(Date.now() + 86400000).toISOString()
    }
    set({
      user: demoUser,
      session: demoSession,
      isAuthenticated: true,
      isLoading: false
    })
    localStorage.setItem(
      'kora_pos_session',
      JSON.stringify({ user: demoUser, session: demoSession })
    )
  }
}))

// Automatically initialize session on startup
useAuthStore.getState().initSession()

// Listen to Better Auth Electron IPC bridges if available
if (typeof window !== 'undefined') {
  if (typeof window.onAuthenticated === 'function') {
    window.onAuthenticated((newUser) => {
      if (newUser) {
        useAuthStore.setState({
          user: newUser as User,
          isAuthenticated: true
        })
      }
    })
  }
  if (typeof window.onUserUpdated === 'function') {
    window.onUserUpdated((updatedUser) => {
      useAuthStore.setState({
        user: (updatedUser as User) || null,
        isAuthenticated: !!updatedUser
      })
    })
  }
}
