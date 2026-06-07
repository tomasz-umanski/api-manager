import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'
import type { User } from '../types/domain'

const storage = new Map<string, string>()

Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => {
      storage.set(key, value)
    },
    removeItem: (key: string) => {
      storage.delete(key)
    },
    clear: () => {
      storage.clear()
    },
  },
  configurable: true,
})

let currentUser: User | null = null
const subscribers: Array<(user: User | null) => void> = []

vi.mock('@hotjar/browser', () => ({
  default: {
    init: vi.fn(),
    stateChange: vi.fn(),
    isReady: vi.fn(() => true),
  },
}))

vi.mock('react-ga4', () => ({
  default: {
    initialize: vi.fn(),
    send: vi.fn(),
  },
}))

vi.mock('../services/authService', () => ({
  subscribeToAuth: vi.fn((onChange: (user: User | null) => void) => {
    onChange(currentUser)
    subscribers.push(onChange)
    return () => {
      const index = subscribers.indexOf(onChange)
      if (index >= 0) subscribers.splice(index, 1)
    }
  }),
  loginWithEmail: vi.fn(async (email: string) => {
    currentUser = {
      id: 'test-user',
      email,
      name: 'Admin',
      role: 'ADMIN',
      team: 'Platform',
    }
    subscribers.forEach((callback) => callback(currentUser))
    return currentUser
  }),
  registerWithEmail: vi.fn(async (email: string) => {
    currentUser = {
      id: 'test-user',
      email,
      name: 'Admin',
      role: 'ADMIN',
      team: 'Platform',
    }
    subscribers.forEach((callback) => callback(currentUser))
    return currentUser
  }),
  logout: vi.fn(async () => {
    currentUser = null
    subscribers.forEach((callback) => callback(null))
  }),
}))
