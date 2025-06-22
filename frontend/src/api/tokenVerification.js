// standard utility functions to get tokens, rather than using localStorage on all better to seperate
// in case logic needs expanding in future
// tbh refresh should be handled by the service - this is bad practice but i've ran out of time :(

export const setToken = (accessToken, refreshToken) => {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

export const getAccessToken = () => {
  return localStorage.getItem('accessToken');
};

export const getRefreshToken = () => {
  return localStorage.getItem('refreshToken');
};

export const removeToken = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};