import { useEffect } from 'react'
import { useAuthStore } from '../stores/authStore'
import { useConnectionStore } from '../stores/connectionStore'
import { getFirebaseAuth } from '../lib/firebase'
import { hydrateFromRealtimeDb } from '../lib/rtdb/sync'
import { isFirebaseConfigured } from '../lib/rtdb/repository'

export function useRealtimeSync() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const setConnection = useConnectionStore((s) => s.setConnection)

  useEffect(() => {
    if (!isAuthenticated) {
      setConnection('local')
      return
    }

    if (!isFirebaseConfigured) {
      setConnection('local')
      return
    }

    if (!getFirebaseAuth().currentUser) {
      setConnection('rtdb_error', 'Firebase session expired — sign in again')
      return
    }

    let cancelled = false
    setConnection('rtdb_connecting')

    ;(async () => {
      try {
        const ok = await hydrateFromRealtimeDb()
        if (!cancelled) {
          setConnection(ok ? 'rtdb_synced' : 'rtdb_error', ok ? null : 'Hydration returned false')
        }
      } catch (err) {
        if (!cancelled) {
          setConnection('rtdb_error', err instanceof Error ? err.message : 'Realtime Database sync failed')
        }
      }
    })()

    return () => { cancelled = true }
  }, [isAuthenticated, setConnection])

  return useConnectionStore()
}

/** @deprecated use useRealtimeSync */
export const useFirestoreSync = useRealtimeSync
