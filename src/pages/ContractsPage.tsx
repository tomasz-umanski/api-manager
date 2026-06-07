import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Filter, Loader2, Play, Search } from 'lucide-react'
import { Page } from '../components/layout/AppShell'
import { Button, Card, MethodChip, SelectInput, StatusBadge, TextInput } from '../components/ui'
import { formatDateTime } from '../lib/format'
import { useAppStore } from '../store/AppStore'
import type { ContractStatus } from '../types/domain'

export function ContractsPage() {
  const { contracts, loadingContractIds, validateContract } = useAppStore()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<ContractStatus | 'ALL'>('ALL')
  const [owner, setOwner] = useState('ALL')
  const navigate = useNavigate()

  const owners = Array.from(new Set(contracts.map((contract) => contract.owner.owner)))
  const filtered = useMemo(
    () =>
      contracts.filter((contract) => {
        const matchesQuery = `${contract.name} ${contract.description} ${contract.endpointUrl}`.toLowerCase().includes(query.toLowerCase())
        const matchesStatus = status === 'ALL' || contract.status === status
        const matchesOwner = owner === 'ALL' || contract.owner.owner === owner
        return matchesQuery && matchesStatus && matchesOwner
      }),
    [contracts, owner, query, status],
  )

  async function onValidate(contractId: string) {
    const run = await validateContract(contractId)
    if (run?.validationResult === 'VIOLATED') navigate(`/diff/${contractId}/${run.id}`)
  }

  async function validateAll() {
    for (const contract of filtered) {
      const run = await validateContract(contract.id)
      if (run?.validationResult === 'VIOLATED') {
        navigate(`/diff/${contract.id}/${run.id}`)
        break
      }
    }
  }

  return (
    <Page>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-[-0.05em] text-white sm:text-3xl">API Contracts</h1>
          <p className="mt-1 text-sm text-muted">Manage and validate interface definitions in the ecosystem.</p>
        </div>
        <Link to="/contracts/new">
          <Button className="w-full sm:w-auto">+ Add Contract</Button>
        </Link>
      </div>

      <Card className="p-0">
        <div className="grid gap-3 border-b border-line p-3 md:grid-cols-[1fr_180px_220px_auto]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
            <TextInput className="pl-10" placeholder="Search by name or endpoint..." value={query} onChange={(event) => setQuery(event.target.value)} />
          </div>
          <SelectInput value={status} onChange={(event) => setStatus(event.target.value as ContractStatus | 'ALL')} aria-label="Filter by status">
            <option value="ALL">Status: All</option>
            <option value="COMPLIANT">Compliant</option>
            <option value="VIOLATED">Violated</option>
            <option value="UNKNOWN">Unknown</option>
          </SelectInput>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
            <SelectInput className="pl-10" value={owner} onChange={(event) => setOwner(event.target.value)} aria-label="Filter by provider">
              <option value="ALL">Provider: Any</option>
              {owners.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </SelectInput>
          </div>
          <Button variant="ghost" onClick={() => { setQuery(''); setStatus('ALL'); setOwner('ALL') }}>
            Reset filters
          </Button>
        </div>

        <div className="flex flex-col gap-3 border-b border-line bg-panel p-3 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="h-4 w-4 border border-line bg-[#151515]" />
            <span>Select All</span>
            <span className="h-5 w-px bg-line" />
            <Button variant="secondary" onClick={() => void validateAll()}>
              <Play size={15} />
              Run Validation
            </Button>
          </div>
          <span>Showing 1-{filtered.length} of {contracts.length}</span>
        </div>

        <div className="table-wrap">
          <table className="w-full min-w-[840px] text-left text-sm">
            <thead className="bg-[#202020] text-xs uppercase tracking-[0.12em] text-muted">
              <tr>
                <th className="px-4 py-3"></th>
                <th className="px-4 py-3">Contract Name</th>
                <th className="px-4 py-3">Owner</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Consumers</th>
                <th className="px-4 py-3">Stability</th>
                <th className="px-4 py-3">Updated</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((contract) => {
                const isLoading = loadingContractIds.includes(contract.id)
                return (
                  <tr key={contract.id} className="data-row">
                    <td className="px-4 py-3"><span className="block h-4 w-4 border border-line bg-[#151515]" /></td>
                    <td className="px-4 py-4">
                      <Link to={`/contracts/${contract.id}`} className="font-semibold text-white hover:underline">
                        {contract.name}
                      </Link>
                    </td>
                    <td className="px-4 py-4 text-muted">
                      <span className="mr-2 inline-grid h-6 w-6 place-items-center rounded-full bg-zinc-600/70 text-[10px] text-white">{contract.owner.owner.slice(0, 2).toUpperCase()}</span>
                      {contract.owner.owner}
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge status={contract.status} />
                    </td>
                    <td className="px-4 py-4 text-muted">{contract.consumers.length}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <span className={contract.status === 'VIOLATED' ? 'font-mono text-xs text-danger' : 'font-mono text-xs text-zinc-300'}>{contract.status === 'VIOLATED' ? '82.4%' : contract.status === 'UNKNOWN' ? '-' : '99.9%'}</span>
                        <MethodChip method={contract.endpoints[0]?.method ?? 'GET'} />
                      </div>
                    </td>
                    <td className="px-4 py-4 font-mono text-xs text-muted">{formatDateTime(contract.lastValidatedAt)}</td>
                    <td className="px-4 py-4 text-right">
                      <Button variant="secondary" disabled={isLoading} onClick={() => void onValidate(contract.id)}>
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
    </Page>
  )
}
