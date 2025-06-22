// External libraries
import React from 'react';
import { UserGroupIcon } from '@heroicons/react/24/outline';
import { useUsers } from '../../hooks/data/useUsers';
import { useDeleteUsers } from '../../hooks/data/useDeleteUsers';

// Internal
import DataTable from '../../utilities/DataTable';
import DeleteConfirmationDialog from '../../utilities/DeleteConfirmationDialog';
import Header from '../../utilities/Header';


const ManageUsers = () => {
    const { userArray, inputValue, handleInputChange, fetchAllUsers } = useUsers(); 
    const {
        openDeleteConfirmation,
        handleDeleteSelected,
        handleUserDelete,
        handleDeleteConfirmationCancel,
        setOpenDeleteConfirmation
    } = useDeleteUsers(fetchAllUsers);

    return (
        <>
            <DeleteConfirmationDialog
                open={openDeleteConfirmation}
                onClose={setOpenDeleteConfirmation}
                onConfirm={handleUserDelete}
                onCancel={handleDeleteConfirmationCancel}
                title="Delete Users"
                message="Are you sure you want to delete the selected User account(s)? This action CANNOT be undone. All requests raised by the selected users will be cancelled."
            />

            <div className="flex flex-col min-h-full">
                <Header searchValue={inputValue} handleInputChange={handleInputChange} headerTitle="Users" />
                {
                    userArray && userArray.length > 0 ? (
                        <DataTable
                            columns={[
                                { header: 'Username', accessor: 'username', width: '20%' },
                                { header: 'Email Address', accessor: 'email', mobileHidden: false, width: '20%' },
                                { header: 'First Name', accessor: 'first_name', mediumVisible: true, width: '10%' },
                                { header: 'Last Name', accessor: 'last_name', mediumVisible: true, width: '10%' },
                                { header: 'Type', accessor: 'user_type', mediumVisible: true, width: '10%' },
                            ]}
                            data={userArray}
                            showCheckboxes={true}
                            onActionSelected={(selectedRows) => handleDeleteSelected(selectedRows)}
                            actionButtonText="Delete Selected"
                        />
                    ) : (
                        <div className="mt-40 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
                            <UserGroupIcon aria-hidden="true" className="h-12 w-12 shrink-0" />
                            <h3 className="mt-2 text-base font-semibold text-gray-900">No Users found</h3>
                        </div>
                    )
                }
            </div>
        </>
    );
};

export default ManageUsers;
