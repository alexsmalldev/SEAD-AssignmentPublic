import { vi } from 'vitest'

vi.mock('../contexts/LoadingContext', () => ({
  useLoading: () => ({
    showLoading: vi.fn(),
    hideLoading: vi.fn(),
  }),
}))

vi.mock('../contexts/UserContext', () => ({
  useUser: () => ({
    setUser: vi.fn(),
  }),
}))

vi.mock('../hooks/data/useWebSocket', () => ({
  useWebSocket: () => ({
    startWebSocket: vi.fn(),
  }),
}))

vi.mock('../hooks/data/useAuth', () => ({
  useAuth: () => ({
    login: vi.fn().mockRejectedValue(new Error('Invalid credentials')),
    logout: vi.fn(),
    register: vi.fn(),
  }),
}))

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import LoginForm from '../pages/Auth/LoginForm'


describe('Login Form invalid login test', () => {
  test('shows error on invalid credentials', async () => {
    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>
    )

    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: 'test-user' },
    })

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'incorrect-password' },
    })

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument()
    })
  })
})
