// External libraries
import React from 'react';
import { HandRaisedIcon } from '@heroicons/react/24/solid';

// Internal
import { useRaiseRequest } from '../contexts/RaiseRequestContext';

const RaiseRequestButton = ({ closeMobileSideBar }) => {
    const { showSearch } = useRaiseRequest();

    const handleRaiseRequestOnClick = () => {
        closeMobileSideBar();
        showSearch();
    };

    return (
        <button
            onClick={handleRaiseRequestOnClick}
            className="w-full flex gap-x-3 rounded-md p-2 text-sm leading-6 text-gray-700 hover:bg-zinc-200 hover:text-indigo-600"
        >
            <HandRaisedIcon aria-hidden="true" className="h-6 w-6 shrink-0" />
            Raise Request
        </button>
    );
};

export default RaiseRequestButton;
