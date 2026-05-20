import type { Contract, DiffRecord, NewContractInput, User, ValidationRun } from '../types/domain'
import { consumers, initialContracts, mockUser, providers } from './mockData'

const delay = (ms = 300) => new Promise((resolve) => window.setTimeout(resolve, ms))

export async function login(email: string, password: string): Promise<User> {
  void password
  await delay(250)
  return { ...mockUser, email }
}

export async function fetchContracts(): Promise<Contract[]> {
  await delay(200)
  return structuredClone(initialContracts)
}

export async function runValidation(contract: Contract): Promise<ValidationRun> {
  await delay(650)

  if (contract.status === 'UNKNOWN') {
    return {
      id: `run_${contract.id}_${Date.now()}`,
      contractId: contract.id,
      triggeredAt: new Date().toISOString(),
      triggerType: 'MANUAL',
      endpointStatus: 'OK',
      validationResult: 'COMPLIANT',
      responseTimeMs: 128,
      diffRecords: [],
    }
  }

  if (contract.status === 'COMPLIANT') {
    return {
      id: `run_${contract.id}_${Date.now()}`,
      contractId: contract.id,
      triggeredAt: new Date().toISOString(),
      triggerType: 'MANUAL',
      endpointStatus: 'OK',
      validationResult: 'COMPLIANT',
      responseTimeMs: Math.max(80, contract.latencyMs - 8),
      diffRecords: [],
    }
  }

  const existingViolation = contract.validationRuns.find((run) => run.validationResult === 'VIOLATED')
  const diffs: DiffRecord[] = existingViolation?.diffRecords ?? []

  return {
    id: `run_${contract.id}_${Date.now()}`,
    contractId: contract.id,
    triggeredAt: new Date().toISOString(),
    triggerType: 'MANUAL',
    endpointStatus: 'OK',
    validationResult: 'VIOLATED',
    responseTimeMs: contract.latencyMs,
    diffRecords: diffs.map((diff) => ({ ...diff, validationRunId: `run_${contract.id}_${Date.now()}` })),
  }
}

export async function createContract(input: NewContractInput): Promise<Contract> {
  await delay(350)
  const owner = providers.find((provider) => provider.id === input.ownerId) ?? providers[0]
  const selectedConsumers = consumers.filter((consumer) => input.consumers.includes(consumer.id))

  return {
    id: `ctr_${Date.now()}`,
    name: input.name,
    description: 'Newly registered contract awaiting first validation.',
    owner,
    endpointUrl: input.endpointUrl,
    specFormat: 'OPENAPI_3',
    status: 'UNKNOWN',
    currentVersion: 1,
    consumers: selectedConsumers,
    endpoints: [{ id: `ep_${Date.now()}`, method: 'GET', path: '/v1/resource/{id}', description: 'Detected endpoint' }],
    versions: [
      {
        id: `ver_${Date.now()}`,
        contractId: `ctr_${Date.now()}`,
        versionNumber: 1,
        sourceType: input.sourceType,
        publishedAt: new Date().toISOString(),
        schemaSnapshot: input.schema,
      },
    ],
    validationRuns: [],
    notifications: [],
    latencyMs: 0,
  }
}

export async function saveSlackWebhook(contract: Contract, webhookUrl: string): Promise<string> {
  await delay(250)
  const suffix = webhookUrl.split('/').filter(Boolean).at(-1) ?? 'configured'
  return `https://hooks.slack.com/services/***/***/${suffix}`
}
