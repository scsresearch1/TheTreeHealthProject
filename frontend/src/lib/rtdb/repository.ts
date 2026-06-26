import { get, ref, remove, set, update } from 'firebase/database'
import { getRealtimeDb, isFirebaseConfigured } from '../firebase'

export { isFirebaseConfigured, isFirebaseConfigured as isFirestoreConfigured }

export async function fetchCollection<T>(path: string): Promise<T[]> {
  const snap = await get(ref(getRealtimeDb(), path))
  if (!snap.exists()) return []
  const val = snap.val() as Record<string, Record<string, unknown>>
  return Object.entries(val).map(([key, data]) => {
    const row = { ...data, id: key } as T
    if (path === 'trees' && !(row as { treeId?: string }).treeId) {
      (row as { treeId: string }).treeId = key
    }
    return row
  })
}

export async function upsertDocument(
  basePath: string,
  id: string,
  data: Record<string, unknown>,
) {
  const { id: _id, ...rest } = data
  await set(ref(getRealtimeDb(), `${basePath}/${id}`), rest)
}

export async function deleteDocument(basePath: string, id: string) {
  await remove(ref(getRealtimeDb(), `${basePath}/${id}`))
}

export async function batchUpsert(
  basePath: string,
  items: Array<{ id: string; data: Record<string, unknown> }>,
) {
  if (!items.length) return
  const updates: Record<string, unknown> = {}
  for (const item of items) {
    const { id: _id, ...rest } = item.data
    updates[`${basePath}/${item.id}`] = rest
  }
  await update(ref(getRealtimeDb()), updates)
}
