// External libraries
import { useState, useEffect } from 'react';

// Internal
import api from '../../api/apiConfig';
import { useNotification } from '../../contexts/NotificationContext';
import { useLoading } from '../../contexts/LoadingContext';

// users requests crud and state management
export const useMyRequests = () => {
    const { showLoading, hideLoading } = useLoading();
    const { triggerNotification } = useNotification();

    const [userRequests, setUserRequests] = useState([]);
    const [filters, setFilters] = useState({
        building: null,
        service_request_item: null,
        priority: null,
        status: null,
    });

    const fetchUserRequests = async () => {
        showLoading('Fetching Requests');
        const queryParams = new URLSearchParams();

        for (const [key, value] of Object.entries(filters)) {
            if (value) {
                queryParams.append(key, value.id || value);
            }
        }

        const endpoint = `/service-requests/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

        try {
            const response = await api.get(endpoint);
            setUserRequests(response.data);
        } catch (e) {
            triggerNotification('FAIL', 'Error fetching your requests', `${e.message}`);
        } finally {
            hideLoading();
        }
    };

    useEffect(() => {
        fetchUserRequests();
    }, [filters]);

    const updateFilter = (filterName, value) => {
        setFilters(prev => ({ ...prev, [filterName]: value }));
    };

    return {
        userRequests,
        filters,
        updateFilter,
        fetchUserRequests,
    };
};