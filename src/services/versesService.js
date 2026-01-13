import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  writeBatch,
} from 'firebase/firestore'
import { db } from './firebase'
import { seedVerses } from '../data/seedVerses'

const versesRef = collection(db, 'verses')
const adminsRef = collection(db, 'admins')

export const subscribeVerses = (onData, onStatus, onError) => {
  const versesQuery = query(versesRef)
  return onSnapshot(
    versesQuery,
    (snapshot) => {
      const items = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }))
      onData(items)
      onStatus?.('Firestore接続: OK')
    },
    (error) => {
      console.error(error)
      onError?.(error)
      onStatus?.('Firestore未接続: ローカル表示')
    }
  )
}

export const checkAdmin = async (uid) => {
  if (!uid) return false
  const adminDoc = await getDoc(doc(adminsRef, uid))
  return adminDoc.exists()
}

export const createVerse = async ({ reference, text, note, tags }) => {
  const id = crypto.randomUUID()
  const payload = {
    id,
    reference,
    text,
    note: note || '',
    tags: tags || [],
    createdAt: new Date().toISOString(),
  }
  await setDoc(doc(versesRef, id), payload)
  return payload
}

export const updateVerse = async (id, data) => {
  await updateDoc(doc(versesRef, id), {
    reference: data.reference,
    text: data.text,
    note: data.note || '',
    tags: data.tags || [],
  })
}

export const deleteVerse = async (id) => {
  await deleteDoc(doc(versesRef, id))
}

export const createVersesBatch = async (entries) => {
  const batch = writeBatch(db)
  const created = entries.map((entry) => {
    const id = crypto.randomUUID()
    const payload = {
      id,
      reference: entry.reference,
      text: entry.text,
      note: entry.note || '',
      tags: entry.tags || [],
      createdAt: new Date().toISOString(),
    }
    batch.set(doc(versesRef, id), payload)
    return payload
  })
  await batch.commit()
  return created
}

export const seedIfEmpty = async (currentCount) => {
  if (currentCount > 0) return false
  const batch = writeBatch(db)
  seedVerses.forEach((entry) => {
    const id = crypto.randomUUID()
    batch.set(doc(versesRef, id), {
      id,
      reference: entry.reference,
      text: entry.text,
      note: entry.note || '',
      tags: entry.tags || [],
      createdAt: new Date().toISOString(),
    })
  })
  await batch.commit()
  return true
}
