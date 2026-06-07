import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { App } from './App'
import { renderWithApp } from './test/render'

async function signIn() {
  await userEvent.type(screen.getByLabelText(/email address/i), 'admin@apicontrol.local')
  await userEvent.type(screen.getByLabelText(/^password$/i), 'password123')
  await userEvent.click(screen.getByRole('button', { name: /^sign in$/i }))
}

describe('Api Manager app', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('guards authenticated routes and allows login', async () => {
    renderWithApp(<App />, '/contracts')

    expect(await screen.findByRole('heading', { name: /sign in/i })).toBeInTheDocument()
    await signIn()

    expect(await screen.findByRole('heading', { name: /api contracts/i })).toBeInTheDocument()
  })

  it('navigates to diff viewer when a violated contract is validated', async () => {
    renderWithApp(<App />, '/login')
    await signIn()

    const billingRowButton = await screen.findAllByRole('button', { name: /validate/i })
    await userEvent.click(billingRowButton[0])

    await waitFor(() => expect(screen.getAllByText(/detected changes/i).length).toBeGreaterThan(0), { timeout: 2000 })
    expect(screen.getByText(/BREAKING - Removed field: invoice_id/i)).toBeInTheDocument()
  })

  it('validates the new contract wizard required fields', async () => {
    renderWithApp(<App />, '/login')
    await signIn()
    const newContractLinks = await screen.findAllByRole('link', { name: /new contract/i })
    await userEvent.click(newContractLinks[0])

    const nameInput = screen.getByDisplayValue(/customer profiles api/i)
    await userEvent.clear(nameInput)
    await userEvent.click(screen.getByRole('button', { name: /continue/i }))

    expect(await screen.findByText(/name, provider, and source details are required/i)).toBeInTheDocument()
  })
})
