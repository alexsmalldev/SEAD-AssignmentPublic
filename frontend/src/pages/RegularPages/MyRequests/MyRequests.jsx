// External libraries
import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline';

// Internal
import { useUser } from '../../../contexts/UserContext';
import { useLoading } from '../../../contexts/LoadingContext';
import Header from '../../../utilities/Header';
import RequestTile from './components/RequestTile';
import FilterButton from '../../../utilities/FilterButton';
import { useMyRequests } from '../../../hooks/data/useMyRequests';
import { useServiceTypes } from '../../../hooks/data/useServiceTypes';

const statusOptions = [
    { name: 'Open', id: 'open' },
    { name: 'In-Progress', id: 'in_progress' },
    { name: 'Completed', id: 'completed' },
    { name: 'Cancelled', id: 'cancelled' },
];

const priorityOptions = [
    { name: 'Low', id: 'low' },
    { name: 'Medium', id: 'medium' },
    { name: 'High', id: 'high' }
];

const MyRequests = () => {
    const { user } = useUser();
    const { loading } = useLoading();
    const { userRequests, filters, updateFilter } = useMyRequests();
    const { serviceTypes } = useServiceTypes();

    return (
        <div className="flex flex-col min-h-full">
            <Header headerTitle="Your Requests" />
            <div className="mt-4 flex flex-row flex-wrap justify-start gap-2">
                <FilterButton
                    options={user.buildings}
                    selectedValue={filters.building}
                    onSelect={(value) => updateFilter('building', value)}
                    placeholder="Any Building"
                    showSearch={true}
                    emptyText={"No Buildings found"}
                    getOptionLabel={(option) => option.name}
                />
                <FilterButton
                    options={serviceTypes}
                    selectedValue={filters.service_request_item}
                    onSelect={(value) => updateFilter('service_request_item', value)}
                    placeholder="Any Service"
                    showSearch={true}
                    emptyText={"No Service found"}
                    getOptionLabel={(option) => option.name}
                />
                <FilterButton
                    options={priorityOptions}
                    selectedValue={filters.priority}
                    onSelect={(value) => updateFilter('priority', value)}
                    placeholder="Any Priority"
                />
                <FilterButton
                    options={statusOptions}
                    selectedValue={filters.status}
                    onSelect={(value) => updateFilter('status', value)}
                    placeholder="Any Status"
                />
            </div>

            <div className="flex flex-col flex-grow py-8">
                {userRequests.length > 0 ? (
                    <AnimatePresence>
                        <ul role="list">
                            {userRequests.map((request) => (
                                <li key={request.id}>
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.1 }}
                                        className="relative flex justify-between gap-x-6 px-4 py-5 sm:px-6 lg:px-8"
                                    >
                                        <Link
                                            className="flex flex-1 min-w-0 gap-x-4 items-center"
                                            to={`/requests/${request.id}`}
                                        >
                                            <RequestTile request={request} />
                                        </Link>
                                    </motion.div>
                                </li>
                            ))}
                        </ul>
                    </AnimatePresence>
                ) : (
                    !loading && (
                        <div className="mt-40 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
                            <ClipboardDocumentListIcon aria-hidden="true" className="h-12 w-12 shrink-0" />
                            <h3 className="mt-2 text-base font-semibold text-gray-900">No Request found</h3>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default MyRequests;