// External libraries
import React from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { ChevronRightIcon, EnvelopeIcon, ExclamationTriangleIcon } from '@heroicons/react/20/solid';

// Internal
import { useDashboardData } from '../../../hooks/data/useDashboardData';
import Header from '../../../utilities/Header';
import RequestsOverTimeChart from './components/RequestsOverTimeChart';
import RequestsByBuildingChart from './components/RequestsByBuildingChart';
import RequestsByServiceTypeChart from './components/RequestsByServiceTypeChart';
import {
    Card, CardContent, CardDescription, CardHeader, CardTitle
} from '../../../components/ui/card';

const Dashboard = () => {
    const {
        generalStats, todaysUpdates, actionsRequired,
        requestsByBuilding, requestsByServiceType, chartData,
        timeRange,
        setTimeRange
    } = useDashboardData();

    const navigate = useNavigate();

    const formatChartData = () => {
        return chartData.map(item => ({
            date: item.day,
            count: item.count,
        }));
    };

    if (!generalStats) {
        return <div className="text-center py-10">Loading dashboard data...</div>;
    }

    const stats = [
        { name: 'Open Requests', value: generalStats.open_requests.value },
        { name: 'In-Progress Requests', value: generalStats.in_progress_requests.value },
        { name: 'Complete Requests', value: generalStats.completed_requests.value },
    ];

    const chartConfig = {
        desktop: {
            label: "Desktop",
            color: "#059669",
        },
        mobile: {
            label: "Mobile",
            color: "#059669",
        },
        label: {
            color: "#FFFFFF",
        },
    };

    return (
        <>
            <Header headerTitle="Dashboard" />
            <div className="flex flex-col gap-8 px-4 sm:px-6 lg:px-8">
                <dl className="mt-5 mb-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
                    {stats.map(stat => (
                        <Card key={stat.name}>
                            <CardHeader>
                                <CardTitle>{stat.name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div>{stat.value}</div>
                            </CardContent>
                        </Card>
                    ))}
                </dl>
                <RequestsOverTimeChart
                    chartData={chartData}
                    timeRange={timeRange}
                    onTimeRangeChange={setTimeRange}
                    formatChartData={formatChartData}
                    chartConfig={chartConfig}
                />
                <div className="flex flex-col lg:flex-row lg:gap-4 mt-4 gap-4">
                    <div className="flex-1">
                        <Card>
                            <CardHeader className="items-left flex flex-row gap-4">
                                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
                                    <EnvelopeIcon aria-hidden="true" className="h-6 w-6 text-indigo-600" />
                                </div>
                                <div className="flex flex-col">
                                    <CardTitle>Updates</CardTitle>
                                    <CardDescription>
                                        Messages added to Requests Today
                                    </CardDescription>
                                </div>

                            </CardHeader>
                            <div className="flex mx-auto aspect-square max-h-[250px] w-full">
                                {todaysUpdates && todaysUpdates.length > 0 ? (
                                    <ul className="w-full overflow-y-auto max-h-[250px] divide-y divide-gray-100">
                                        {todaysUpdates.map((update, index) => (
                                            <li
                                                onClick={() => { navigate(`requests/${update.service_request}`) }}
                                                key={index}
                                                className="flex items-center flex-row h-16 justify-between hover:bg-gray-50 sm:px-6 hover:cursor-pointer px-4"
                                            >
                                                <div className="flex-1 ">
                                                    <p className="text-sm font-medium leading-none mb-2">
                                                        {update.title}
                                                    </p>
                                                    <p className="text-sm font-medium text-zinc-500 leading-none">
                                                        {moment(update.created_date).format('MMMM Do YYYY, h:mm:ss A')}
                                                    </p>
                                                </div>
                                                <ChevronRightIcon aria-hidden="true" className="h-5 w-5 flex-none text-gray-400" />
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <CardDescription className="flex-1 flex items-center justify-center">
                                        All up to date!
                                    </CardDescription>
                                )}
                            </div>
                        </Card>
                    </div>
                    <div className="flex-1">
                        <Card>
                            <CardHeader className="items-left flex flex-row gap-4">
                                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                    <ExclamationTriangleIcon aria-hidden="true" className="h-6 w-6 text-red-600" />
                                </div>
                                <div className="flex flex-col">
                                    <CardTitle>Action Required</CardTitle>
                                    <CardDescription>
                                        Requests overdue or becoming overdue in the next 3 days
                                    </CardDescription>
                                </div>

                            </CardHeader>
                            <div className="flex mx-auto aspect-square max-h-[250px] w-full">
                                {actionsRequired && actionsRequired.length > 0 ? (
                                    <ul className="w-full overflow-y-auto max-h-[250px] divide-y divide-gray-100">
                                        {actionsRequired.map((request, index) => (
                                            <li
                                                onClick={() => { navigate(`requests/${request.id}`) }}
                                                key={index}
                                                className="flex items-center flex-row h-16 justify-between hover:bg-gray-50 sm:px-6 hover:cursor-pointer px-4"
                                            >
                                                <div className="flex-1 ">
                                                    <p className="text-sm font-medium leading-none mb-2">
                                                        {"Request: " + request.id + " - " + request.building_detail.name}
                                                    </p>
                                                    <p className="text-sm font-medium text-zinc-500 leading-none">
                                                        {moment(request.service_level_agreement_date).format('MMMM Do YYYY, h:mm:ss A')}
                                                    </p>
                                                </div>
                                                <ChevronRightIcon aria-hidden="true" className="h-5 w-5 flex-none text-gray-400" />
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <CardDescription className="flex-1 flex items-center justify-center">
                                        All up to date!
                                    </CardDescription>
                                )}
                            </div>
                        </Card>
                    </div>

                </div>
                <div className="flex flex-col lg:flex-row lg:gap-4 mt-4 gap-4">
                    <div className="flex-1">
                        <RequestsByServiceTypeChart
                            requestsByServiceType={requestsByServiceType}
                            chartConfig={chartConfig}
                        />
                    </div>
                </div>
                <div className="flex flex-col lg:flex-row lg:gap-4 mt-4 gap-4">
                    <div className="flex-1">
                        <RequestsByBuildingChart
                            requestsByBuilding={requestsByBuilding}
                            chartConfig={chartConfig}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Dashboard;
