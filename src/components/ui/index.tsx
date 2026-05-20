import { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'
import clsx from 'clsx'
import type { ContractStatus, HttpMethod, RiskLevel } from '../../types/domain'

export function Button({
  className,
  variant = 'primary',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' | 'danger' }) {
  return (
    <button
      className={clsx(
        'inline-flex h-9 items-center justify-center gap-2 rounded-tool px-4 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-50',
        variant === 'primary' && 'bg-white text-zinc-950 hover:bg-zinc-200',
        variant === 'secondary' && 'border border-lineStrong bg-panelElevated text-text hover:bg-panelMuted',
        variant === 'ghost' && 'text-muted hover:bg-panelMuted hover:text-white',
        variant === 'danger' && 'border border-danger/50 bg-danger/10 text-danger hover:bg-danger/20',
        className,
      )}
      {...props}
    />
  )
}

export function TextInput({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={clsx(
        'h-10 w-full rounded-tool border border-line bg-[#101010] px-3 text-sm text-text outline-none transition placeholder:text-subtle focus:border-white',
        className,
      )}
      {...props}
    />
  )
}

export function TextArea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={clsx(
        'min-h-32 w-full rounded-tool border border-line bg-[#101010] px-3 py-2 font-mono text-sm text-text outline-none transition placeholder:text-subtle focus:border-white',
        className,
      )}
      {...props}
    />
  )
}

export function SelectInput({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={clsx('h-10 w-full rounded-tool border border-line bg-[#101010] px-3 text-sm text-text outline-none focus:border-white', className)}
      {...props}
    />
  )
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <section className={clsx('panel p-4', className)}>{children}</section>
}

export function SectionHeader({ eyebrow, title, action }: { eyebrow?: string; title: string; action?: ReactNode }) {
  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        {eyebrow ? <p className="label-caps mb-1">{eyebrow}</p> : null}
        <h2 className="text-lg font-semibold tracking-[-0.02em] text-white">{title}</h2>
      </div>
      {action}
    </div>
  )
}

export function StatusBadge({ status }: { status: ContractStatus }) {
  const classes = {
    COMPLIANT: 'bg-success/10 text-success ring-success/20',
    VIOLATED: 'bg-danger/10 text-danger ring-danger/20',
    UNKNOWN: 'bg-zinc-500/10 text-zinc-300 ring-zinc-500/20',
  }

  return <span className={clsx('rounded px-2.5 py-1 text-[10px] font-bold tracking-[0.08em] ring-1', classes[status])}>{status}</span>
}

export function RiskBadge({ risk }: { risk: RiskLevel }) {
  const classes = {
    HIGH: 'bg-danger/10 text-danger ring-danger/25',
    MEDIUM: 'bg-warning/10 text-warning ring-warning/25',
    LOW: 'bg-success/10 text-success ring-success/25',
  }

  return <span className={clsx('rounded px-2 py-0.5 text-[10px] font-bold tracking-[0.08em] ring-1', classes[risk])}>{risk}</span>
}

export function MethodChip({ method }: { method: HttpMethod }) {
  const classes = {
    GET: 'bg-success/10 text-success',
    POST: 'bg-info/10 text-info',
    PUT: 'bg-warning/10 text-warning',
    PATCH: 'bg-warning/10 text-warning',
    DELETE: 'bg-danger/10 text-danger',
  }
  return <span className={clsx('rounded-sm px-2 py-1 font-mono text-[10px] font-bold', classes[method])}>{method}</span>
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-tool border border-dashed border-line p-8 text-center">
      <p className="font-semibold text-white">{title}</p>
      <p className="mt-1 text-sm text-muted">{description}</p>
    </div>
  )
}

export function CodePane({ value, className }: { value: unknown; className?: string }) {
  return <pre className={clsx('code-pane overflow-auto p-4', className)}>{typeof value === 'string' ? value : JSON.stringify(value, null, 2)}</pre>
}
