import { vi } from 'vitest'

export const useAuth = () => ({
  login: vi.fn().mockRejectedValue(new Error('Invalid credentials')),
  logout: vi.fn(),
  register: vi.fn(),
})
