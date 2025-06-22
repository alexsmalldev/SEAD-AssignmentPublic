// External libraries
import { useState } from 'react';

// Internal
import api from '../../api/apiConfig';
import { useNotification } from '../../contexts/NotificationContext';
import { useLoading } from '../../contexts/LoadingContext';


// specifically for delete users within the User page
export const useDeleteUsers = (fetchAllUsers) => {
    const { showLoading, hideLoading } = useLoading();
    const { triggerNotification } = useNotification();

    const [selectedUserIdArray, setSelectedUserIdArray] = useState([]);
    const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false);

    const handleDeleteSelected = (selectedRows) => {
        const selectedIds = selectedRows.map(row => row.id);
        setSelectedUserIdArray(selectedIds);
        setOpenDeleteConfirmation(true);
    };

    const handleUserDelete = async () => {
        showLoading('Deleting Users...');
        try {
            await api.delete('/users/bulk_delete/', {
                data: { user_ids: selectedUserIdArray }
            });
            triggerNotification('DELETE', 'Operation Successful!', `Successfully removed ${selectedUserIdArray.length} User(s)`);
            fetchAllUsers();
        } catch (e) {
            triggerNotification('FAIL', 'Operation Failed!', `Error: ${e.response.data.error}`);
        } finally {
            setOpenDeleteConfirmation(false);
            hideLoading();
        }
    };

    const handleDeleteConfirmationCancel = () => {
        setSelectedUserIdArray([]);
        setOpenDeleteConfirmation(false);
    };

    return {
        selectedUserIdArray,
        openDeleteConfirmation,
        handleDeleteSelected,
        handleUserDelete,
        handleDeleteConfirmationCancel,
        setOpenDeleteConfirmation
    };
};
