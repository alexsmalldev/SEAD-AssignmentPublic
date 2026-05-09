// External libraries
import { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';

// Internal
import api from '../../api/apiConfig';
import { useNotification } from '../../contexts/NotificationContext';
import { useLoading } from '../../contexts/LoadingContext';

// users crud and state management - delete is handled by its own hook
export const useUsers = () => {
    const { showLoading, hideLoading } = useLoading();
    const { triggerNotification } = useNotification();

    const [userArray, setUsers] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [query, setQuery] = useState('');

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

    const fetchAllUsers = async (searchQuery) => {
        showLoading('Fetching Users...');
        try {
            const endpoint = searchQuery ? `/users/?query=${searchQuery}` : `/users/`;
            const response = await api.get(endpoint);
            setUsers(response.data);
        } catch (e) {
            triggerNotification('FAIL', 'Error fetching Users', `${e.message}`);
        } finally {
            hideLoading();
        }
    };

    useEffect(() => {
        fetchAllUsers(query);
    }, [query]);

    return { userArray, inputValue, handleInputChange, fetchAllUsers  };
};
