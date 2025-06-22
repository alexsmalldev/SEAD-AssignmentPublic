// External libraries
import React from 'react';
import { Dialog, DialogPanel, DialogTitle, DialogBackdrop } from '@headlessui/react';

// Internal
import BuildingForm from './BuildingForm';

const BuildingDrawer = ({ open, onClose, selectedBuildingData, handleSubmit }) => (
    <Dialog open={open} onClose={onClose} className="relative z-40">
        <DialogBackdrop
            transition
            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <DialogPanel
                    transition
                    className="relative transform overflow-hidden rounded-lg bg-zinc-100 px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:max-w-lg sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95 w-full max-w-full"
                >
                    <div>
                        <div className="mt-3 text-center sm:mt-5">
                            <DialogTitle as="h3" className="text-base font-semibold leading-6 text-gray-900">
                                {selectedBuildingData?.id ? 'Update Building' : 'Create Building'}
                            </DialogTitle>
                            <BuildingForm initialValues={selectedBuildingData} onSubmit={handleSubmit} onClose={onClose} />
                        </div>
                    </div>
                </DialogPanel>
            </div>
        </div>
    </Dialog>
);

export default BuildingDrawer;
