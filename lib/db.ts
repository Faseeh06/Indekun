import { getFirestoreAdmin } from './firebase-admin'
import {
  CollectionReference,
  Query,
  DocumentData,
  Timestamp,
  FieldValue,
} from 'firebase-admin/firestore'

// Initialize Firestore
const db = () => getFirestoreAdmin()

// Helper to convert Firestore Timestamp to ISO string
export function convertTimestamps(data: any): any {
  if (data === null || data === undefined) {
    return data
  }

  if (data instanceof Timestamp) {
    return data.toDate().toISOString()
  }

  if (Array.isArray(data)) {
    return data.map(convertTimestamps)
  }

  if (typeof data === 'object') {
    const converted: any = {}
    for (const key in data) {
      if (data[key] instanceof Timestamp) {
        converted[key] = data[key].toDate().toISOString()
      } else if (data[key] instanceof FieldValue) {
        // Skip FieldValue objects (like serverTimestamp())
        continue
      } else if (typeof data[key] === 'object' && data[key] !== null) {
        converted[key] = convertTimestamps(data[key])
      } else {
        converted[key] = data[key]
      }
    }
    return converted
  }

  return data
}

// Collection references
export const collections = {
  users: () => db().collection('users'),
  equipment: () => db().collection('equipment'),
  bookings: () => db().collection('bookings'),
  auditLog: () => db().collection('audit_log'),
}

// Query helpers
export async function query(collectionRef: CollectionReference | Query): Promise<any[]> {
  const snapshot = await collectionRef.get()
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...convertTimestamps(doc.data()),
  }))
}

export async function queryOne(collectionRef: CollectionReference | Query): Promise<any | null> {
  const snapshot = await collectionRef.get()
  if (snapshot.empty) {
    return null
  }
  const doc = snapshot.docs[0]
  return {
    id: doc.id,
    ...convertTimestamps(doc.data()),
  }
}

export async function getById(collectionName: string, id: string): Promise<any | null> {
  const docRef = db().collection(collectionName).doc(id)
  const doc = await docRef.get()
  if (!doc.exists) {
    return null
  }
  return {
    id: doc.id,
    ...convertTimestamps(doc.data()),
  }
}

export async function create(collectionName: string, data: any): Promise<string> {
  const docRef = await db().collection(collectionName).add({
    ...data,
    created_at: new Date(),
    updated_at: new Date(),
  })
  return docRef.id
}

export async function update(collectionName: string, id: string, data: any): Promise<void> {
  await db()
    .collection(collectionName)
    .doc(id)
    .update({
      ...data,
      updated_at: new Date(),
    })
}

export async function deleteDoc(collectionName: string, id: string): Promise<void> {
  await db().collection(collectionName).doc(id).delete()
}

// Firestore instance export
export { db }
