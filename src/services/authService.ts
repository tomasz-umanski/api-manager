import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User as FirebaseUser,
} from 'firebase/auth'
import { auth, isFirebaseConfigured } from '../lib/firebase'
import { mockUser } from './mockData'
import type { User } from '../types/domain'

let mockAuthUser: User | null = null
const mockListeners = new Set<(user: User | null) => void>()

function notifyMockListeners() {
  mockListeners.forEach((listener) => listener(mockAuthUser))
}

function mapFirebaseUser(firebaseUser: FirebaseUser): User {
  return {
    id: firebaseUser.uid,
    email: firebaseUser.email ?? '',
    name: firebaseUser.displayName ?? firebaseUser.email?.split('@')[0] ?? 'User',
    role: 'ADMIN',
    team: 'Platform',
  }
}

export function subscribeToAuth(onChange: (user: User | null) => void) {
  if (!isFirebaseConfigured || !auth) {
    onChange(mockAuthUser)
    mockListeners.add(onChange)
    return () => {
      mockListeners.delete(onChange)
    }
  }

  return onAuthStateChanged(auth, (firebaseUser) => {
    onChange(firebaseUser ? mapFirebaseUser(firebaseUser) : null)
  })
}

export async function loginWithEmail(email: string, password: string): Promise<User> {
  if (!isFirebaseConfigured || !auth) {
    void password
    await new Promise((resolve) => window.setTimeout(resolve, 250))
    mockAuthUser = { ...mockUser, email }
    notifyMockListeners()
    return mockAuthUser
  }

  const credential = await signInWithEmailAndPassword(auth, email, password)
  return mapFirebaseUser(credential.user)
}

export async function registerWithEmail(email: string, password: string): Promise<User> {
  if (!isFirebaseConfigured || !auth) {
    await new Promise((resolve) => window.setTimeout(resolve, 250))
    mockAuthUser = { ...mockUser, email, name: email.split('@')[0] ?? 'User' }
    notifyMockListeners()
    return mockAuthUser
  }

  const credential = await createUserWithEmailAndPassword(auth, email, password)
  return mapFirebaseUser(credential.user)
}

export async function logout(): Promise<void> {
  if (!isFirebaseConfigured || !auth) {
    mockAuthUser = null
    notifyMockListeners()
    return
  }

  await signOut(auth)
}
