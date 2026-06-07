import { Eye, Lock, Mail, ShieldCheck } from 'lucide-react'
import { FormEvent, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button, TextInput } from '../components/ui'
import { useAppStore } from '../store/AppStore'

export function AuthPage() {
  const { loginUser } = useAppStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('admin@apicontrol.local')
  const [password, setPassword] = useState('password')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    await loginUser(email, password)
    const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? '/'
    navigate(from, { replace: true })
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-canvas px-4 text-zinc-100">
      <div className="mb-9 flex flex-col items-center gap-4">
        <ShieldCheck className="text-white" size={24} />
        <h1 className="text-2xl font-extrabold tracking-[-0.06em]">API Manager</h1>
      </div>

      <form onSubmit={onSubmit} className="panel w-full max-w-[445px] p-6">
        <h2 className="text-xl font-bold">Sign in</h2>
        <p className="mt-1 text-sm text-muted">Enter your credentials</p>

        <label className="label-caps mt-7 block" htmlFor="email">
          Email address
        </label>
        <div className="relative mt-2">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
          <TextInput id="email" className="pl-10" value={email} onChange={(event) => setEmail(event.target.value)} />
        </div>

        <div className="mt-5 flex items-center justify-between">
          <label className="label-caps" htmlFor="password">
            Password
          </label>
          <button type="button" className="text-sm font-semibold text-muted hover:text-white">
            Forgot password?
          </button>
        </div>
        <div className="relative mt-2">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
          <TextInput id="password" className="pl-10 pr-10" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
          <Eye className="absolute right-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
        </div>

        <Button className="mt-6 h-11 w-full text-base normal-case tracking-[-0.02em]" disabled={isSubmitting}>
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </Button>

        <div className="my-5 flex items-center gap-4 text-xs font-semibold text-muted">
          <span className="h-px flex-1 bg-line" />
          OR
          <span className="h-px flex-1 bg-line" />
        </div>

        <Button type="button" variant="ghost" className="w-full normal-case">
          Register new account
        </Button>
      </form>

      <p className="absolute bottom-8 font-mono text-[10px] uppercase tracking-[0.12em] text-zinc-700">SYS_ENV: PROD | NODE: EU-WEST-1</p>
    </main>
  )
}
