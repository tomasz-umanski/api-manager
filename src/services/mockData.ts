import type { ActivityEvent, Consumer, Contract, DiffRecord, Provider, User } from '../types/domain'

export const mockUser: User = {
  id: 'usr_001',
  email: 'admin@apicontrol.local',
  name: 'Tomek Nowak',
  role: 'ADMIN',
  team: 'Platform Engineering',
}

export const providers: Provider[] = [
  { id: 'prov_billing', name: 'Billing API', owner: 'Payments Platform' },
  { id: 'prov_identity', name: 'Identity API', owner: 'Core Services' },
  { id: 'prov_orders', name: 'Orders API', owner: 'Commerce' },
]

export const consumers: Consumer[] = [
  { id: 'con_mobile', name: 'Mobile App', team: 'Consumer Apps', slackChannel: '#mobile-alerts', subscribed: true },
  { id: 'con_checkout', name: 'Checkout Web', team: 'Commerce UI', slackChannel: '#checkout', subscribed: true },
  { id: 'con_qa', name: 'QA Automation', team: 'Quality', slackChannel: '#qa-contracts', subscribed: true },
  { id: 'con_analytics', name: 'Analytics Pipeline', team: 'Data', slackChannel: '#data-platform', subscribed: false },
]

const billingSchema = {
  openapi: '3.0.3',
  info: { title: 'Billing API', version: '3.4.1' },
  paths: {
    '/v1/invoices/{invoiceId}': {
      get: {
        response: {
          invoice_id: 'string',
          amount: 'string',
          currency: 'string',
          status: 'string',
          issued_at: 'string',
        },
      },
    },
  },
}

const billingDiffs: DiffRecord[] = [
  {
    id: 'diff_001',
    validationRunId: 'run_billing_002',
    changeType: 'FIELD_REMOVED',
    fieldPath: '$.response.invoice_id',
    oldType: 'string',
    riskLevel: 'HIGH',
    breaking: true,
    summary: 'BREAKING - Removed field: invoice_id',
  },
  {
    id: 'diff_002',
    validationRunId: 'run_billing_002',
    changeType: 'TYPE_CHANGED',
    fieldPath: '$.response.amount',
    oldType: 'string',
    newType: 'number',
    riskLevel: 'HIGH',
    breaking: true,
    summary: 'BREAKING - Type changed: amount string -> number',
  },
  {
    id: 'diff_003',
    validationRunId: 'run_billing_002',
    changeType: 'FIELD_ADDED',
    fieldPath: '$.response.display_name',
    newType: 'string',
    required: false,
    riskLevel: 'LOW',
    breaking: false,
    summary: 'NON-BREAKING - Added optional field: display_name',
  },
]

