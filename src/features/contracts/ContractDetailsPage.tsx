import { FormEvent, ReactNode, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { Bell, FileDiff, Loader2, Play, Save } from 'lucide-react'
import { Page } from '../../components/layout/AppShell'
import { Button, Card, CodePane, EmptyState, MethodChip, SectionHeader, StatusBadge, TextInput } from '../../components/ui'
import { formatDateTime } from '../../lib/format'
import { useAppStore } from '../../store/AppStore'

export function ContractDetailsPage() {
  const { contractId } = useParams()
  const { contracts, updateSlackWebhook, validateContract, loadingContractIds } = useAppStore()
  const contract = contracts.find((item) => item.id === contractId)
  const [webhook, setWebhook] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const navigate = useNavigate()

  if (!contract) return <Navigate to="/contracts" replace />
  const currentContract = contract

  async function onSaveWebhook(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSaving(true)
    await updateSlackWebhook(currentContract.id, webhook)
    setWebhook('')
    setIsSaving(false)
  }

  async function onValidate() {
    const run = await validateContract(currentContract.id)
    if (run?.validationResult === 'VIOLATED') navigate(`/diff/${currentContract.id}/${run.id}`)
  }

  const latestSchema = contract.versions[0]?.schemaSnapshot ?? {}
  const isLoading = loadingContractIds.includes(contract.id)

  return (
    <Page>
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-5">
          <Card>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="label-caps">Contract Details</p>
                <h2 className="mt-1 text-2xl font-bold tracking-[-0.04em]">{contract.name}</h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">{contract.description}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {contract.validationRuns[0]?.validationResult === 'VIOLATED' ? (
                  <Link to={`/diff/${contract.id}/${contract.validationRuns[0].id}`}>
                    <Button variant="danger">
                      <FileDiff size={15} />
                      Open diff
                    </Button>
                  </Link>
                ) : null}
                <Button variant="secondary" disabled={isLoading} onClick={() => void onValidate()}>
                  {isLoading ? <Loader2 className="animate-spin" size={15} /> : <Play size={15} />}
                  Check status
                </Button>
              </div>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Info label="Status" value={<StatusBadge status={contract.status} />} />
              <Info label="Version" value={`v${contract.currentVersion}`} />
              <Info label="Provider" value={contract.owner.owner} />
              <Info label="Last validation" value={formatDateTime(contract.lastValidatedAt)} />
            </div>
          </Card>

          <Card>
            <SectionHeader eyebrow="Schema" title="Stored Contract Snapshot" />
            <CodePane value={latestSchema} className="max-h-[520px]" />
          </Card>

          <Card>
            <SectionHeader eyebrow="History" title="Validation Runs" />
            {contract.validationRuns.length === 0 ? (
              <EmptyState title="No validation runs yet" description="Run Check status to create the first history entry." />
            ) : (
              <div className="table-wrap rounded-tool border border-line">
                <table className="w-full min-w-[680px] text-left text-sm">
                  <thead className="bg-[#202020] text-xs uppercase tracking-[0.12em] text-muted">
                    <tr>
                      <th className="px-3 py-3">Timestamp</th>
                      <th className="px-3 py-3">Endpoint</th>
                      <th className="px-3 py-3">Result</th>
                      <th className="px-3 py-3">Diffs</th>
                      <th className="px-3 py-3">Response</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contract.validationRuns.map((run) => (
                      <tr key={run.id} className="data-row">
                        <td className="px-3 py-3 font-mono text-xs">{formatDateTime(run.triggeredAt)}</td>
                        <td className="px-3 py-3 text-muted">{run.endpointStatus}</td>
                        <td className="px-3 py-3">{run.validationResult}</td>
                        <td className="px-3 py-3">
                          {run.diffRecords.length > 0 ? (
                            <Link to={`/diff/${contract.id}/${run.id}`} className="font-semibold text-danger hover:underline">
                              {run.diffRecords.length} changes
                            </Link>
                          ) : (
                            <span className="text-muted">No changes</span>
                          )}
                        </td>
                        <td className="px-3 py-3 font-mono text-xs">{run.responseTimeMs} ms</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>

        <aside className="grid gap-5 md:grid-cols-2 xl:block xl:space-y-5">
          <Card>
            <SectionHeader eyebrow="Endpoints" title="Operations" />
            <div className="space-y-2">
              {contract.endpoints.map((endpoint) => (
                <div key={endpoint.id} className="rounded-tool border border-line bg-[#151515] p-3">
                  <div className="flex items-center gap-2">
                    <MethodChip method={endpoint.method} />
                    <span className="font-mono text-xs text-zinc-200">{endpoint.path}</span>
                  </div>
                  <p className="mt-2 text-xs text-muted">{endpoint.description}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <SectionHeader eyebrow="Consumers" title="Subscribers" />
            <div className="space-y-2">
              {contract.consumers.map((consumer) => (
                <div key={consumer.id} className="flex items-center justify-between gap-3 rounded-tool border border-line bg-[#151515] p-3">
                  <div>
                    <p className="text-sm font-semibold text-white">{consumer.name}</p>
                    <p className="text-xs text-muted">{consumer.team}</p>
                  </div>
                  <span className="font-mono text-[10px] text-muted">{consumer.slackChannel}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <SectionHeader eyebrow="Notifications" title="Slack Webhook" />
            <form onSubmit={(event) => void onSaveWebhook(event)} className="space-y-3">
              <div className="rounded-tool border border-line bg-[#151515] p-3 text-xs text-muted">
                <Bell className="mb-2 text-info" size={16} />
                Current: <span className="font-mono text-zinc-300">{contract.slackWebhookMasked ?? 'Not configured'}</span>
              </div>
              <TextInput value={webhook} onChange={(event) => setWebhook(event.target.value)} placeholder="https://hooks.slack.com/services/..." />
              <Button className="w-full" disabled={!webhook || isSaving}>
                {isSaving ? <Loader2 className="animate-spin" size={15} /> : <Save size={15} />}
                Save masked webhook
              </Button>
            </form>
          </Card>
        </aside>
      </div>
    </Page>
  )
}

function Info({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-tool border border-line bg-[#151515] p-3">
      <p className="label-caps">{label}</p>
      <div className="mt-2 text-sm font-semibold text-white">{value}</div>
    </div>
  )
}
