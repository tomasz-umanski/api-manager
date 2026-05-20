import { ReactElement } from 'react'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AppStoreProvider } from '../store/AppStore'

export function renderWithApp(ui: ReactElement, route = '/') {
  window.history.pushState({}, 'Test page', route)
  return render(
    <MemoryRouter initialEntries={[route]}>
      <AppStoreProvider>{ui}</AppStoreProvider>
    </MemoryRouter>,
  )
}
