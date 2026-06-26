import { create } from 'zustand'

export type DataConnectionMode =
  | 'local'
  | 'rtdb_connecting'
  | 'rtdb_synced'
  | 'rtdb_error'

interface ConnectionStore {
  mode: DataConnectionMode
  error: string | null
  setConnection: (mode: DataConnectionMode, error?: string | null) => void
}

export const useConnectionStore = create<ConnectionStore>((set) => ({
  mode: 'local',
  error: null,
  setConnection: (mode, error = null) => set({ mode, error }),
}))
