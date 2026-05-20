export type ContractStatus = 'COMPLIANT' | 'VIOLATED' | 'UNKNOWN'
export type ValidationResult = 'COMPLIANT' | 'VIOLATED' | 'SKIPPED'
export type EndpointStatus = 'OK' | 'ENDPOINT_ERROR' | 'ENDPOINT_UNREACHABLE'
export type SourceType = 'URL' | 'FILE_UPLOAD' | 'MANUAL'
export type DiffChangeType = 'FIELD_REMOVED' | 'FIELD_ADDED' | 'TYPE_CHANGED' | 'REQUIRED_CHANGED'
export type RiskLevel = 'HIGH' | 'MEDIUM' | 'LOW'
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export interface User {
  id: string
  email: string
  name: string
  role: 'ADMIN' | 'PRODUCER' | 'CONSUMER'
  team: string
}

export interface Provider {
  id: string
  name: string
  owner: string
}

export interface Consumer {
  id: string
  name: string
  team: string
  slackChannel: string
  subscribed: boolean
}

export interface Endpoint {
  id: string
  method: HttpMethod
  path: string
  description: string
}

export interface ContractVersion {
  id: string
  contractId: string
  versionNumber: number
  sourceType: SourceType
  publishedAt: string
  schemaSnapshot: Record<string, unknown>
}

export interface DiffRecord {
  id: string
  validationRunId: string
  changeType: DiffChangeType
  fieldPath: string
  oldType?: string
  newType?: string
  required?: boolean
  riskLevel: RiskLevel
  breaking: boolean
  summary: string
}

export interface ValidationRun {
  id: string
  contractId: string
  triggeredAt: string
  triggerType: 'MANUAL' | 'SCHEDULED'
  endpointStatus: EndpointStatus
  validationResult: ValidationResult
  responseTimeMs: number
  diffRecords: DiffRecord[]
}

export interface NotificationLog {
  id: string
  contractId: string
  channel: 'SLACK'
  status: 'SENT' | 'FAILED' | 'PENDING'
  target: string
  createdAt: string
}

export interface Contract {
  id: string
  name: string
  description: string
  owner: Provider
  endpointUrl?: string
  specFormat: 'OPENAPI_3' | 'JSON_SCHEMA'
  status: ContractStatus
  currentVersion: number
  consumers: Consumer[]
  endpoints: Endpoint[]
  versions: ContractVersion[]
  validationRuns: ValidationRun[]
  notifications: NotificationLog[]
  slackWebhookMasked?: string
  lastValidatedAt?: string
  latencyMs: number
}

export interface ActivityEvent {
  id: string
  type: 'validation' | 'notification' | 'contract' | 'diff'
  title: string
  description: string
  createdAt: string
  severity: 'info' | 'success' | 'warning' | 'danger'
}

export interface NewContractInput {
  name: string
  endpointUrl?: string
  sourceType: SourceType
  ownerId: string
  consumers: string[]
  schema: Record<string, unknown>
}
