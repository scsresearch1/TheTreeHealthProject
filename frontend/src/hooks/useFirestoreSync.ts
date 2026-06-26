import { useEffect, useState } from 'react'
import { useAuthStore } from '../stores/authStore'
import { hydrateFromFirestore } from '../lib/firestore/sync'
import { isFirestoreConfigured } from '../lib/firestore/repository'
import { ensureFirebaseAuth } from '../lib/firestore/auth'

export function useFirestoreSync() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const [synced, setSynced] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated || !isFirestoreConfigured) return

    let cancelled = false
    ;(async () => {
      try {
        await ensureFirebaseAuth()
        const ok = await hydrateFromFirestore()
        if (!cancelled) {
          setSynced(ok)
          setError(null)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Firestore sync failed')
        }
      }
    })()

    return () => { cancelled = true }
  }, [isAuthenticated])

  return { synced, error, enabled: isFirestoreConfigured }
}
