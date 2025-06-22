// External libraries
import { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';

// Internal
import api from '../../api/apiConfig';
import { useNotification } from '../../contexts/NotificationContext';
import { useLoading } from '../../contexts/LoadingContext';


// service type crud and state manafgement - handles dialog
export const useServiceTypes = () => {
    const { showLoading, hideLoading } = useLoading();
    const { triggerNotification, triggerErrorDialog } = useNotification();

    const [serviceTypes, setServiceTypes] = useState([]);
    const [selectedServiceType, setSelectedServiceType] = useState(null);
    const [inputValue, setInputValue] = useState('');
    const [query, setQuery] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);

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

    const fetchServiceTypes = async (searchQuery) => {
        debugger;
        showLoading('Fetching Service Types...');
        try {
            const endpoint = searchQuery ? `/service-types/?search=${searchQuery}` : '/service-types/';
            const response = await api.get(endpoint);
            setServiceTypes(response.data.results || response.data);
        } catch (error) {
            triggerErrorDialog('Error Fetching Service Types', 'OK', () => {});
        } finally {
            hideLoading();
        }
    };

    const saveServiceType = async (serviceTypeData, isUpdate = false) => {
        showLoading(isUpdate ? 'Updating Service Type...' : 'Creating Service Type...');
        const formData = new FormData();
        formData.append('name', serviceTypeData.name);
        formData.append('description', serviceTypeData.description);
        formData.append('is_active', serviceTypeData.is_active);

        if (serviceTypeData.service_icon instanceof File) {
            formData.append('service_icon', serviceTypeData.service_icon);
        }

        try {
            if (isUpdate) {
                await api.put(`/service-types/${serviceTypeData.id}/`, formData);
                triggerNotification('SUCCESS', 'Operation Success', `${serviceTypeData.name} has been updated`);
            } else {
                await api.post('/service-types/', formData);
                triggerNotification('SUCCESS', 'Operation Success', `${serviceTypeData.name} has been created`);
            }

            fetchServiceTypes(query);
        } catch (error) {
            triggerErrorDialog('Error Saving Service Type', 'OK', () => {});
        } finally {
            hideLoading();
        }
    };

    const fetchServiceTypeById = async (id) => {
        showLoading('Fetching Service Type Data...');
        try {
            const response = await api.get(`/service-types/${id}`);
            setSelectedServiceType(response.data);
            setDialogOpen(true);
        } catch (error) {
            triggerErrorDialog('Error Fetching Service Type Data', 'OK', () => {});
        } finally {
            hideLoading();
        }
    };

    const resetSelectedServiceType = () => {
        setSelectedServiceType(null);
        setDialogOpen(true);
    };

    useEffect(() => {
        fetchServiceTypes(query);
    }, [query]);

    return {
        serviceTypes,
        selectedServiceType,
        inputValue,
        dialogOpen,
        setDialogOpen,
        handleInputChange,
        fetchServiceTypes,
        fetchServiceTypeById,
        saveServiceType,
        resetSelectedServiceType,
    };
};
