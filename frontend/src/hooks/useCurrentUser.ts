import { useAuthStore } from '../stores/authStore'

export function useCurrentUserId() {
  const user = useAuthStore((s) => s.user)
  return user ? `mock-${user.role}` : 'anonymous'
}
