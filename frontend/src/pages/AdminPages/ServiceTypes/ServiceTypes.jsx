// External libraries
import React from 'react';
import Header from '../../../utilities/Header';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRightIcon } from '@heroicons/react/20/solid';
import { WrenchScrewdriverIcon } from '@heroicons/react/24/outline';

// Internal
import ServiceTypeDialog from './components/ServiceTypeDialog';
import { useServiceTypes } from '../../../hooks/data/useServiceTypes';

const ServiceTypes = () => {
    const {
        serviceTypes,
        selectedServiceType,
        inputValue,
        dialogOpen,
        setDialogOpen,
        handleInputChange,
        fetchServiceTypeById,
        resetSelectedServiceType,
        saveServiceType,
    } = useServiceTypes();


    const handleServiceTypeSelect = (id) => {
        if (id) {
            fetchServiceTypeById(id);
        } else {
            resetSelectedServiceType();
        }
    };

    return (
        <>
            <Header
                searchValue={inputValue}
                handleInputChange={handleInputChange}
                onCreateClick={() => handleServiceTypeSelect(null)}
                headerTitle="Service Types"
                subHeadingText="Create and update Services which are available for Users to request."
            />

            <ServiceTypeDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                selectedServiceType={selectedServiceType}
                handleSave={saveServiceType}
            />

            <div className="flex flex-col flex-grow py-4">
                <AnimatePresence>
                    {serviceTypes && serviceTypes.length > 0 ? (
                        <ul role="list" className="divide-y divide-gray-100">
                            {serviceTypes.map((serviceType) => (
                                <li key={serviceType.id}>
                                    <motion.div
                                        onClick={() => handleServiceTypeSelect(serviceType.id)}
                                        key={serviceType.name}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.1 }}
                                        className="relative flex justify-between gap-x-6 px-4 py-5 hover:bg-gray-50 sm:px-6 lg:px-8 hover:cursor-pointer"
                                    >
                                        <div className="flex flex-1 min-w-0 gap-x-4">
                                            <img
                                                src={serviceType.service_icon}
                                                alt={serviceType.name}
                                                className="h-12 w-12"
                                            />
                                            <div className="min-w-0 flex-auto">
                                                <h3 className="text-base font-semibold leading-6 text-gray-900">
                                                    {serviceType.name}
                                                </h3>
                                                <p className="mt-2 text-sm text-gray-500">
                                                    {serviceType.description}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex shrink-0 items-center gap-x-4">
                                            {serviceType.is_active ? (
                                                <span className="inline-flex items-center rounded-md bg-green-50 mx-2 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                                    Active
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center rounded-md bg-red-50 mx-2 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">
                                                    Disabled
                                                </span>
                                            )}
                                            <ChevronRightIcon aria-hidden="true" className="h-5 w-5 flex-none text-gray-400" />
                                        </div>
                                    </motion.div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="mt-40 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
                            <WrenchScrewdriverIcon aria-hidden="true" className="h-12 w-12 shrink-0" />
                            <h3 className="mt-2 text-base font-semibold text-gray-900">No Service Types found</h3>
                            <p className="mt-1 text-sm text-gray-500">Create a Service Type so Users can start raising Requests.</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
};

export default ServiceTypes;
