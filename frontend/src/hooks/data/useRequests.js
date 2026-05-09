// External libraries
import { useState, useEffect } from 'react';

// Internal
import api from '../../api/apiConfig';
import { useNotification } from '../../contexts/NotificationContext';
import { useLoading } from '../../contexts/LoadingContext';

// requests crud and state managemetn
export const useRequests = () => {
  const { showLoading, hideLoading } = useLoading();
  const { triggerNotification } = useNotification();

  const [allRequests, setAllRequests] = useState([]);
  const [filters, setFilters] = useState({
    building: null,
    service_request_item: null,
    priority: null,
    status: null,
  });
  const [ordering, setOrdering] = useState('');

  const fetchAllRequests = async () => {
    showLoading('Fetching Requests');
    const queryParams = new URLSearchParams();

    for (const [key, value] of Object.entries(filters)) {
      if (value) {
        queryParams.append(key, value.id || value);
      }
    }

    if (ordering) {
      queryParams.append('ordering', ordering);
    }

    const endpoint = `/service-requests/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

    try {
      const response = await api.get(endpoint);
      setAllRequests(response.data);
    } catch (e) {
      triggerNotification('FAIL', 'Error fetching requests', `${e.message}`);
    } finally {
      hideLoading();
    }
  };

  useEffect(() => {
    fetchAllRequests();
  }, [filters, ordering]);

  const updateFilter = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  const updateOrdering = (value) => {
    setOrdering(value);
  };

  return {
    allRequests,
    filters,
    updateFilter,
    ordering,
    updateOrdering,
  };
};
