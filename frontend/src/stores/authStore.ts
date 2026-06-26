import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, LoginCredentials, Permission } from '../types/firestore'
import { findDemoCredential } from '../config/demoCredentials'
import { getRolePermissions } from '../lib/accessControl'
import { ensureFirebaseAuth } from '../lib/firestore/auth'
import { isFirestoreConfigured } from '../lib/firestore/repository'

interface AuthStore {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
  clearError: () => void
  hasPermission: (permission: Permission) => boolean
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials) => {
        set({ isLoading: true, error: null })
        try {
          await new Promise((r) => setTimeout(r, 600))
          if (!credentials.email || !credentials.password) {
            throw new Error('Email and password are required')
          }
          const demo = findDemoCredential(credentials.email, credentials.password)
          if (!demo) {
            throw new Error('Invalid email or password. Open Demo logins for default credentials.')
          }
          const role = demo.role
          if (isFirestoreConfigured) {
            try { await ensureFirebaseAuth() } catch { /* local-only fallback */ }
          }
          const user: User = {
            id: 'mock-' + role,
            email: demo.email,
            name: demo.label,
            role,
            permissions: getRolePermissions(role),
          }
          set({
            user,
            token: 'mock-jwt-token',
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (err) {
          set({
            error: err instanceof Error ? err.message : 'Login failed',
            isLoading: false,
          })
          throw err
        }
      },

      logout: () => set({ user: null, token: null, isAuthenticated: false, error: null }),

      clearError: () => set({ error: null }),

      hasPermission: (permission) => {
        const perms = get().user?.permissions ?? []
        return perms.includes(permission)
      },
    }),
    {
      name: 'tree-health-auth',
      partialize: (s) => ({
        user: s.user,
        token: s.token,
        isAuthenticated: s.isAuthenticated,
      }),
    },
  ),
)
