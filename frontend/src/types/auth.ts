import type { User, UserRole, Permission, LoginCredentials } from './firestore'

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

export interface AuthResponse {
  user: User
  accessToken: string
  refreshToken?: string
}

export type { User, UserRole, Permission, LoginCredentials }
