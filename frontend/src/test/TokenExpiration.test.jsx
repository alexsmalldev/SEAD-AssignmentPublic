import api from '../api/apiConfig';
import axios from 'axios';
import { getAccessToken, getRefreshToken, removeToken, setToken } from '../api/tokenVerification';

vi.mock('../api/tokenVerification', () => ({
  getAccessToken: vi.fn(),
  getRefreshToken: vi.fn(),
  setToken: vi.fn(),
  removeToken: vi.fn(),
}));

describe('Token expiration and refresh behavior', () => {
  it('removes token and dispatches event when refresh fails after 401', async () => {
    getAccessToken.mockReturnValue('expiredAccessToken');
    getRefreshToken.mockReturnValue('invalidRefreshToken');

    const spy = vi.spyOn(window, 'dispatchEvent');

    vi.spyOn(axios, 'post').mockRejectedValueOnce(new Error('Refresh failed'));

    const originalRequest = {
      url: '/secure-endpoint',
      headers: {},
      _retry: false,
    };

    const error = {
      config: originalRequest,
      response: { status: 401 },
    };

    await expect(api.interceptors.response.handlers[0].rejected(error)).rejects.toThrow(
      'Refresh failed'
    );

    expect(removeToken).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(expect.objectContaining({ type: 'tokenExpired' }));
  });
});
