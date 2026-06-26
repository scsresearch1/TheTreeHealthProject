import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, LoginCredentials, Permission } from '../types/firestore'
import { findDemoCredential } from '../config/demoCredentials'
import { getRolePermissions } from '../lib/accessControl'
import { fetchUserProfile, isFirebaseConfigured } from '../lib/rtdb/repository'
import { signInFirebaseDemoUser, signOutFirebase } from '../lib/rtdb/auth'

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
          await new Promise((r) => setTimeout(r, 400))
          if (!credentials.email || !credentials.password) {
            throw new Error('Email and password are required')
          }
          const demo = findDemoCredential(credentials.email, credentials.password)
          if (!demo) {
            throw new Error('Invalid email or password. Open Demo logins for default credentials.')
          }
          const role = demo.role
          let userId = `mock-${role}`
          let displayName = demo.label

          if (isFirebaseConfigured) {
            userId = await signInFirebaseDemoUser(demo.email, credentials.password)
            const profile = await fetchUserProfile(userId)
            if (profile?.displayName) displayName = profile.displayName
          }

          const user: User = {
            id: userId,
            email: demo.email,
            name: displayName,
            role,
            permissions: getRolePermissions(role),
          }
          set({
            user,
            token: isFirebaseConfigured ? `firebase-${userId}` : 'mock-jwt-token',
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

      logout: () => {
        if (isFirebaseConfigured) {
          signOutFirebase().catch(console.warn)
        }
        set({ user: null, token: null, isAuthenticated: false, error: null })
      },

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
