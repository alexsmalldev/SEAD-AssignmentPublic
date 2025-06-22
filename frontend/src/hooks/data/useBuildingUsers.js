// External libraries
import { useState, useEffect } from 'react';

// Internal
import api from '../../api/apiConfig';
import { useNotification } from '../../contexts/NotificationContext';
import { useLoading } from '../../contexts/LoadingContext';

// building users crud and state management
export const useBuildingUsers = (buildingId) => {
    const { showLoading, hideLoading } = useLoading();
    const { triggerNotification } = useNotification();
    
    const [assignedUsers, setAssignedUsers] = useState([]);
    const [assignableUsers, setAssignableUsers] = useState([]);
    const [selectedUsersToAssign, setSelectedUsersToAssign] = useState([]);
    const [openSelectUsersDialog, setOpenSelectUsersDialog] = useState(false);
    
    const fetchUsers = async () => {
        showLoading('Fetching Users...');
        try {
            const response = await api.get(`/buildings/${buildingId}/users/`);
            setAssignedUsers(response.data);
        } catch (error) {
            triggerNotification('FAIL', 'Error fetching users', `${error.message}`);
        } finally {
            hideLoading();
        }
    };

    const assignUsers = async () => {
        if (selectedUsersToAssign.length === 0) return;
        showLoading('Assigning Users...');
        try {
            const userIds = [...assignedUsers.map((u) => u.id), ...selectedUsersToAssign];
            await api.put(`/buildings/${buildingId}/update_users/`, { user_ids: userIds });
            triggerNotification('SUCCESS', 'Users Assigned Successfully', 'Users have been assigned.');
            fetchUsers();
        } catch (error) {
            triggerNotification('FAIL', 'Error assigning users', `${error.message}`);
        } finally {
            hideLoading();
            setOpenSelectUsersDialog(false);
            setSelectedUsersToAssign([]);
        }
    };

    const removeUser = async (userId) => {
        showLoading('Removing User...');
        try {
            const remainingUsers = assignedUsers.filter((user) => user.id !== userId);
            const userIds = remainingUsers.map((user) => user.id);
            await api.put(`/buildings/${buildingId}/update_users/`, { user_ids: userIds });
            triggerNotification('SUCCESS', 'User Removed', 'User has been removed from the building.');
            fetchUsers();
        } catch (error) {
            triggerNotification('FAIL', 'Error removing user', `${error.message}`);
        } finally {
            hideLoading();
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [buildingId]);

    return {
        assignedUsers,
        assignableUsers,
        selectedUsersToAssign,
        setSelectedUsersToAssign,
        fetchAssignableUsers: async () => {
            showLoading('Fetching assignable users...');
            try {
                const response = await api.get(`/buildings/${buildingId}/available_users/`);
                setAssignableUsers(response.data);
            } catch (error) {
                triggerNotification('FAIL', 'Error fetching assignable users', `${error.message}`);
            } finally {
                setOpenSelectUsersDialog(true);
                hideLoading();
            }
        },
        assignUsers,
        removeUser,
        openSelectUsersDialog, 
        setOpenSelectUsersDialog
    };
};
