// External libraries
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BuildingOffice2Icon } from '@heroicons/react/24/outline';

// Internal
import DataTable from '../../../utilities/DataTable';
import Header from '../../../utilities/Header';
import BuildingDrawer from './components/BuildingCreateEditDialog';
import { useBuildings } from '../../../hooks/data/useBuildings';

const Buildings = () => {
    const navigate = useNavigate();
    const {
        buildings,
        inputValue,
        openBuildingDrawer,
        setOpenBuildingDrawer,
        handleInputChange,
        handleOrderingClick,
        createBuilding
    } = useBuildings();


    const handleBuildingSelect = (buildingId) => {
        navigate(`/buildings/${buildingId}`);
    };

    
    return (
        <>
            <BuildingDrawer
                open={openBuildingDrawer}
                onClose={() => setOpenBuildingDrawer(false)}
                selectedBuildingData={{
                    name: '',
                    address_line1: '',
                    address_line2: '',
                    city: '',
                    postcode: '',
                    country: 'United Kingdom',
                    latitude: '',
                    longitude: ''
                }}
                handleSubmit={createBuilding}
            />
            <Header searchValue={inputValue} handleInputChange={handleInputChange} onCreateClick={() => setOpenBuildingDrawer(true)} headerTitle="Buildings" />
            <div className="flex flex-col min-h-full">
                {buildings.length > 0 ? (
                    <DataTable
                        columns={[
                            { header: 'Name', accessor: 'name', width: '25%' },
                            { header: 'Address Line 1', accessor: 'address_line1', mobileHidden: true, width: '40%' },
                            { header: 'City', accessor: 'city', width: '25%' },
                            { header: 'Postcode', accessor: 'postcode', mediumVisible: true, width: '10%' },
                        ]}
                        data={buildings}
                        onRowClick={(row) => handleBuildingSelect(row.id)}
                        allowOrdering={true}
                        onOrderingClick={handleOrderingClick}
                    />
                ) : (
                    <div className="mt-40 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
                        <BuildingOffice2Icon aria-hidden="true" className="h-12 w-12 shrink-0" />
                        <h3 className="mt-2 text-base font-semibold text-gray-900">No Buildings found</h3>
                        <p className="mt-1 text-sm text-gray-500">Create a Building to get started.</p>
                    </div>
                )}
            </div>
        </>
    );
};

export default Buildings;
