// External libraries
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Internal
import api from '../../api/apiConfig';
import { useNotification } from '../../contexts/NotificationContext';
import { useLoading } from '../../contexts/LoadingContext';

// building crud fetch and state management
export const useBuildingDetails = (buildingId) => {
    const [buildingData, setBuildingData] = useState(null);
    const { showLoading, hideLoading } = useLoading();
    const { triggerNotification } = useNotification();
    const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false);
    const [openBuildingDrawer, setOpenBuildingDrawer] = useState(false);
    const navigate = useNavigate();

    const fetchBuildingData = async () => {
        showLoading('Fetching Building Details...');
        try {
            const response = await api.get(`/buildings/${buildingId}/`);
            setBuildingData(response.data);
        } catch (error) {
            navigate('*'); 
            triggerNotification('FAIL', 'Error fetching building', `${error.message}`);
        } finally {
            hideLoading();
        }
    };

    const updateBuilding = async (values) => {
        showLoading('Updating Building...');
        try {
            await api.put(`/buildings/${buildingId}/`, values);
            triggerNotification('SUCCESS', 'Building updated successfully');
            fetchBuildingData(); 
            setOpenBuildingDrawer(false);
        } catch (error) {
            triggerNotification('FAIL', 'Error updating building', `${error.message}`);
        } finally {
            hideLoading();
        }
    };

    const deleteBuilding = async () => {
        showLoading('Deleting Building...');
        try {
            await api.delete(`/buildings/${buildingId}/`);
            triggerNotification('DELETE', 'Building deleted successfully');
            navigate('/buildings'); 
        } catch (error) {
            triggerNotification('FAIL', 'Error deleting building', `${error.message}`);
        } finally {
            hideLoading();
        }
    };

    useEffect(() => {
        if (buildingId) {
            fetchBuildingData(); 
        }
    }, [buildingId]);

    return {
        buildingData,
        openDeleteConfirmation,
        openBuildingDrawer,
        setOpenBuildingDrawer,
        setOpenDeleteConfirmation,
        fetchBuildingData,
        updateBuilding,
        deleteBuilding,
    };
};
