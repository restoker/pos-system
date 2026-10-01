import React from 'react'
import { useAuthStore, type User, type AuthSession, type AuthState } from '../store/auth.store'

export type { User, AuthSession }
export type AuthContextType = AuthState

/**
 * Hook using the Zustand auth store
 */
export function useAuth(): AuthState {
  return useAuthStore()
}

/**
 * Backward compatible wrapper (Zustand does not require a provider)
 */
export function AuthProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  return <>{children}</>
}
