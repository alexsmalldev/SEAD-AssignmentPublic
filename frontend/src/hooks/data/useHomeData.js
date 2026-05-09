// External libraries
import { useState, useEffect } from 'react';

// Internal
import api from '../../api/apiConfig';
import { useNotification } from '../../contexts/NotificationContext';
import { useLoading } from '../../contexts/LoadingContext';

// user home page data and state management
export const useHomeData = () => {
    const { showLoading, hideLoading } = useLoading();
    const { triggerNotification } = useNotification();

    const [recentRequests, setRecentRequests] = useState([]);
    const [recentServiceTypes, setRecentServiceTypes] = useState([]);

    const fetchHomeData = async () => {
        showLoading('Fetching Home Data');
        try {
            const response = await api.get('/service-requests/user_home_data/');
            setRecentRequests(response.data.recent_requests);
            setRecentServiceTypes(response.data.recent_service_types);
        } catch (e) {
            triggerNotification('FAIL', 'Error fetching your requests', `Error: ${e.message}`);
        } finally {
            hideLoading();
        }
    };

    useEffect(() => {
        fetchHomeData();
    }, []);

    return {
        recentRequests,
        recentServiceTypes,
        fetchHomeData
    };
};