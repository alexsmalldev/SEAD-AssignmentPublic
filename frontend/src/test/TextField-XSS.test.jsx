import { render, screen, fireEvent } from '@testing-library/react';
import RequestTimeline from '../pages/AdminPages/Requests/components/RequestTimeline';
import { vi } from 'vitest';

vi.mock('../contexts/UserContext', () => ({
  useUser: () => ({
    user: { id: 1, user_type: 'regular', first_name: 'John', last_name: 'Doe' },
    hasRole: () => true,
  }),
}));

vi.mock('../contexts/LoadingContext', () => ({
  useLoading: () => ({
    showLoading: vi.fn(),
    hideLoading: vi.fn(),
  }),
}));

vi.mock('../contexts/NotificationContext', () => ({
  useNotification: () => ({
    triggerNotification: vi.fn(),
  }),
}));

describe('RequestTimeline XSS protection', () => {
  it('does not execute script from comment input', () => {
    const maliciousInput = `<script>window.xssDetected = true</script>`;

    render(
      <RequestTimeline
        requestDetails={{ id: 1 }}
        requestUpdates={[
          {
            id: 99,
            type: 'message',
            message: maliciousInput,
            created_by: { id: 1, first_name: 'Evil', last_name: 'Hacker' },
            created_date: new Date().toISOString(),
          },
        ]}
        requestStatus="in_progress"
      />
    );

    expect(window.xssDetected).toBeUndefined();

    const msg = screen.getByText(/<script>window\.xssDetected = true<\/script>/i);
    expect(msg).toBeInTheDocument();
  });
});
