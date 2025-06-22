// External libraries
import { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';

// Internal
import api from '../../api/apiConfig';
import { useNotification } from '../../contexts/NotificationContext';
import { useLoading } from '../../contexts/LoadingContext';

// buildings crud and state management
export const useBuildings = () => {
    const { showLoading, hideLoading } = useLoading();
    const { triggerNotification } = useNotification();

    const [buildings, setBuildings] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [query, setQuery] = useState('');
    const [ordering, setOrdering] = useState('');
    const [openBuildingDrawer, setOpenBuildingDrawer] = useState(false);

    const fetchBuildings = async (searchQuery, orderingString) => {
        showLoading('Fetching Buildings...');
        try {
            let endpoint = '/buildings/';
            if (searchQuery) {
                endpoint = `/buildings/?search=${encodeURIComponent(searchQuery)}`;
            }
            if (orderingString) {
                endpoint += `${searchQuery ? '&' : '?'}ordering=${orderingString}`;
            }
            const response = await api.get(endpoint);
            setBuildings(response.data);
        } catch (e) {
            triggerNotification('FAIL', 'Error fetching Buildings', `${e.message}`);
        } finally {
            hideLoading();
        }
    };

    const debouncedSearch = useCallback(
        debounce((nextQuery) => {
            setQuery(nextQuery);
        }, 500),
        []
    );

    const handleInputChange = (e) => {
        const nextValue = e.target.value;
        setInputValue(nextValue);
        debouncedSearch(nextValue);
    };

    const handleOrderingClick = (orderingString) => {
        setOrdering(orderingString);
    };

    const createBuilding = async (values) => {
        showLoading('Creating Building');
        try {
            await api.post('/buildings/', values);
            triggerNotification('SUCCESS', 'Operation Successful!', `"${values.name}" has been created.`);
            setOpenBuildingDrawer(false);
            fetchBuildings(query);
        } catch (e) {
            triggerNotification('FAIL', 'Operation Failed!', `Error: ${e.message}`);
        } finally {
            hideLoading();
        }
    };

    useEffect(() => {
        fetchBuildings(query, ordering);
    }, [query, ordering]);

    return {
        buildings,
        inputValue,
        openBuildingDrawer,
        setOpenBuildingDrawer,
        handleInputChange,
        handleOrderingClick,
        createBuilding
    };
};
