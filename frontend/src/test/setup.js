import '@testing-library/jest-dom';

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

globalThis.ResizeObserver = ResizeObserver

vi.mock('../contexts/LoadingContext');
vi.mock('../contexts/UserContext');
vi.mock('../hooks/data/useWebSocket');
vi.mock('../hooks/data/useAuth');
