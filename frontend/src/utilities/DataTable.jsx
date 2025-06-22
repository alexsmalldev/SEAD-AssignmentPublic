// External libraries
import React, { useState, useRef, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid';
import moment from 'moment'

// Internal
import { cn } from '../lib/utils'

const getNestedValue = (obj, path) => {
    const value = path.includes('.')
        ? path.split('.').reduce((acc, part) => acc && acc[part], obj)
        : obj[path];

    if (isDateString(value) && !path.includes('id')) {
        return formatDate(value);
    }

    return value;
};

const isDateString = (value) => {
    return !isNaN(Date.parse(value));
};

const formatDate = (value) => {
    return moment(value).format('DD/MM/YYYY HH:mm');
};


const DataTable = ({
    columns,
    data = [],
    actionColumn,
    showCheckboxes = false,
    allowOrdering = false,
    onOrderingClick,
    onActionSelected,
    actionButtonText = 'Delete selected',
    onRowClick,
    loading = false
}) => {
    const [selectedRows, setSelectedRows] = useState([]);
    const [checked, setChecked] = useState(false);
    const [indeterminate, setIndeterminate] = useState(false);
    const [sorting, setSorting] = useState([]); 
    const checkbox = useRef();

    useLayoutEffect(() => {
        const isIndeterminate = selectedRows.length > 0 && selectedRows.length < data.length;
        setChecked(selectedRows.length === data.length);
        setIndeterminate(isIndeterminate);
        if (checkbox.current) {
            checkbox.current.indeterminate = isIndeterminate;
        }
    }, [selectedRows, data.length]);

    const toggleAll = () => {
        setSelectedRows(checked || indeterminate ? [] : data);
        setChecked(!checked && !indeterminate);
        setIndeterminate(false);
    };

    const handleRowCheckboxChange = (row) => {
        setSelectedRows((prevSelectedRows) =>
            prevSelectedRows.includes(row)
                ? prevSelectedRows.filter((r) => r !== row)
                : [...prevSelectedRows, row]
        );
    };

    const handleSort = (column) => {
        if (!allowOrdering) return;
        let field = column.accessor.includes('.') ? column.accessor.split('.')[0] : column.accessor;
        if (field.endsWith('_detail')) {
            field = field.replace('_detail', '');
        }
    
        const existingSort = sorting.find((sort) => sort.field === field);
        let newSorting;
    
        if (existingSort) {
            const newDirection = existingSort.direction === 'asc' ? 'desc' : 'asc';
            newSorting = [{ field, direction: newDirection }];
        } else {
            newSorting = [{ field, direction: 'asc' }];
        }
        setSorting(newSorting);
        const orderingString = newSorting
            .map((sort) => (sort.direction === 'asc' ? sort.field : `-${sort.field}`))
            .join(',');
        onOrderingClick(orderingString);
    };
    

    const getSortDirectionIcon = (column) => {
        let field = column.accessor.includes('.') ? column.accessor.split('.')[0] : column.accessor;
        if (field.endsWith('_detail')) {
            field = field.replace('_detail', '');
        }
        const sortObj = sorting.find((sort) => sort.field === field);
        const isActive = !!sortObj;
        const activeClasses = isActive ? 'text-white bg-indigo-600' : 'text-gray-900 bg-gray-100';
    
        return sortObj ? (
            sortObj.direction === 'asc' ? (
                <ChevronUpIcon className={`h-5 w-5 rounded ${activeClasses}`} aria-hidden="true" />
            ) : (
                <ChevronDownIcon className={`h-5 w-5 rounded ${activeClasses}`} aria-hidden="true" />
            )
        ) : (
            <ChevronDownIcon className="h-5 w-5 text-gray-900 bg-gray-100 rounded" aria-hidden="true" />
        );
    };
    
    

    return (
        <div className="pt-4 flex flex-col flex-grow">
            <div className="flex-grow overflow-x-auto overflow-y-auto -mx-4">
                <div className="relative min-w-full">
                    <table className="w-full divide-y divide-gray-300">
                        <thead>
                            <tr>
                                {showCheckboxes && (
                                    <th
                                        scope="col"
                                        style={{ width: "5%" }}
                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        <input
                                            type="checkbox"
                                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                            ref={checkbox}
                                            checked={checked}
                                            onChange={toggleAll}
                                        />
                                    </th>
                                )}
                                {columns.map((column, index) => (
                                    selectedRows && selectedRows.length > 0 && index === 0 ? (
                                        <th key={column.accessor} className="flex justify-start">
                                            <button
                                                onClick={() => onActionSelected(selectedRows)}
                                                type="button"
                                                className="my-2 inline-flex items-center rounded bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white">
                                                {actionButtonText}
                                            </button>
                                        </th>
                                    ) : (
                                        <th
                                            key={column.accessor}
                                            style={{ width: column.width }}
                                            className={`${column.mobileHidden ? 'hidden lg:table-cell' : ''} ${column.mediumVisible ? 'hidden sm:table-cell' : ''
                                                } px-3 py-3.5 text-left text-sm font-semibold text-gray-900`}
                                        >
                                            <div
                                                className="flex flex-row justify-between"
                                                onClick={() => handleSort(column)}
                                            >
                                                {column.header}
                                                {allowOrdering && (
                                                    <span className="ml-2 flex-none rounded bg-gray-100 text-gray-900 group-hover:bg-gray-200 hover:cursor-pointer">
                                                        {getSortDirectionIcon(column)}
                                                    </span>
                                                )}
                                            </div>
                                        </th>
                                    )
                                ))}
                                {actionColumn && !showCheckboxes && (
                                    <th
                                        scope="col"
                                        className="relative py-3.5 pl-3 pr-4 sm:pr-0"
                                    >
                                        {actionColumn.header}
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {loading
                                ? Array.from({ length: 10 }).map((_, index) => (
                                    <tr key={index} className="animate-pulse">
                                        {showCheckboxes && <td className="px-3 py-4"></td>}
                                        {columns.map((column, colIndex) => (
                                            <td
                                                key={colIndex}
                                                style={{ width: column.width }}
                                                className="whitespace-nowrap px-3 py-4 text-sm text-gray-50"
                                            >
                                                <div className="h-4 bg-gray-300 rounded"></div>
                                            </td>
                                        ))}
                                        {actionColumn && <td className="px-3 py-4"></td>}
                                    </tr>
                                ))
                                : data.map((row, rowIndex) => (
                                    <tr
                                        key={rowIndex}
                                        onClick={onRowClick ? () => onRowClick(row) : null}
                                        className={cn(
                                            selectedRows.includes(row) ? 'bg-gray-50' : 'hover:bg-gray-50',
                                            onRowClick ? 'hover:cursor-pointer' : ''
                                        )}
                                    >
                                        {showCheckboxes && (
                                            <td style={{ width: "5%" }} className="relative">
                                                {selectedRows.includes(row) && (
                                                    <div className="absolute inset-y-0 left-0 w-0.5 bg-indigo-600" />
                                                )}
                                                <input
                                                    type="checkbox"
                                                    className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                                    checked={selectedRows.includes(row)}
                                                    onChange={() => handleRowCheckboxChange(row)}
                                                />
                                            </td>
                                        )}
                                        {columns.map((column) => (
                                            <td
                                                key={column.accessor}
                                                style={{ width: column.width }}
                                                className={`${column.mobileHidden
                                                    ? 'hidden lg:table-cell'
                                                    : ''} ${column.mediumVisible
                                                        ? 'hidden sm:table-cell'
                                                        : ''
                                                    } whitespace-nowrap px-3 py-4 text-sm text-gray-500`}
                                            >
                                                {Array.isArray(getNestedValue(row, column.accessor)) && getNestedValue(row, column.accessor).length > 1
                                                    ? `${getNestedValue(row, column.accessor)[0].name} + ${getNestedValue(row, column.accessor).length - 1} others`
                                                    : getNestedValue(row, column.accessor) ?? 'N/A'}
                                            </td>
                                        ))}
                                        {!showCheckboxes && actionColumn && (
                                            <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                                                {actionColumn.type === 'link' ? (
                                                    <Link
                                                        to={actionColumn.getLink(row)}
                                                        className="text-indigo-600 font-semibold hover:text-indigo-900 px-6"
                                                    >
                                                        {actionColumn.label}
                                                    </Link>
                                                ) : actionColumn.type === 'button' ? (
                                                    <button
                                                        onClick={() => actionColumn.onClick(row)}
                                                        className="text-indigo-600 font-semibold hover:text-indigo-900 px-2"
                                                    >
                                                        {actionColumn.label}
                                                    </button>
                                                ) : null}
                                            </td>
                                        )}
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DataTable;
