// External libraries
import React from 'react';
import { FunnelIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { FunnelIcon as FilledFunnelIcon } from '@heroicons/react/24/solid';

const Header = ({ searchValue, handleInputChange, onFilterClick, filterApplied, onCreateClick, onCreateText, headerTitle, subHeadingText, subHeadingActions }) => (
    <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold leading-6 text-gray-900">{headerTitle}</h1>
            {subHeadingText != null ? <p className="mt-2 text-sm text-gray-700">
                {subHeadingText}
            </p> : null}
            {
                subHeadingActions != null ?
                    <div className="pt-4 flex items-start gap-4">
                        {subHeadingActions}
                    </div>
                    : null
            }
        </div>
        <div className="mt-3 sm:ml-4 sm:mt-0">
            <label htmlFor="mobile-search" className="sr-only">Search</label>
            <label htmlFor="desktop-search" className="sr-only">Search</label>
            <div className="flex rounded-md shadow-sm">
                {handleInputChange != null ?
                    <div className="relative flex-grow focus-within:z-10 mr-4">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <MagnifyingGlassIcon aria-hidden="true" className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            id="mobile-search"
                            name="mobile-search"
                            type="text"
                            placeholder="Search"
                            className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:hidden"
                            value={searchValue}
                            onChange={handleInputChange}
                        />
                        <input
                            id="desktop-search"
                            name="desktop-search"
                            type="text"
                            placeholder="Search"
                            className="hidden w-full rounded-md border-0 py-1.5 pl-10 text-sm leading-6 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:block"
                            value={searchValue}
                            onChange={handleInputChange}
                        />
                    </div>
                    : null}
                {
                    onCreateClick ?
                        <button
                            type="button"
                            onClick={onCreateClick}
                            className="relative inline-flex items-center rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            {onCreateText != null ? onCreateText : 'Create'}
                        </button>
                        : null}
                {
                    onFilterClick ?
                        <button
                            type="button"
                            onClick={onFilterClick}
                            className="items-center rounded bg-white px-2 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"                        >
                            {filterApplied ? <FilledFunnelIcon className="w-6 h-6 text-black"></FilledFunnelIcon> : <FunnelIcon className="w-6 h-6 text-black"></FunnelIcon>}
                        </button>
                        : null}

            </div>
        </div>
    </div>
);

export default Header;
