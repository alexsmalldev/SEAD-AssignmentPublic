// External libraries
import React from "react"
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ChevronLeftIcon, } from '@heroicons/react/20/solid'

// Internal
import BuildingDrawer from "./components/BuildingCreateEditDialog";
import { useBuildingDetails } from '../../../hooks/data/useBuildingDetails';
import Header from "../../../utilities/Header";
import BuildingUsers from "./components/BuildingUsers";
import DeleteConfirmationDialog from "../../../utilities/DeleteConfirmationDialog";

const BuildingView = () => {
    const { id } = useParams();
    const { 
        buildingData,
        openBuildingDrawer,
        openDeleteConfirmation,
        setOpenBuildingDrawer,
        setOpenDeleteConfirmation,
        updateBuilding, 
        deleteBuilding } = useBuildingDetails(id);

    const navigate = useNavigate();

    if (!buildingData) {
        return <div>No data found</div>;
    }

    return (
        <>
            <BuildingDrawer
                open={openBuildingDrawer}
                onClose={() => { setOpenBuildingDrawer(false) }}
                selectedBuildingData={buildingData}
                handleSubmit={updateBuilding} />
            <DeleteConfirmationDialog open={openDeleteConfirmation} onClose={setOpenDeleteConfirmation} onConfirm={deleteBuilding } onCancel={() => { setOpenDeleteConfirmation(false) }} title={`Delete ${buildingData.name}`} message="Are you sure you want to delete this building? This action CANNOT be undone. All Users will be unassigned and all open requests will be cancelled."> </DeleteConfirmationDialog>
            {buildingData == '' ? <div>No data found</div> :
                <>
                    <div>
                        <Link onClick={() => navigate(-1)} className="text-gray-500 flex flex-row hover:cursor-pointer">
                            <ChevronLeftIcon className="w-6 h-6"></ChevronLeftIcon>
                            Back
                        </Link>
                    </div>
                    <div className="mt-4 lg:mt-8">
                        <Header headerTitle={buildingData.name}></Header>
                    </div>

                    <div className="relative flex-1 h-full overflow-y-auto">
                        <main>
                            <div className="py-10">
                                <div className="border-b border-gray-200 pb-5 sm:flex sm:items-center sm:justify-between">
                                    <div>
                                        <h3 className="text-base font-semibold leading-7 text-gray-900">Summary</h3>
                                        <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-400">The following details are visible to all application users.</p>
                                    </div>
                                    <div className="flex items-start md:col-span-2 gap-4 mt-3 sm:ml-4 sm:mt-0">
                                        <button
                                            type="button"
                                            onClick={() => setOpenDeleteConfirmation(true)}
                                            className="rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-400"
                                        >
                                            Delete
                                        </button>
                                        <button type="button" className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                            onClick={() => { setOpenBuildingDrawer(true) }}>Edit</button>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <dl className="divide-y divide-gray-100">
                                        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0 text-sm">
                                            <dt className="font-medium leading-6 text-gray-500">Name</dt>
                                            <dd className="mt-1 leading-6 text-gray-900 sm:col-span-2 sm:mt-0 font-medium break-words whitespace-normal">{buildingData.name}</dd>
                                        </div>
                                        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0 text-sm">
                                            <dt className="font-medium leading-6 text-gray-500">Address Line 1</dt>
                                            <dd className="mt-1 leading-6 text-gray-900 sm:col-span-2 sm:mt-0 font-medium break-words whitespace-normal">{buildingData.address_line1}</dd>
                                        </div>
                                        {buildingData.address_line2 != null ?
                                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0 text-sm">
                                                <dt className="font-medium leading-6 text-gray-500">Address Line 2</dt>
                                                <dd className="mt-1 leading-6 text-gray-900 sm:col-span-2 sm:mt-0 font-medium break-words whitespace-normal">{buildingData.address_line2}</dd>
                                            </div> : null
                                        }
                                        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0 text-sm">
                                            <dt className="font-medium leading-6 text-gray-500">City</dt>
                                            <dd className="mt-1 leading-6 text-gray-900 sm:col-span-2 sm:mt-0 font-medium break-words whitespace-normal">{buildingData.city}</dd>
                                        </div>
                                        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0 text-sm">
                                            <dt className="font-medium leading-6 text-gray-500">Postcode</dt>
                                            <dd className="mt-1 leading-6 text-gray-900 sm:col-span-2 sm:mt-0 font-medium">{buildingData.postcode}</dd>
                                        </div>
                                        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0 text-sm">
                                            <dt className="font-medium leading-6 text-gray-500">Country</dt>
                                            <dd className="mt-1 leading-6 text-gray-900 sm:col-span-2 sm:mt-0 font-medium">{buildingData.country}</dd>
                                        </div>
                                        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0 text-sm">
                                            <dt className="font-medium leading-6 text-gray-500">Latitude & Longitude</dt>
                                            <dd className="mt-1 leading-6 text-gray-900 sm:col-span-2 sm:mt-0 font-medium">{buildingData.latitude + ', ' + buildingData.longitude}</dd>
                                        </div>
                                    </dl>
                                </div>
                            </div>
                            <div className="py-6 overflow-x-hidden">
                                <BuildingUsers selectedBuildingData={buildingData} buildingUsers={buildingData.users} />
                            </div>
                        </main>
                    </div>
                </>
            }

        </>
    )

}

export default BuildingView