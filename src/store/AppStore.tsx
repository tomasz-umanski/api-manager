/* eslint-disable react-refresh/only-export-components */
import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { loginWithEmail, logout, subscribeToAuth } from '../services/authService'
import { createContract, fetchContracts, runValidation, saveSlackWebhook } from '../services/mockApi'
import { activityEvents, consumers, providers } from '../services/mockData'
import type { ActivityEvent, Consumer, Contract, NewContractInput, Provider, User, ValidationRun } from '../types/domain'

interface AppStore {
  user: User | null
  authLoading: boolean
  contracts: Contract[]
  providers: Provider[]
  consumers: Consumer[]
  activity: ActivityEvent[]
  loadingContractIds: string[]
  loginUser: (email: string, password: string) => Promise<void>
  logoutUser: () => Promise<void>
  bootstrap: () => Promise<void>
  validateContract: (contractId: string) => Promise<ValidationRun | null>
  addContract: (input: NewContractInput) => Promise<Contract>
  updateSlackWebhook: (contractId: string, webhookUrl: string) => Promise<void>
}

const AppStoreContext = createContext<AppStore | null>(null)

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [contracts, setContracts] = useState<Contract[]>([])
  const [activity, setActivity] = useState<ActivityEvent[]>(activityEvents)
  const [loadingContractIds, setLoadingContractIds] = useState<string[]>([])

  useEffect(() => {
    return subscribeToAuth((nextUser) => {
      setUser(nextUser)
      setAuthLoading(false)
    })
  }, [])

  async function bootstrap() {
    if (contracts.length > 0) return
    setContracts(await fetchContracts())
  }

  async function loginUser(email: string, password: string) {
    await loginWithEmail(email, password)
    await bootstrap()
  }

  async function logoutUser() {
    await logout()
    setContracts([])
  }

  async function validateContract(contractId: string) {
    const contract = contracts.find((item) => item.id === contractId)
    if (!contract) return null

    setLoadingContractIds((ids) => [...ids, contractId])
    try {
      const run = await runValidation(contract)
      setContracts((current) =>
        current.map((item) =>
          item.id === contractId
            ? {
                ...item,
                status: run.validationResult === 'VIOLATED' ? 'VIOLATED' : 'COMPLIANT',
                validationRuns: [run, ...item.validationRuns],
                lastValidatedAt: run.triggeredAt,
                latencyMs: run.responseTimeMs,
              }
            : item,
        ),
      )
      setActivity((current) => [
        {
          id: `act_${Date.now()}`,
          type: run.validationResult === 'VIOLATED' ? 'diff' : 'validation',
          title: run.validationResult === 'VIOLATED' ? 'Breaking change detected' : `${contract.name} validation passed`,
          description:
            run.validationResult === 'VIOLATED'
              ? `${contract.name} produced ${run.diffRecords.length} schema differences.`
              : `No schema drift found in ${contract.name}.`,
          createdAt: run.triggeredAt,
          severity: run.validationResult === 'VIOLATED' ? 'danger' : 'success',
        },
        ...current,
      ])
      return run
    } finally {
      setLoadingContractIds((ids) => ids.filter((id) => id !== contractId))
    }
  }

  async function addContract(input: NewContractInput) {
    const contract = await createContract(input)
    setContracts((current) => [contract, ...current])
    setActivity((current) => [
      {
        id: `act_${Date.now()}`,
        type: 'contract',
        title: `${contract.name} registered`,
        description: 'Contract saved as version 1 and awaits first validation.',
        createdAt: new Date().toISOString(),
        severity: 'info',
      },
      ...current,
    ])
    return contract
  }

  async function updateSlackWebhook(contractId: string, webhookUrl: string) {
    const contract = contracts.find((item) => item.id === contractId)
    if (!contract) return
    const masked = await saveSlackWebhook(contract, webhookUrl)
    setContracts((current) => current.map((item) => (item.id === contractId ? { ...item, slackWebhookMasked: masked } : item)))
  }

  const value: AppStore = {
    user,
    authLoading,
    contracts,
    providers,
    consumers,
    activity,
    loadingContractIds,
    loginUser,
    logoutUser,
    bootstrap,
    validateContract,
    addContract,
    updateSlackWebhook,
  }

  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>
}

export function useAppStore() {
  const store = useContext(AppStoreContext)
  if (!store) {
    throw new Error('useAppStore must be used within AppStoreProvider')
  }
  return store
}
