import { FormEvent, useState } from 'react'
import { Bell, Check, Database, KeyRound, Loader2, Save, Shield, SlidersHorizontal, UserRound } from 'lucide-react'
import { Page } from '../../components/layout/AppShell'
import { Button, Card, SelectInput, TextInput } from '../../components/ui'
import { useAppStore } from '../../store/AppStore'

export function SettingsPage() {
  const { user, contracts } = useAppStore()
  const [workspaceName, setWorkspaceName] = useState('Platform API Governance')
  const [defaultTimeout, setDefaultTimeout] = useState('10')
  const [environment, setEnvironment] = useState('staging')
  const [slackChannel, setSlackChannel] = useState('#api-contracts')
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSaving(true)
    await new Promise((resolve) => window.setTimeout(resolve, 350))
    setIsSaving(false)
    setSaved(true)
    window.setTimeout(() => setSaved(false), 2000)
  }

  return (
    <Page>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-[-0.05em] text-white sm:text-3xl">Settings</h1>
          <p className="mt-1 text-sm text-muted">Configure workspace defaults, validation behavior, notifications, and access controls.</p>
        </div>
        {saved ? (
          <div className="inline-flex items-center gap-2 rounded-tool border border-success/30 bg-success/10 px-3 py-2 text-sm font-bold text-success">
            <Check size={15} />
            Saved
          </div>
        ) : null}
      </div>

      <form onSubmit={(event) => void onSubmit(event)} className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-5">
          <Card className="p-0">
            <h2 className="section-strip">Workspace</h2>
            <div className="grid gap-4 p-4 md:grid-cols-2">
              <SettingsField label="Workspace Name" description="Shown in headers, exports, and audit logs.">
                <TextInput value={workspaceName} onChange={(event) => setWorkspaceName(event.target.value)} />
              </SettingsField>
              <SettingsField label="Environment" description="Controls default HTTP policy and copy shown in the UI.">
                <SelectInput value={environment} onChange={(event) => setEnvironment(event.target.value)}>
                  <option value="development">Development</option>
                  <option value="staging">Staging</option>
                  <option value="production">Production</option>
                </SelectInput>
              </SettingsField>
            </div>
          </Card>

          <Card className="p-0">
            <h2 className="section-strip">Validation Defaults</h2>
            <div className="divide-y divide-line">
              <PreferenceRow
                icon={<SlidersHorizontal size={18} />}
                title="Manual validation mode"
                description="Keep validation user-triggered for the MVP. Automatic scheduler remains disabled."
                control={<Toggle checked />}
              />
              <PreferenceRow
                icon={<Shield size={18} />}
                title="Allow HTTP in non-production"
                description="Permit HTTP endpoints only outside production environments."
                control={<Toggle checked={environment !== 'production'} />}
              />
              <PreferenceRow
                icon={<Database size={18} />}
                title="Endpoint timeout"
                description="Maximum time to wait for monitored endpoints before marking them unreachable."
                control={
                  <div className="flex items-center gap-2">
                    <TextInput className="w-20 text-center font-mono" value={defaultTimeout} onChange={(event) => setDefaultTimeout(event.target.value)} />
                    <span className="text-sm text-muted">seconds</span>
                  </div>
                }
              />
            </div>
          </Card>

          <Card className="p-0">
            <h2 className="section-strip">Notifications</h2>
            <div className="grid gap-4 p-4 md:grid-cols-2">
              <SettingsField label="Default Slack Channel" description="Used as a fallback when a contract has no channel configured.">
                <TextInput value={slackChannel} onChange={(event) => setSlackChannel(event.target.value)} />
              </SettingsField>
              <SettingsField label="Breaking Change Policy" description="Controls notification priority for high-risk diffs.">
                <SelectInput defaultValue="immediate">
                  <option value="immediate">Immediate alert</option>
                  <option value="digest">Daily digest</option>
                  <option value="silent">Do not notify</option>
                </SelectInput>
              </SettingsField>
            </div>
          </Card>
        </div>

        <aside className="space-y-5">
          <Card>
            <div className="mb-4 flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-tool border border-line bg-[#151515] text-white">
                <UserRound size={18} />
              </div>
              <div>
                <p className="font-bold text-white">{user?.name}</p>
                <p className="text-xs text-muted">{user?.email}</p>
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <Meta label="Role" value={user?.role ?? 'ADMIN'} />
              <Meta label="Team" value={user?.team ?? 'Platform'} />
              <Meta label="Contracts Managed" value={`${contracts.length}`} />
            </div>
          </Card>

          <Card>
            <div className="mb-4 flex items-center gap-3">
              <Bell className="text-info" size={18} />
              <h2 className="font-bold text-white">Notification Status</h2>
            </div>
            <div className="space-y-3 text-sm">
              <Meta label="Slack" value="Configured" tone="success" />
              <Meta label="Email" value="Disabled for MVP" />
              <Meta label="Webhook Retry" value="Mocked" />
            </div>
          </Card>

          <Card>
            <div className="mb-4 flex items-center gap-3">
              <KeyRound className="text-warning" size={18} />
              <h2 className="font-bold text-white">Security</h2>
            </div>
            <div className="space-y-3 text-sm">
              <Meta label="Auth Mode" value="Mock session" />
              <Meta label="Webhook Display" value="Masked" tone="success" />
              <Meta label="Audit Logs" value="Planned" />
            </div>
          </Card>

          <Button className="w-full" disabled={isSaving}>
            {isSaving ? <Loader2 className="animate-spin" size={15} /> : <Save size={15} />}
            Save Settings
          </Button>
        </aside>
      </form>
    </Page>
  )
}

function SettingsField({ label, description, children }: { label: string; description: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="label-caps block">{label}</span>
      <span className="mt-1 block text-xs leading-5 text-muted">{description}</span>
      <span className="mt-3 block">{children}</span>
    </label>
  )
}

function PreferenceRow({ icon, title, description, control }: { icon: React.ReactNode; title: string; description: string; control: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex gap-3">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-tool border border-line bg-[#151515] text-muted">{icon}</div>
        <div>
          <p className="font-bold text-white">{title}</p>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-muted">{description}</p>
        </div>
      </div>
      <div className="shrink-0">{control}</div>
    </div>
  )
}

function Toggle({ checked }: { checked: boolean }) {
  return (
    <span className={checked ? 'flex h-6 w-11 items-center rounded-full bg-success/30 p-1 ring-1 ring-success/40' : 'flex h-6 w-11 items-center rounded-full bg-zinc-700 p-1 ring-1 ring-line'}>
      <span className={checked ? 'h-4 w-4 translate-x-5 rounded-full bg-success transition' : 'h-4 w-4 rounded-full bg-muted transition'} />
    </span>
  )
}

function Meta({ label, value, tone }: { label: string; value: string; tone?: 'success' }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-line pb-2 last:border-0 last:pb-0">
      <span className="text-muted">{label}</span>
      <span className={tone === 'success' ? 'font-mono text-xs font-bold text-success' : 'font-mono text-xs font-bold text-zinc-300'}>{value}</span>
    </div>
  )
}
