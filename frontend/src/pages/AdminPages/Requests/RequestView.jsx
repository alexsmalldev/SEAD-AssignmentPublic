// External libraries
import { useParams } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import { ChevronLeftIcon } from "@heroicons/react/20/solid";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

// Internal
import api from "../../../api/apiConfig";
import RequestStatusSelect from './components/RequestStatusSelect';
import RequestDetails from "./components/RequestDetails";
import RequestTimeline from "./components/RequestTimeline";
import RequestStatusChangeDialog from "./components/RequestStatusChangeDialog";
import { useNotification } from '../../../contexts/NotificationContext';
import { useUser } from '../../../contexts/UserContext';
import { useLoading } from '../../../contexts/LoadingContext';


const completeOption = { title: 'Complete', value: 'complete', description: 'The Request has been fulfilled.', current: false };
const cancelOption = { title: 'Cancel', value: 'cancel', description: 'This Request is no longed doable or needed.', current: false };
const inProgressOption = { title: 'In-Progress', value: 'in_progress', description: 'The Request is currently being worked on.', current: false };
const openOptions = [
    { title: 'Open', value: 'open', description: 'The Request is open and ready to be assigned.', current: true },
    inProgressOption,
    cancelOption
];
const inProgressOptions = [
    { title: 'In-Progress', value: 'in_progress', description: 'The Request is currently being worked on.', current: true, },
    completeOption,
    cancelOption
];


const RequestView = () => {
    const navigate = useNavigate();

    const { triggerNotification } = useNotification();
    const { showLoading, hideLoading } = useLoading();

    const { id } = useParams();
    const { user, hasRole } = useUser();

    const [requestDetails, setRequestDetails] = useState(null);
    const [requestUpdates, setRequestUpdates] = useState([]);

    const [optionsToMap, setOptionsToMap] = useState(null);

    const [selectedStatus, setSelectedStatus] = useState('');

    const [openStatusChangeDialog, setOpenStatusChangeDialog] = useState(false);
    const [toStatus, setToStatus] = useState('');

    const fetchRequestDetails = async () => {
        showLoading('Fetching Request Details...');
        try {
            const response = await api.get(`/service-requests/?id=${id}`);
            setRequestDetails(response.data[0]);
            switch (response.data[0].status) {
                case "open":
                    setOptionsToMap(openOptions);
                    setSelectedStatus(openOptions[0]);
                    break
                case "in_progress":
                    setOptionsToMap(inProgressOptions);
                    setSelectedStatus(inProgressOptions[0]);
                    break
                default:
                    setOptionsToMap(null);
            }
        } catch (e) {
            navigate('/unauthorized');
        } finally {
            hideLoading();
        }
    }

    const fetchRequestUpdates = async () => {
        showLoading('Fetching Request Updates...');
        try {
            const response = await api.get(`updates/service_request_updates/?service_request_id=${id}`);
            setRequestUpdates(response.data);
        } catch (e) {
            navigate('*');
        } finally {
            hideLoading();
        }
    }

    const fetchRequest = () => {
        fetchRequestDetails();
        fetchRequestUpdates();
    }

    useEffect(() => {
        fetchRequest();
    }, [id]);

    const handleStateSelectChange = (selectedOption) => {
        if (selectedOption.value == requestDetails.status) {
            return;
        }
        setToStatus(selectedOption.title);
        setOpenStatusChangeDialog(true);
    }

    const handleCloseStatusChangeDialog = () => {
        setOpenStatusChangeDialog(false)
        setTimeout(() => {
            setToStatus('');
        }, 300)

    }

    const onRequestStatusUpdate = (error) => {
        setOpenStatusChangeDialog(false);
        if (error) {
            triggerNotification('FAIL', 'Error updating request status', `${error.message}`);
        } else {
            fetchRequest();
            triggerNotification('SUCCESS', 'Operation Successful', `Request ${requestDetails?.id} has been updated to ${toStatus}.`);
        }
    }

    return (
        <>
            <RequestStatusChangeDialog open={openStatusChangeDialog} onClose={handleCloseStatusChangeDialog} toStatus={toStatus} requestDetails={requestDetails} onSubmit={(error) => { onRequestStatusUpdate(error) }}></RequestStatusChangeDialog>
            <div>
                <Link onClick={() => navigate(-1)} className="text-gray-500 flex flex-row hover:cursor-pointer">
                    <ChevronLeftIcon className="w-6 h-6"></ChevronLeftIcon>
                    Back
                </Link>
            </div>
            <div className="mt-4 lg:mt-8">
                <div className="flex items-center justify-between">
                    <div className="flex-auto flex flex-row gap-4">
                        <h1 className="text-2xl font-semibold leading-6 text-gray-900">{`Request ${id}`}</h1>
                        {requestDetails && requestDetails.status == 'completed'
                            ?
                            <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                Complete
                            </span>
                            : requestDetails && requestDetails.status == 'cancelled' ?
                                <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">
                                    Cancelled
                                </span>
                                : new Date() > new Date(requestDetails?.service_level_agreement_date) ?
                                    <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">
                                        OVERDUE
                                    </span>
                                    : hasRole('regular') && requestDetails && requestDetails.status == 'in_progress' ?
                                        <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                            In Progress
                                        </span> : hasRole('regular') && requestDetails && requestDetails.status == 'open' ?
                                            <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                                Open
                                            </span> : null
                        }
                    </div>
                    {optionsToMap != null && hasRole('admin') ? <div className="mt-3 sm:ml-4 sm:mt-0">
                        <RequestStatusSelect optionsToMap={optionsToMap} value={selectedStatus} onChange={(value) => { handleStateSelectChange(value) }} />
                    </div> : null}
                </div>
            </div>
            <RequestDetails requestDetails={requestDetails}></RequestDetails>
            <div className="relative flex-1 h-full overflow-y-auto">
                <div className="border-b border-gray-200 pb-5 sm:flex sm:items-center sm:justify-between mb-8">
                    <div className="">
                        <h3 className="text-base font-semibold leading-7 text-gray-900">Timeline</h3>
                        <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-400">Request Events and Comments from Customers.</p>
                    </div>
                </div>
                <RequestTimeline requestDetails={requestDetails} requestUpdates={requestUpdates} handleSubmit={(value) => { console.log(value) }} requestStatus={requestDetails?.status} />
            </div>

        </>
    );
};

export default RequestView