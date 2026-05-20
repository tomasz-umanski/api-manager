import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowLeft, Copy, Minus, Plus, TriangleAlert, Waves } from 'lucide-react'
import clsx from 'clsx'
import { Page } from '../../components/layout/AppShell'
import { Button, Card, CodePane, RiskBadge, SectionHeader } from '../../components/ui'
import { useAppStore } from '../../store/AppStore'
import { formatDateTime } from '../../lib/format'
import type { DiffRecord } from '../../types/domain'

export function DiffViewerPage() {
  const { contractId, runId } = useParams()
  const { contracts } = useAppStore()
  const contract = contracts.find((item) => item.id === contractId)
  const run = contract?.validationRuns.find((item) => item.id === runId) ?? contract?.validationRuns.find((item) => item.validationResult === 'VIOLATED')

  if (!contract || !run) return <Navigate to="/contracts" replace />

  const breaking = run.diffRecords.filter((diff) => diff.breaking)
  const nonBreaking = run.diffRecords.filter((diff) => !diff.breaking)

  const beforeSchema = contract.versions[0]?.schemaSnapshot ?? {}
  const afterSchema = {
    ...beforeSchema,
    detectedResponse: {
      amount: 125.5,
      currency: 'EUR',
      status: 'paid',
      display_name: 'May invoice',
    },
  }

  return (
    <Page>
      <div className="flex flex-col gap-4 border-b border-line pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link to={`/contracts/${contract.id}`} className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-white">
            <ArrowLeft size={15} />
            Back to contract
          </Link>
          <p className="text-sm text-muted">Contracts &gt; {contract.name} &gt; <span className="font-semibold text-white">Detected changes</span></p>
          <h2 className="mt-3 text-2xl font-bold tracking-[-0.04em]">Detected changes <span className="ml-2 rounded-sm border border-danger/60 bg-danger/10 px-2 py-1 align-middle text-xs uppercase tracking-[0.08em] text-danger">Breaking</span></h2>
          <p className="mt-2 text-sm text-muted">Run {formatDateTime(run.triggeredAt)} · {run.responseTimeMs} ms response time</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary">
            <Copy size={15} />
            Copy JSON
          </Button>
          <Button variant="danger">
            <TriangleAlert size={15} />
            {breaking.length} breaking
          </Button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <DiffMetric label="Removed Fields" value={breaking.filter((diff) => diff.changeType === 'FIELD_REMOVED').length || 3} danger />
        <DiffMetric label="Added Fields" value={nonBreaking.length || 5} />
        <DiffMetric label="Changed Types" value={breaking.filter((diff) => diff.changeType === 'TYPE_CHANGED').length || 2} />
        <DiffMetric label="Risk Level" valueText="Critical" danger />
      </div>

      <Card className="p-0">
        <div className="flex flex-col gap-3 border-b border-line bg-[#2d2d2d] p-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="label-caps">View Filters</p>
          <div className="flex flex-wrap gap-2 text-sm">
            <span className="border border-line bg-[#181818] px-3 py-1"><span className="text-danger">●</span> Breaking</span>
            <span className="border border-line bg-[#181818] px-3 py-1"><span className="text-warning">●</span> Non-breaking</span>
            <span className="border border-line bg-[#181818] px-3 py-1"><span className="text-success">●</span> Compliant</span>
          </div>
        </div>
        <div className="p-4">
        <SectionHeader eyebrow="Change Set" title="Classified Schema Differences" />
        <div className="space-y-3">
          {run.diffRecords.map((diff) => (
            <DiffRow key={diff.id} diff={diff} />
          ))}
        </div>
        </div>
      </Card>

      <div className="grid gap-5 xl:grid-cols-2">
        <Card>
          <SectionHeader eyebrow="Before" title={`Stored schema v${contract.currentVersion}`} />
          <CodePane value={beforeSchema} className="h-[360px] xl:h-[560px]" />
        </Card>
        <Card>
          <SectionHeader eyebrow="After" title="Detected endpoint response" />
          <CodePane value={afterSchema} className="h-[360px] xl:h-[560px]" />
        </Card>
      </div>

      <Card>
        <SectionHeader eyebrow="Blast Radius" title="Affected Consumers" />
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {contract.consumers.map((consumer) => (
            <div key={consumer.id} className="rounded-tool border border-line bg-[#151515] p-3">
              <p className="font-semibold text-white">{consumer.name}</p>
              <p className="mt-1 text-sm text-muted">{consumer.team}</p>
              <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.12em] text-subtle">{consumer.slackChannel}</p>
            </div>
          ))}
        </div>
      </Card>
    </Page>
  )
}

function DiffRow({ diff }: { diff: DiffRecord }) {
  const icon = diff.changeType === 'FIELD_ADDED' ? <Plus size={16} /> : diff.changeType === 'FIELD_REMOVED' ? <Minus size={16} /> : <Waves size={16} />
  return (
    <div className={clsx('rounded-tool border p-4', diff.breaking ? 'border-danger/30 bg-danger/5' : 'border-success/25 bg-success/5')}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-3">
          <div className={clsx('grid h-9 w-9 place-items-center rounded-tool', diff.breaking ? 'bg-danger/15 text-danger' : 'bg-success/15 text-success')}>{icon}</div>
          <div>
            <div className="flex items-center gap-2">
              <span className={clsx('text-xs font-extrabold', diff.breaking ? 'text-danger' : 'text-success')}>{diff.breaking ? 'BREAKING' : 'NON-BREAKING'}</span>
              <RiskBadge risk={diff.riskLevel} />
            </div>
            <p className="mt-1 font-semibold text-white">{diff.summary}</p>
            <p className="mt-1 font-mono text-xs text-muted">{diff.fieldPath}</p>
          </div>
        </div>
        <div className="rounded-tool border border-line bg-[#08090b] px-3 py-2 font-mono text-xs text-zinc-300">
          {diff.oldType ?? 'missing'} -&gt; {diff.newType ?? 'missing'}
        </div>
      </div>
    </div>
  )
}

function DiffMetric({ label, value, valueText, danger = false }: { label: string; value?: number; valueText?: string; danger?: boolean }) {
  return (
    <Card className={danger ? 'border-danger/50 bg-danger/5' : undefined}>
      <p className="label-caps">{label}</p>
      <p className={danger ? 'mt-3 text-3xl font-bold tracking-[-0.05em] text-danger' : 'mt-3 text-3xl font-bold tracking-[-0.05em]'}>{valueText ?? value}</p>
    </Card>
  )
}
