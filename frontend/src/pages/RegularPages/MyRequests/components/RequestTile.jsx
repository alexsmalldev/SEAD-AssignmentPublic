// External libraries
import React from 'react';
import { ChevronRightIcon } from '@heroicons/react/20/solid';
import moment from 'moment';

// Internal
import { Card, CardTitle, CardContent, CardHeader, CardDescription, CardFooter } from '../../../../components/ui/card';
import { CalendarCheck, Calendar, TriangleAlert, Pencil } from 'lucide-react';

const RequestTile = ({ request }) => {

    const formatDate = (value) => {
        return moment(value).format('MMMM Do YYYY, h:mm:ss A');
    }

    const statusChip = () => {
        const isOverdue = new Date() > new Date(request.service_level_agreement_date) && request.status !== 'completed' && request.status !== 'cancelled';

        const statusClass = () => {
            switch (request.status.toLowerCase()) {
                case 'completed':
                    return 'bg-green-50 text-green-700 ring-green-600/20';
                case 'cancelled':
                    return 'bg-orange-50 text-orange-700 ring-orange-600/20';
                default:
                    return isOverdue ? 'bg-red-50 text-red-700 ring-red-600/20' : 'bg-white text-gray-700 ring-gray-600/20';
            }
        };

        return (
            <div className="flex shrink-0 items-center gap-x-4">
                <span className={`inline-flex items-center rounded-md mx-2 px-2 py-1 text-xs font-medium ring-1 ring-inset ${statusClass()}`}>
                    {isOverdue ? (
                        <>
                            OVERDUE <br />
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </>
                    ) : (
                        request.status.split('_')
                            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                            .join(' ')
                    )}
                </span>
            </div>
        );
    };



    return (
        <>
            <Card className="flex-1 hover:bg-gray-50 hover:cursor-pointer flex flex-row justify-between items-center">
                <div>
                    <CardHeader>
                        <CardTitle>Request: {request.id}</CardTitle>
                        <CardDescription>{request.service_request_item_detail?.name} - {request.building_detail.name}</CardDescription>

                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-row justify-between">
                            <div className="flex flex-row items-center justify-start gap-4">
                                <img
                                    src={request.service_request_item_detail?.service_icon}
                                    alt={request.service_request_item_detail?.name}
                                    className="h-14 w-14" />
                                <div className="min-w-0 flex-auto">
                                    <p className="m-2 text-xs text-gray-500 flex flex-row justify-start gap-2 items-center">
                                        <Pencil className="h-4 w-4"></Pencil>
                                        {request.customer_notes !== '' ? `Notes: ${request.customer_notes}` : "No additional notes provided."}
                                    </p>
                                    <p className="m-2 text-xs text-gray-500 flex flex-row justify-start gap-2 items-center">
                                        <Calendar className="h-4 w-4"></Calendar>
                                        {`Created Date: ${formatDate(request.created_date)}`}
                                    </p>
                                    <p className="m-2 text-xs text-gray-500 flex flex-row justify-start gap-2 items-center">
                                        <CalendarCheck className="h-4 w-4"></CalendarCheck>
                                        {`SLA Date: ${formatDate(request.service_level_agreement_date)}`}
                                    </p>
                                    <p className="m-2 text-xs text-gray-500 flex flex-row justify-start gap-2 items-center">
                                        <TriangleAlert className="h-4 w-4"></TriangleAlert>
                                        {`Priority: ${request.priority.charAt(0).toUpperCase() + request.priority.slice(1)}`}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="lg:hidden">
                        {statusChip()}
                    </CardFooter>
                </div>
                <div className="hidden lg:flex flex-row">
                    {statusChip()}
                    <ChevronRightIcon aria-hidden="true" className="mr-4 h-6 w6- flex-none text-gray-400" />
                </div>

            </Card>
        </>
    );
};

export default RequestTile;
