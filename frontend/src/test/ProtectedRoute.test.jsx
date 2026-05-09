import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../utilities/ProtectedRoute';
import Buildings from '../pages/AdminPages/Buildings/Buildings';
import Unauthorised from '../pages/BlankPages/Unauthorised';
import LoginPage from '../pages/Auth/LoginForm';
import NoBuildingsAssigned from '../pages/BlankPages/NoBuildingsAssigned';

vi.mock('../contexts/UserContext', () => ({
  useUser: vi.fn(),
}));

import { useUser } from '../contexts/UserContext';

describe('ProtectedRoute — unauthorized users', () => {
  it('redirects regular users to /unauthorized when accessing admin-only routes', async () => {
    useUser.mockReturnValue({
      user: {
        user_type: 'regular',
        buildings: [{ id: 1, name: 'Building A' }],
      },
      loading: false,
      hasRole: (role) => role === 'regular',
    });

    render(
      <MemoryRouter initialEntries={['/buildings']}>
        <Routes>
          <Route
            path="/buildings"
            element={
              <ProtectedRoute roles={['admin']}>
                <Buildings />
              </ProtectedRoute>
            }
          />
          <Route path="/unauthorized" element={<Unauthorised />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/no-buildings" element={<NoBuildingsAssigned />} />
        </Routes>
      </MemoryRouter>
    );

    const message = await screen.findByText(/sorry, you do not have access/i);
    expect(message).toBeInTheDocument();
  });

  it('redirects regular users with no buildings to /no-buildings', async () => {
    useUser.mockReturnValue({
      user: {
        user_type: 'regular',
        buildings: [], // 🚫 no buildings
      },
      loading: false,
      hasRole: (role) => role === 'regular',
    });

    render(
      <MemoryRouter initialEntries={['/my-requests']}>
        <Routes>
          <Route
            path="/my-requests"
            element={
              <ProtectedRoute roles={['admin', 'regular']}>
                <div>My Requests Page</div>
              </ProtectedRoute>
            }
          />
          <Route path="/unauthorized" element={<Unauthorised />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/no-buildings" element={<NoBuildingsAssigned />} />
        </Routes>
      </MemoryRouter>
    );

    const message = await screen.findByText(/no buildings assigned/i);
    expect(message).toBeInTheDocument();
  });
});
