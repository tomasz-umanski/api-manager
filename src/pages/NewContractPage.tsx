import { FormEvent, ReactNode, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, FileJson, Link2, Loader2, PenLine, Upload } from 'lucide-react'
import clsx from 'clsx'
import { Page } from '../components/layout/AppShell'
import { Button, Card, CodePane, SelectInput, SectionHeader, TextArea, TextInput } from '../components/ui'
import { useAppStore } from '../store/AppStore'
import type { SourceType } from '../types/domain'

const steps = ['Source', 'Schema', 'Consumers', 'Confirm'] as const

const sampleSchema = {
  openapi: '3.0.3',
  info: { title: 'New Contract', version: '1.0.0' },
  paths: {
    '/v1/resource/{id}': {
      get: {
        responses: {
          '200': {
            description: 'Successful response',
            content: { 'application/json': { schema: { type: 'object', required: ['id'], properties: { id: { type: 'string' } } } } },
          },
        },
      },
    },
  },
}

export function NewContractPage() {
  const { providers, consumers, addContract } = useAppStore()
  const [step, setStep] = useState(0)
  const [sourceType, setSourceType] = useState<SourceType>('URL')
  const [name, setName] = useState('Customer Profiles API')
  const [endpointUrl, setEndpointUrl] = useState('https://api.internal.example.com/v1/customers/{id}')
  const [ownerId, setOwnerId] = useState(providers[0]?.id ?? '')
  const [selectedConsumers, setSelectedConsumers] = useState<string[]>([consumers[0]?.id, consumers[1]?.id].filter(Boolean))
  const [manualSchema, setManualSchema] = useState(JSON.stringify(sampleSchema, null, 2))
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const navigate = useNavigate()

  const parsedSchema = useMemo(() => {
    try {
      return JSON.parse(manualSchema) as Record<string, unknown>
    } catch {
      return null
    }
  }, [manualSchema])

  function next() {
    if (step === 0 && (!name || !ownerId || (sourceType === 'URL' && !endpointUrl))) {
      setError('Name, provider, and source details are required before schema preview.')
      return
    }
    if (step === 1 && !parsedSchema) {
      setError('Schema preview requires valid JSON in this mock MVP.')
      return
    }
    setError('')
    setStep((current) => Math.min(current + 1, steps.length - 1))
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!parsedSchema) {
      setError('Schema must be valid JSON.')
      return
    }
    setIsSaving(true)
    const contract = await addContract({
      name,
      endpointUrl,
      ownerId,
      sourceType,
      consumers: selectedConsumers,
      schema: parsedSchema,
    })
    navigate(`/contracts/${contract.id}`)
  }

  return (
    <Page>
      <Card>
        <SectionHeader eyebrow="Registration" title="New Contract Wizard" />
        <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {steps.map((item, index) => (
            <button
              key={item}
              className={clsx(
                'rounded-tool border px-3 py-3 text-left transition',
                index === step ? 'border-white bg-white text-zinc-950' : index < step ? 'border-success/40 bg-success/10 text-success' : 'border-line bg-[#101114] text-muted',
              )}
              onClick={() => setStep(index)}
              type="button"
            >
              <span className="text-xs font-bold uppercase tracking-[0.12em]">Step {index + 1}</span>
              <p className="mt-1 font-semibold">{item}</p>
            </button>
          ))}
        </div>

        <form onSubmit={(event) => void onSubmit(event)} className="space-y-5">
          {step === 0 ? (
            <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
              <div className="space-y-3">
                <SourceOption active={sourceType === 'URL'} icon={<Link2 />} title="Endpoint URL" description="Fetch a sample response and infer schema." onClick={() => setSourceType('URL')} />
                <SourceOption active={sourceType === 'FILE_UPLOAD'} icon={<Upload />} title="OpenAPI upload" description="Drag and drop JSON/YAML spec up to 5 MB." onClick={() => setSourceType('FILE_UPLOAD')} />
                <SourceOption active={sourceType === 'MANUAL'} icon={<PenLine />} title="Manual schema" description="Paste or edit schema directly in the UI." onClick={() => setSourceType('MANUAL')} />
              </div>
              <div className="space-y-4">
                <Field label="Contract name">
                  <TextInput value={name} onChange={(event) => setName(event.target.value)} />
                </Field>
                <Field label="Provider">
                  <SelectInput value={ownerId} onChange={(event) => setOwnerId(event.target.value)}>
                    {providers.map((provider) => (
                      <option key={provider.id} value={provider.id}>
                        {provider.owner} - {provider.name}
                      </option>
                    ))}
                  </SelectInput>
                </Field>
                {sourceType === 'URL' ? (
                  <Field label="Endpoint URL">
                    <TextInput value={endpointUrl} onChange={(event) => setEndpointUrl(event.target.value)} />
                  </Field>
                ) : sourceType === 'FILE_UPLOAD' ? (
                  <div className="grid min-h-44 place-items-center rounded-tool border border-dashed border-line bg-[#151515] text-center">
                    <div>
                      <FileJson className="mx-auto text-muted" />
                      <p className="mt-3 font-semibold text-white">Drop OpenAPI JSON/YAML here</p>
                      <p className="mt-1 text-sm text-muted">Prototype mode uses the sample schema preview.</p>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}

          {step === 1 ? (
            <div className="grid gap-5 lg:grid-cols-2">
              <Field label="Editable schema">
                <TextArea className="h-[360px] lg:h-[520px]" value={manualSchema} onChange={(event) => setManualSchema(event.target.value)} />
              </Field>
              <div>
                <p className="label-caps mb-2">Detected Preview</p>
                <CodePane value={parsedSchema ?? 'Invalid JSON'} className="h-[360px] lg:h-[520px]" />
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="grid gap-3 md:grid-cols-2">
              {consumers.map((consumer) => {
                const active = selectedConsumers.includes(consumer.id)
                return (
                  <button
                    key={consumer.id}
                    type="button"
                    onClick={() => setSelectedConsumers((current) => (active ? current.filter((id) => id !== consumer.id) : [...current, consumer.id]))}
                    className={clsx('rounded-tool border p-4 text-left transition', active ? 'border-success/50 bg-success/10' : 'border-line bg-[#151515] hover:bg-panelMuted')}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-white">{consumer.name}</p>
                        <p className="mt-1 text-sm text-muted">{consumer.team}</p>
                      </div>
                      {active ? <Check className="text-success" size={18} /> : null}
                    </div>
                    <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.12em] text-subtle">{consumer.slackChannel}</p>
                  </button>
                )
              })}
            </div>
          ) : null}

          {step === 3 ? (
            <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
              <div className="space-y-3 rounded-tool border border-line bg-[#151515] p-4">
                <Summary label="Name" value={name} />
                <Summary label="Source" value={sourceType} />
                <Summary label="Provider" value={providers.find((provider) => provider.id === ownerId)?.owner ?? 'Unknown'} />
                <Summary label="Consumers" value={`${selectedConsumers.length} selected`} />
              </div>
              <CodePane value={parsedSchema ?? {}} className="h-[320px] lg:h-[420px]" />
            </div>
          ) : null}

          {error ? <p className="rounded-tool border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">{error}</p> : null}

          <div className="flex flex-col-reverse gap-3 border-t border-line pt-5 sm:flex-row sm:justify-between">
            <Button type="button" variant="secondary" disabled={step === 0} onClick={() => setStep((current) => Math.max(current - 1, 0))}>
              Back
            </Button>
            {step < steps.length - 1 ? (
              <Button type="button" onClick={next}>
                Continue
              </Button>
            ) : (
              <Button disabled={isSaving || !parsedSchema}>
                {isSaving ? <Loader2 className="animate-spin" size={15} /> : <Check size={15} />}
                Create contract
              </Button>
            )}
          </div>
        </form>
      </Card>
    </Page>
  )
}

function SourceOption({ active, icon, title, description, onClick }: { active: boolean; icon: ReactNode; title: string; description: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className={clsx('w-full rounded-tool border p-4 text-left transition', active ? 'border-white bg-white text-zinc-950' : 'border-line bg-[#151515] text-muted hover:bg-panelMuted')}>
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <p className="font-semibold">{title}</p>
          <p className={clsx('mt-1 text-sm', active ? 'text-zinc-600' : 'text-muted')}>{description}</p>
        </div>
      </div>
    </button>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="label-caps mb-2 block">{label}</span>
      {children}
    </label>
  )
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="label-caps">{label}</p>
      <p className="mt-1 font-semibold text-white">{value}</p>
    </div>
  )
}
