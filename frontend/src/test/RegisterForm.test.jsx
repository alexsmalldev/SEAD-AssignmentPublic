import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import RegistrationForm from '../pages/Auth/RegistrationForm';

vi.mock('../api/apiConfig', () => {
  const mockGet = vi.fn((url) => {
    if (url === 'buildings/registration_list/') {
      return Promise.resolve({
        data: [{ id: 1, name: 'Main Building' }],
      });
    }
    return Promise.resolve({ data: [] });
  });

  return {
    default: { get: mockGet },
  };
});

vi.mock('../contexts/LoadingContext', () => ({
  useLoading: () => ({
    showLoading: vi.fn(),
    hideLoading: vi.fn(),
  }),
}));

vi.mock('../contexts/UserContext', () => ({
  useUser: () => ({
    setUser: vi.fn(),
  }),
}));

vi.mock('../hooks/data/useWebSocket', () => ({
  useWebSocket: () => ({
    startWebSocket: vi.fn(),
  }),
}));

const mockedRegister = vi.fn();
vi.mock('../hooks/data/useAuth', () => ({
  useAuth: () => ({
    login: vi.fn(),
    logout: vi.fn(),
    register: mockedRegister,
  }),
}));

const fillBasicForm = async () => {
  fireEvent.change(screen.getByLabelText(/username/i), {
    target: { value: 'testuser' },
  });
  fireEvent.change(screen.getByLabelText(/first name/i), {
    target: { value: 'John' },
  });
  fireEvent.change(screen.getByLabelText(/last name/i), {
    target: { value: 'Doe' },
  });
  fireEvent.change(screen.getByLabelText(/email/i), {
    target: { value: 'john@example.com' },
  });
  fireEvent.change(screen.getByLabelText(/^password$/i), {
    target: { value: 'Test123!' },
  });
  fireEvent.change(screen.getByLabelText(/confirm password/i), {
    target: { value: 'Test123!' },
  });

  const dropdownButton = screen.getByRole('button', {
    name: /select your building/i,
  });
  await userEvent.click(dropdownButton);

  const option = await screen.findByText((_, element) =>
    element.tagName.toLowerCase() === 'span' &&
    element.textContent === 'Main Building'
  );
  await userEvent.click(option);
};

describe('RegistrationForm error messages', () => {
  beforeEach(() => {
    mockedRegister.mockReset();
  });

  const cases = [
    ['username', 'A user with that username already exists.'],
    ['email', 'Email is already taken.'],
    ['email', 'Invalid email address'],
    ['password', 'Password must contain at least one uppercase letter'],
    ['password', 'Password must contain at least one digit'],
    ['password', 'Password must be at least 8 characters long'],
    ['password', 'Password must contain at least one special character'],
    ['password2', 'Passwords must match'],
  ];

  test.each(cases)(
    'displays error for field "%s" with message "%s"',
    async (field, message) => {
      mockedRegister.mockRejectedValueOnce({
        response: {
          data: {
            details: {
              [field]: [message],
            },
          },
        },
      });

      render(
        <MemoryRouter>
          <RegistrationForm />
        </MemoryRouter>
      );

      await screen.findByText(/select your building/i);
      await fillBasicForm();
      await userEvent.click(screen.getByRole('button', { name: /register/i }));

      await waitFor(() => {
        expect(screen.getByText(message)).toBeInTheDocument();
      });
    }
  );
});
