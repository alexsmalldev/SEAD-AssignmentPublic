// External libraries
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline';


// Internal
import Header from '../../../utilities/Header';
import DataTable from '../../../utilities/DataTable';
import FilterButton from '../../../utilities/FilterButton';
import { useRequests } from '../../../hooks/data/useRequests';
import { useBuildings } from '../../../hooks/data/useBuildings';
import { useServiceTypes } from '../../../hooks/data/useServiceTypes';

const AllRequests = () => {
    const navigate = useNavigate();

    const {
        allRequests,
        filters,
        updateFilter,
        ordering,
        updateOrdering,
    } = useRequests();

    const { buildings } = useBuildings();

    const { serviceTypes } = useServiceTypes(); 

    const statusOptions = [
        {
            name: 'Open',
            id: 'open'
        },
        {
            name: 'In-Progress',
            id: 'in_progress'
        },
        {
            name: 'Completed',
            id: 'completed'
        },
        {
            name: 'Cancelled',
            id: 'cancelled'
        },
    ];

    const priorityOptions = [
        {
            name: 'Low',
            id: 'low'
        },
        {
            name: 'Medium',
            id: 'medium'
        },
        {
            name: 'High',
            id: 'high'
        }
    ]


    return (
        <>
            <Header headerTitle="Requests" />
            <div className="flex flex-row justify-between mb-4">
                <div className="mt-4 flex flex-row w-full gap-4 flex-wrap">
                    <FilterButton
                        options={buildings}
                        selectedValue={filters.building}
                        onSelect={(value) => updateFilter('building', value)}
                        placeholder="Any Building"
                        showSearch={true}
                        emptyText="No buildings found"
                    />
                    <FilterButton
                        options={serviceTypes}
                        selectedValue={filters.service_request_item}
                        onSelect={(value) => updateFilter('service_request_item', value)}
                        placeholder="Any Service"
                        showSearch={true}
                        emptyText="No services found"
                    />
                    <FilterButton
                        options={priorityOptions}
                        selectedValue={filters.priority}
                        onSelect={(value) => updateFilter('priority', value)}
                        placeholder="Any Priority"
                        showSearch={false}
                    />
                    <FilterButton
                        options={statusOptions}
                        selectedValue={filters.status}
                        onSelect={(value) => updateFilter('status', value)}
                        placeholder="Any Status"
                        showSearch={false}
                    />
                </div>
            </div>

            <div className="flex flex-col min-h-full">
                {allRequests && allRequests.length > 0 ? (
                    <DataTable
                        columns={[
                            { header: 'ID', accessor: 'id', mobileHidden: false, width: '5%' },
                            { header: 'Service', accessor: 'service_request_item_detail.name', mobileHidden: false, width: '20%' },
                            { header: 'Location', accessor: 'building_detail.name', mediumVisible: true, width: '20%' },
                            { header: 'Created Date', accessor: 'created_date', mediumVisible: true, width: '20%' },
                            { header: 'SLA Date', accessor: 'service_level_agreement_date', mediumVisible: true, width: '20%' },
                            { header: 'Priority', accessor: 'priority', width: '10%' },
                            { header: 'Status', accessor: 'status', width: '10%' }
                        ]}
                        data={allRequests}
                        showCheckboxes={false}
                        onRowClick={(row) => { navigate(`/requests/${row.id}`); }}
                        allowOrdering={true}
                        onOrderingClick={updateOrdering}
                    />
                ) : (
                    <div className="mt-40 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
                        <ClipboardDocumentListIcon aria-hidden="true" className="h-12 w-12 shrink-0" />
                        <h3 className="mt-2 text-base font-semibold text-gray-900">No Request found</h3>
                        <p className="mt-1 text-sm text-gray-500">User requests will appear here.</p>
                    </div>

                )}
            </div>
        </>
    );
};

export default AllRequests;