export const initialContracts: Contract[] = [
  {
    id: 'ctr_billing',
    name: 'Billing API',
    description: 'Invoice and subscription endpoints consumed by checkout and mobile clients.',
    owner: providers[0],
    endpointUrl: 'https://api.internal.example.com/v1/invoices/{invoiceId}',
    specFormat: 'OPENAPI_3',
    status: 'VIOLATED',
    currentVersion: 3,
    consumers: [consumers[0], consumers[1], consumers[2]],
    endpoints: [
      { id: 'ep_billing_get', method: 'GET', path: '/v1/invoices/{invoiceId}', description: 'Read invoice details' },
      { id: 'ep_billing_post', method: 'POST', path: '/v1/invoices', description: 'Create invoice' },
    ],
    versions: [
      {
        id: 'ver_billing_3',
        contractId: 'ctr_billing',
        versionNumber: 3,
        sourceType: 'URL',
        publishedAt: '2026-05-19T10:30:00Z',
        schemaSnapshot: billingSchema,
      },
    ],
    validationRuns: [
      {
        id: 'run_billing_002',
        contractId: 'ctr_billing',
        triggeredAt: '2026-05-20T18:42:00Z',
        triggerType: 'MANUAL',
        endpointStatus: 'OK',
        validationResult: 'VIOLATED',
        responseTimeMs: 184,
        diffRecords: billingDiffs,
      },
      {
        id: 'run_billing_001',
        contractId: 'ctr_billing',
        triggeredAt: '2026-05-20T09:15:00Z',
        triggerType: 'MANUAL',
        endpointStatus: 'OK',
        validationResult: 'COMPLIANT',
        responseTimeMs: 171,
        diffRecords: [],
      },
    ],
    notifications: [
      { id: 'not_001', contractId: 'ctr_billing', channel: 'SLACK', status: 'SENT', target: '#checkout', createdAt: '2026-05-20T18:42:30Z' },
    ],
    slackWebhookMasked: 'https://hooks.slack.com/services/***/***/billing',
    lastValidatedAt: '2026-05-20T18:42:00Z',
    latencyMs: 184,
  },
  {
    id: 'ctr_identity',
    name: 'Identity API',
    description: 'User profile and token introspection contract.',
    owner: providers[1],
    endpointUrl: 'https://identity.internal.example.com/v2/users/{userId}',
    specFormat: 'OPENAPI_3',
    status: 'COMPLIANT',
    currentVersion: 7,
    consumers: [consumers[0], consumers[2], consumers[3]],
    endpoints: [
      { id: 'ep_identity_get', method: 'GET', path: '/v2/users/{userId}', description: 'Read user profile' },
      { id: 'ep_identity_put', method: 'PUT', path: '/v2/users/{userId}', description: 'Update profile' },
    ],
    versions: [
      {
        id: 'ver_identity_7',
        contractId: 'ctr_identity',
        versionNumber: 7,
        sourceType: 'FILE_UPLOAD',
        publishedAt: '2026-05-17T13:10:00Z',
        schemaSnapshot: {
          openapi: '3.0.3',
          info: { title: 'Identity API', version: '2.8.0' },
          paths: { '/v2/users/{userId}': { get: { response: { id: 'string', email: 'string', roles: 'array' } } } },
        },
      },
    ],
    validationRuns: [
      {
        id: 'run_identity_001',
        contractId: 'ctr_identity',
        triggeredAt: '2026-05-20T17:28:00Z',
        triggerType: 'MANUAL',
        endpointStatus: 'OK',
        validationResult: 'COMPLIANT',
        responseTimeMs: 92,
        diffRecords: [],
      },
    ],
    notifications: [],
    slackWebhookMasked: 'https://hooks.slack.com/services/***/***/identity',
    lastValidatedAt: '2026-05-20T17:28:00Z',
    latencyMs: 92,
  },
  {
    id: 'ctr_orders',
    name: 'Orders API',
    description: 'Order lifecycle events and detail payloads.',
    owner: providers[2],
    endpointUrl: 'https://orders.internal.example.com/v1/orders/{orderId}',
    specFormat: 'JSON_SCHEMA',
    status: 'UNKNOWN',
    currentVersion: 1,
    consumers: [consumers[1]],
    endpoints: [{ id: 'ep_orders_get', method: 'GET', path: '/v1/orders/{orderId}', description: 'Read order details' }],
    versions: [
      {
        id: 'ver_orders_1',
        contractId: 'ctr_orders',
        versionNumber: 1,
        sourceType: 'MANUAL',
        publishedAt: '2026-05-18T08:00:00Z',
        schemaSnapshot: {
          type: 'object',
          required: ['order_id', 'total'],
          properties: { order_id: { type: 'string' }, total: { type: 'number' }, status: { type: 'string' } },
        },
      },
    ],
    validationRuns: [],
    notifications: [],
    lastValidatedAt: undefined,
    latencyMs: 0,
  },
]

export const activityEvents: ActivityEvent[] = [
  {
    id: 'act_001',
    type: 'diff',
    title: 'Breaking change detected',
    description: 'Billing API removed invoice_id and changed amount type.',
    createdAt: '2026-05-20T18:42:00Z',
    severity: 'danger',
  },
  {
    id: 'act_002',
    type: 'notification',
    title: 'Slack notification delivered',
    description: 'Message sent to #checkout and #mobile-alerts.',
    createdAt: '2026-05-20T18:42:30Z',
    severity: 'success',
  },
  {
    id: 'act_003',
    type: 'validation',
    title: 'Identity API validation passed',
    description: 'No schema drift found in v7.',
    createdAt: '2026-05-20T17:28:00Z',
    severity: 'success',
  },
  {
    id: 'act_004',
    type: 'contract',
    title: 'Orders API registered',
    description: 'Manual schema was saved as version 1.',
    createdAt: '2026-05-18T08:00:00Z',
    severity: 'info',
  },
]
