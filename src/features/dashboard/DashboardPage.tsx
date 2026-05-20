import { Link, useNavigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { CheckCircle2, Clock3, FileDiff, Loader2, Play, ShieldAlert } from 'lucide-react'
import { Page } from '../../components/layout/AppShell'
import { Button, Card, MethodChip, StatusBadge } from '../../components/ui'
import { useAppStore } from '../../store/AppStore'
import { formatDateTime, timeAgo } from '../../lib/format'

export function DashboardPage() {
  const { contracts, activity, validateContract, loadingContractIds } = useAppStore()
  const navigate = useNavigate()
  const violated = contracts.filter((contract) => contract.status === 'VIOLATED')
  const compliant = contracts.filter((contract) => contract.status === 'COMPLIANT')
  const unknown = contracts.filter((contract) => contract.status === 'UNKNOWN')

  async function onValidate(contractId: string) {
    const run = await validateContract(contractId)
    if (run?.validationResult === 'VIOLATED') {
      navigate(`/diff/${contractId}/${run.id}`)
    }
  }

  return (
    <Page>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-[-0.05em] text-white sm:text-3xl">Dashboard</h1>
          <p className="mt-1 text-sm text-muted">Monitor contract status, breaking changes, and validation activity.</p>
        </div>
        <Link to="/contracts/new">
          <Button className="w-full sm:w-auto">+ Add Contract</Button>
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="All Contracts" value={contracts.length} icon={<FileDiff />} />
        <MetricCard title="Violated" value={violated.length} icon={<ShieldAlert className="text-danger" />} danger />
        <MetricCard title="Compliant" value={compliant.length} icon={<CheckCircle2 className="text-success" />} />
        <MetricCard title="Unverified" value={unknown.length} icon={<Clock3 className="text-muted" />} />
      </div>

      <Card className="p-0">
        <h2 className="section-strip">Recent Violations</h2>
        <div className="table-wrap">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-[#111] text-xs uppercase tracking-[0.12em] text-muted">
              <tr>
                <th className="px-4 py-3">Contract</th>
                <th className="px-4 py-3">Provider</th>
                <th className="px-4 py-3">Detected</th>
                <th className="px-4 py-3">Change Type</th>
                <th className="px-4 py-3">Risk</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {violated.map((contract) => (
                <tr key={contract.id} className="data-row">
                  <td className="px-4 py-3 font-mono text-xs font-bold text-zinc-200">{contract.name}</td>
                  <td className="px-4 py-3 text-muted">{contract.owner.owner}</td>
                  <td className="px-4 py-3 text-muted">{timeAgo(contract.lastValidatedAt ?? new Date().toISOString())}</td>
                  <td className="px-4 py-3 font-mono text-[11px] uppercase text-muted">{contract.validationRuns[0]?.diffRecords[0]?.changeType ?? 'TYPE_CHANGED'}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-sm bg-danger/10 px-2 py-1 text-[10px] font-bold text-danger">HIGH</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link to={`/diff/${contract.id}/${contract.validationRuns[0]?.id}`}>
                      <Button variant="secondary">View Diff</Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="p-0">
        <h2 className="section-strip">Your Contracts</h2>
        <div className="table-wrap">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#111] text-xs uppercase tracking-[0.12em] text-muted">
                <tr>
                  <th className="px-4 py-3">Contract</th>
                  <th className="hidden px-4 py-3 lg:table-cell">Endpoint</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="hidden px-4 py-3 md:table-cell">Last Validated</th>
                  <th className="hidden px-4 py-3 sm:table-cell">Consumers</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {contracts.map((contract) => {
                  const isLoading = loadingContractIds.includes(contract.id)
                  return (
                    <tr key={contract.id} className="data-row">
                      <td className="px-4 py-3">
                        <Link
                          to={contract.status === 'VIOLATED' ? `/diff/${contract.id}/${contract.validationRuns[0]?.id}` : `/contracts/${contract.id}`}
                          className="font-semibold text-white hover:underline"
                        >
                          {contract.name}
                        </Link>
                        <p className="text-xs text-muted">v{contract.currentVersion}</p>
                      </td>
                      <td className="hidden px-4 py-3 lg:table-cell">
                        <div className="flex items-center gap-2">
                          <MethodChip method={contract.endpoints[0]?.method ?? 'GET'} />
                          <span className="font-mono text-xs text-zinc-300">{contract.endpoints[0]?.path}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={contract.status} />
                      </td>
                      <td className="hidden px-4 py-3 font-mono text-xs text-muted md:table-cell">{formatDateTime(contract.lastValidatedAt)}</td>
                      <td className="hidden px-4 py-3 text-muted sm:table-cell">{contract.consumers.length}</td>
                      <td className="px-4 py-3 text-right">
                        <Button className="min-w-24" disabled={isLoading} onClick={() => void onValidate(contract.id)}>
                          {isLoading ? <Loader2 className="animate-spin" size={15} /> : <Play size={15} />}
                          Validate
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
        </div>
      </Card>

      <Card className="p-0">
        <div className="p-4">
          <p className="label-caps mb-3">Live Activity Log</p>
          <div className="space-y-2">
            {activity.slice(0, 4).map((event) => (
              <div key={event.id} className="flex items-center gap-3 text-xs text-muted">
                <span className="h-1.5 w-1.5 rounded-full bg-info data-[severity=danger]:bg-danger data-[severity=success]:bg-success data-[severity=warning]:bg-warning" data-severity={event.severity} />
                <span className="font-mono">{formatDateTime(event.createdAt)}</span>
                <span>{event.description}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </Page>
  )
}

function MetricCard({ title, value, icon, danger = false }: { title: string; value: number; icon: ReactNode; danger?: boolean }) {
  return (
    <Card className={danger ? 'border-danger/50 bg-danger/5' : undefined}>
      <div className="flex items-center justify-between">
        <div>
          <p className="label-caps">{title}</p>
          <p className={danger ? 'mt-4 text-3xl font-bold tracking-[-0.05em] text-danger' : 'mt-4 text-3xl font-bold tracking-[-0.05em]'}>{value}</p>
        </div>
        <div className="hidden h-11 w-11 place-items-center rounded-tool text-muted sm:grid">{icon}</div>
      </div>
    </Card>
  )
}
