// External libraries
import React from 'react';
import { UserGroupIcon } from '@heroicons/react/24/outline'
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'

// Internal
import { useBuildingUsers } from '../../../../hooks/data/useBuildingUsers';

const BuildingUsers = ({ selectedBuildingData }) => {
    

    const {
        assignedUsers,
        assignableUsers,
        selectedUsersToAssign,
        openSelectUsersDialog,
        setOpenSelectUsersDialog,
        setSelectedUsersToAssign,
        fetchAssignableUsers,
        assignUsers,
        removeUser,
    } = useBuildingUsers(selectedBuildingData.id);

    



    const handleUserSelect = (event, userId) => {
        const isChecked = event.target.checked;
        setSelectedUsersToAssign((prev) =>
            isChecked ? [...prev, userId] : prev.filter((id) => id !== userId)
        );
    };

    return (
        <>
            <Dialog open={openSelectUsersDialog} onClose={setOpenSelectUsersDialog} className="relative z-40">
                <DialogBackdrop
                    transition
                    className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
                />

                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <DialogPanel
                            transition
                            className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:max-w-lg sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95 w-full max-w-full"
                        >
                            <div className="max-h-[70vh] overflow-y-auto">
                                <h3 className="text-lg font-semibold leading-6 text-gray-900 py-2">Available Users</h3>


                                {assignableUsers.length > 0 ?
                                    <div className="max-h-[50vh] overflow-y-auto">
                                        {assignableUsers.map((user) => (
                                            <li key={user.id} className="flex justify-between gap-x-6 py-5">
                                                <div className="flex min-w-0 gap-x-4">
                                                    <div
                                                        className="flex items-center justify-center h-12 w-12 rounded-full text-white font-lg font-semibold bg-gray-600"
                                                    >
                                                        {user.first_name[0].toUpperCase() + user.last_name[0].toUpperCase()}
                                                    </div>
                                                    <div className="min-w-0 flex-auto">
                                                        <p className="text-sm font-semibold leading-6 text-gray-900">
                                                            {`${user.first_name} ${user.last_name}`}
                                                        </p>
                                                        <p className="mt-1 flex text-sm leading-5 text-gray-500">
                                                            {user.email}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex shrink-0 items-center px-2">
                                                    <input
                                                        id={`person-${user.id}`}
                                                        name={`person-${user.id}`}
                                                        type="checkbox"
                                                        onChange={(e) => { handleUserSelect(e, user.id) }}
                                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                                    />
                                                </div>
                                            </li>
                                        ))}
                                    </div>
                                    : <div>No users available</div>
                                }

                                <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                                    <button
                                        type="button"
                                        disabled={selectedUsersToAssign.length > 0 ? false : true}
                                        onClick={assignUsers}
                                        className={selectedUsersToAssign.length > 0 ?
                                            "inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                                            : "opacity-80 inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"

                                        }
                                    >
                                        {selectedUsersToAssign.length ? `Assign (${selectedUsersToAssign.length})` : "Assign"}
                                    </button>
                                    <button
                                        type="button"
                                        data-autofocus
                                        onClick={() => setOpenSelectUsersDialog(false)}
                                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
            <div>
                <div className="border-b border-gray-200 pb-5 sm:flex sm:items-center sm:justify-between">
                    <div>
                        <h3 className="text-base font-semibold leading-6 text-gray-900">Assigned Users</h3>
                        <p className="mt-1 text-sm leading-6 text-gray-400">All Users who can view and raise requests for this building.</p>
                    </div>
                    <div className="mt-3 sm:ml-4 sm:mt-0">
                        <button
                            onClick={() => {
                                fetchAssignableUsers();
                            }}
                            type="button"
                            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Add User
                        </button>
                    </div>

                </div>
                {assignedUsers && assignedUsers.length > 0 ? <ul role="list" className="divide-y divide-gray-100">
                    {assignedUsers.map((user) => (
                        <li key={user.id} className="flex justify-between gap-x-6 py-5">
                            <div className="flex min-w-0 gap-x-4">
                                <div
                                    className="flex items-center justify-center h-12 w-12 rounded-full text-white font-lg font-semibold bg-gray-600"
                                >
                                    {user.first_name[0].toUpperCase() + user.last_name[0].toUpperCase()}
                                </div>
                                <div className="min-w-0 flex-auto">
                                    <p className="text-sm font-medium leading-6 text-gray-900">
                                        {`${user.first_name} ${user.last_name}`}
                                    </p>
                                    <p className="mt-1 flex text-sm leading-5 text-gray-500">
                                        {user.email}
                                    </p>
                                </div>
                            </div>
                            <div className="flex shrink-0 items-center gap-x-6">
                                <button
                                    onClick={() => removeUser(user.id)}
                                    type="button"
                                    className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                >
                                    Remove
                                </button>
                            </div>
                        </li>
                    ))}
                </ul> : <div className="flex flex-col items-center justify-center mt-20 px-4 sm:px-6 lg:px-8">
                    <UserGroupIcon aria-hidden="true" className="h-12 w-12 shrink-0" />
                    <h3 className="mt-2 text-base font-semibold text-gray-900">No Users Assigned</h3>
                </div>}
            </div>
        </>
    )
}

export default BuildingUsers