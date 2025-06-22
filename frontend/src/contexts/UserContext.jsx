// External libraries
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

// Internal
import { getAccessToken, getRefreshToken, removeToken } from '../api/tokenVerification';
import api from '../api/apiConfig';
import { useWebSocket } from '../hooks/data/useWebSocket';
import { useLoading } from '../contexts/LoadingContext';


const UserContext = createContext();

// user context used to determine role based access and if user is authenticated on refresh of page
export const UserProvider = ({ children }) => {
  const { showLoading, hideLoading } = useLoading();
  const { startWebSocket } = useWebSocket();
  const [user, setUser] = useState(null);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const hasRole = (role) => user?.user_type === role;

  useEffect(() => {
    const fetchUserInfo = async () => {
      const accessToken = getAccessToken();

      if (!accessToken) {
        setLoading(false); 
        return;
      }

      try {
        const response = await api.get('/users/me/');
        setUser(response.data);
        if (response.data.user_type == 'regular') {
          startWebSocket();
        }
      } catch (error) {
        removeToken();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []); 

  useEffect(() => {
    const handleTokenExpiration = async () => {
      try {
        showLoading('Logging out...');
        const refreshToken = getRefreshToken();
        if (refreshToken) {
            await api.post('/auth/logout/', { refresh: refreshToken });
        }
        removeToken();
        setUser(null);
    } catch (error) {
        throw error;
    } finally {
        hideLoading();
        navigate('/login')
    }
    };

    window.addEventListener('tokenExpired', handleTokenExpiration);

    return () => {
      window.removeEventListener('tokenExpired', handleTokenExpiration);
    };
  }, [navigate]);

  return (
    <UserContext.Provider value={{ user, setUser, hasRole, loading, selectedBuilding, setSelectedBuilding }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
