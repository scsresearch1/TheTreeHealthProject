import { useEffect } from 'react'
import { useAuthStore } from '../stores/authStore'
import { useConnectionStore } from '../stores/connectionStore'
import { hydrateFromFirestore } from '../lib/firestore/sync'
import { isFirestoreConfigured } from '../lib/firestore/repository'
import { ensureFirebaseAuth } from '../lib/firestore/auth'

export function useFirestoreSync() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const setConnection = useConnectionStore((s) => s.setConnection)

  useEffect(() => {
    if (!isAuthenticated) {
      setConnection('local')
      return
    }

    if (!isFirestoreConfigured) {
      setConnection('local')
      return
    }

    let cancelled = false
    setConnection('firestore_connecting')

    ;(async () => {
      try {
        await ensureFirebaseAuth()
        const ok = await hydrateFromFirestore()
        if (!cancelled) {
          setConnection(ok ? 'firestore_synced' : 'firestore_error', ok ? null : 'Hydration returned false')
        }
      } catch (err) {
        if (!cancelled) {
          setConnection('firestore_error', err instanceof Error ? err.message : 'Firestore sync failed')
        }
      }
    })()

    return () => { cancelled = true }
  }, [isAuthenticated, setConnection])

  return useConnectionStore()
}
