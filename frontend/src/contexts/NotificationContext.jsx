// External libraries
import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import { Transition, Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { XMarkIcon, CheckCircleIcon, ExclamationCircleIcon, TrashIcon } from '@heroicons/react/24/outline';
import { BellAlertIcon } from '@heroicons/react/20/solid';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

// Internal
import { useNotifications } from '../hooks/data/useNotifications';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);


// notification context to allow for notifications to be viewed at any point
// also allows for the display on a notification or alert - saves adding to each form individually
// some logic was moved to to useNotifications hook e.g fetching notifications and the state management
// when displaying the notification

export const NotificationProvider = ({ children }) => {
    const {
        notificationItems,
        refreshNotifications,
        fetchNotifications,
        markAllAsRead,
        markNotificationAsRead,
        triggerNotification,
        showNotification,
        setShowNotification,
        notificationData,     
    } = useNotifications();

    const [showErrorDialog, setShowErrorDialog] = useState(false);
    const [errorDialogData, setErrorDialogData] = useState({
        title: 'An Error Has Occurred',
        message: '',
        buttonText: 'Close',
        onButtonClick: () => setShowErrorDialog(false),
    });

    const triggerErrorDialog = useCallback((message, buttonText = 'Close', onButtonClick = () => setShowErrorDialog(false)) => {
        setErrorDialogData({
            title: 'An Error Has Occurred',
            message,
            buttonText,
            onButtonClick,
        });
        setShowErrorDialog(true);
    }, []);


    useEffect(() => {
        fetchNotifications();
    }, [])

    return (
        <NotificationContext.Provider value={{
            triggerNotification,
            triggerErrorDialog,
            notificationItems,
            refreshNotifications,
            markAllAsRead,
            markNotificationAsRead,
            showNotification,
            setShowNotification
        }}>
            {children}
            <div
                aria-live="assertive"
                className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6 z-50"
            >
                <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
                    <Transition
                        show={showNotification}
                        enter="transform ease-out duration-300 transition"
                        enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
                        enterTo="translate-y-0 opacity-100 sm:translate-x-0"
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                            <div className="p-4">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        {notificationData.type === 'FAIL' ? (
                                            <ExclamationCircleIcon aria-hidden="true" className="h-6 w-6 text-red-400" />
                                        ) : notificationData.type === 'SUCCESS' ? (
                                            <CheckCircleIcon aria-hidden="true" className="h-6 w-6 text-green-400" />
                                        ) : notificationData.type === 'DELETE' ? (
                                            <TrashIcon aria-hidden="true" className="h-6 w-6 text-red-400" />
                                        ) : (
                                            <BellAlertIcon aria-hidden="true" className="h-6 w-6 text-indigo-600" />
                                        )}
                                    </div>
                                    <div className="ml-3 w-0 flex-1 pt-0.5">
                                        <p className="text-sm font-medium text-gray-900">{notificationData.title}</p>
                                        <p className="mt-1 text-sm text-gray-500">{notificationData.message}</p>
                                    </div>
                                    <div className="ml-4 flex flex-shrink-0">
                                        <button
                                            type="button"
                                            onClick={() => setShowNotification(false)}
                                            className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                        >
                                            <span className="sr-only">Close</span>
                                            <XMarkIcon aria-hidden="true" className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Transition>
                </div>
            </div>

            <Dialog open={showErrorDialog} onClose={() => { return }} className="relative z-10">
                <DialogBackdrop
                    transition
                    className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
                />

                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <DialogPanel
                            transition
                            className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-sm sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
                        >
                            <div>
                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                                    <ExclamationTriangleIcon aria-hidden="true" className="h-6 w-6 text-red-600" />
                                </div>
                                <div className="mt-3 text-center sm:mt-5">
                                    <DialogTitle as="h3" className="text-base font-semibold leading-6 text-gray-900">
                                        An Error has Occured
                                    </DialogTitle>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                            {errorDialogData.message}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-5 sm:mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowErrorDialog(false)}
                                    className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    {errorDialogData.buttonText}
                                </button>
                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
        </NotificationContext.Provider>
    );
};
