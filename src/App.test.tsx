import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { App } from './App'
import { renderWithApp } from './test/render'

describe('Api Manager app', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('guards authenticated routes and allows mock login', async () => {
    renderWithApp(<App />, '/contracts')

    expect(await screen.findByRole('heading', { name: /sign in/i })).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: /^sign in$/i }))

    expect(await screen.findByRole('heading', { name: /api contracts/i })).toBeInTheDocument()
  })

  it('navigates to diff viewer when a violated contract is validated', async () => {
    renderWithApp(<App />, '/login')
    await userEvent.click(await screen.findByRole('button', { name: /^sign in$/i }))

    const billingRowButton = await screen.findAllByRole('button', { name: /validate/i })
    await userEvent.click(billingRowButton[0])

    await waitFor(() => expect(screen.getAllByText(/detected changes/i).length).toBeGreaterThan(0), { timeout: 2000 })
    expect(screen.getByText(/BREAKING - Removed field: invoice_id/i)).toBeInTheDocument()
  })

  it('validates the new contract wizard required fields', async () => {
    renderWithApp(<App />, '/login')
    await userEvent.click(await screen.findByRole('button', { name: /^sign in$/i }))
    const newContractLinks = await screen.findAllByRole('link', { name: /new contract/i })
    await userEvent.click(newContractLinks[0])

    const nameInput = screen.getByDisplayValue(/customer profiles api/i)
    await userEvent.clear(nameInput)
    await userEvent.click(screen.getByRole('button', { name: /continue/i }))

    expect(await screen.findByText(/name, provider, and source details are required/i)).toBeInTheDocument()
  })
})
