// External libraries
import { useNavigate } from 'react-router-dom';

// Internal
import api from '../../api/apiConfig';
import { useLoading } from '../../contexts/LoadingContext';
import { setToken, removeToken, getRefreshToken } from '../../api/tokenVerification';
import { useUser } from '../../contexts/UserContext';
import { useWebSocket } from './useWebSocket';

// all auth based functionality extract into hook for SOC
export const useAuth = () => {
    const { startWebSocket } = useWebSocket();
    const { showLoading, hideLoading } = useLoading();
    const navigate = useNavigate();
    const { setUser } = useUser();

    const login = async (credentials) => {
        try {
            showLoading('Logging in...');
            const response = await api.post('/auth/login/', credentials);
            const { access, refresh, user } = response.data;

            setToken(access, refresh);
            setUser(user);

            if (user.user_type == 'regular') {
                startWebSocket();
            }

            navigate('/');

        } catch (error) {
            removeToken();
            throw error;
        } finally {
            hideLoading();
        }
    };

    const logout = async () => {
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

    const register = async (userData) => {
        try {
            showLoading('Registering...');
            const response = await api.post('/auth/register/', userData);
            return response.data;
        } catch (error) {
            throw error;
        } finally {
            hideLoading();
        }
    };

    return { login, logout, register };
};
