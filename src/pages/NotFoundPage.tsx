import { Link } from 'react-router-dom'
import { ShieldCheck } from 'lucide-react'
import { Button } from '../components/ui'

export function NotFoundPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-canvas px-4 text-zinc-100">
      <ShieldCheck className="mb-4 text-white" size={32} />
      <h1 className="text-6xl font-extrabold tracking-[-0.06em]">404</h1>
      <p className="mt-3 text-lg text-muted">Page not found</p>
      <p className="mt-1 max-w-md text-center text-sm text-subtle">The route you requested does not exist in API Manager.</p>
      <Link to="/" className="mt-8">
        <Button>Back to dashboard</Button>
      </Link>
    </main>
  )
}
