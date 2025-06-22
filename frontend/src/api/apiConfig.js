// External libraries
import axios from 'axios';

// Internal
import { getAccessToken, getRefreshToken, setToken, removeToken } from './tokenVerification';

// base api used by all hooks
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// intercept the request and append token within header
api.interceptors.request.use(config => {
  const accessToken = getAccessToken();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
}, error => Promise.reject(error));

// refresh the token if expired
const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/refresh_token/`, { refresh: refreshToken });
    const { access, refresh } = response.data;

    if (access) {
      setToken(access, refresh); 
      return access; 
    } else {
      throw new Error('Failed to refresh token');
    }
  } catch (error) {
    removeToken(); 
    throw error;
  }
};

// intercept the subsequent request if 401 returned aka. refresh the access token because it's expired
// if following request fails then request token has expired so go back to login
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry && originalRequest.url !== '/auth/login/') {
      originalRequest._retry = true;

      try {
        const newAccessToken = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest); 
      } catch (refreshError) {
        removeToken();
        const event = new CustomEvent('tokenExpired');
        window.dispatchEvent(event);

        return Promise.reject(refreshError); 
      }
    }

    return Promise.reject(error);
  }
);

export default api;
