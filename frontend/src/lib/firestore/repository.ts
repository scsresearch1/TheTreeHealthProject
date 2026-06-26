import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  writeBatch,
} from 'firebase/firestore'
import { getFirestoreDb, isFirestoreConfigured } from '../firebase'

export { isFirestoreConfigured }

export async function fetchCollection<T>(
  name: string,
): Promise<T[]> {
  const snap = await getDocs(collection(getFirestoreDb(), name))
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as T)
}

export async function upsertDocument(
  collectionName: string,
  id: string,
  data: Record<string, unknown>,
) {
  const { id: _id, ...rest } = data as { id?: string }
  await setDoc(doc(getFirestoreDb(), collectionName, id), rest, { merge: true })
}

export async function deleteDocument(collectionName: string, id: string) {
  await deleteDoc(doc(getFirestoreDb(), collectionName, id))
}

export async function batchUpsert(
  collectionName: string,
  items: Array<{ id: string; data: Record<string, unknown> }>,
) {
  const batch = writeBatch(getFirestoreDb())
  for (const item of items) {
    batch.set(doc(getFirestoreDb(), collectionName, item.id), item.data, { merge: true })
  }
  await batch.commit()
}
