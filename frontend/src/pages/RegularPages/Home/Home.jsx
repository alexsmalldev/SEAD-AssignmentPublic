// External libraries
import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline';

// Internal
import { useUser } from '../../../contexts/UserContext';
import RequestTile from '../MyRequests/components/RequestTile';
import Header from '../../../utilities/Header';
import { useHomeData } from '../../../hooks/data/useHomeData';
import { useRaiseRequest } from '../../../contexts/RaiseRequestContext';
import { useLoading } from '../../../contexts/LoadingContext';
import { Card, CardContent, CardHeader, CardDescription } from "../../../components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../../../components/ui/carousel";
import { Separator } from '../../../components/ui/separator';

const Home = () => {
    const { user } = useUser();
    const { loading } = useLoading();
    const { showSearch, handleServiceTypeSelect } = useRaiseRequest();
    const { recentRequests, recentServiceTypes } = useHomeData();

    const GreetingHeader = () => {
        const hour = new Date().getHours();
        const greeting = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';
        return `Good ${greeting}, ${user?.first_name.charAt(0).toUpperCase() + user.first_name.slice(1)}`;
    };

    return (
        <div className="flex flex-col min-h-full">
            <Header
                onCreateClick={showSearch}
                onCreateText="Raise Request"
                headerTitle={GreetingHeader()}
                subHeadingText="How can we help you today?"
            />

            {recentServiceTypes && recentServiceTypes.length > 0 && (
                <div className="mt-4 lg:mt-8 mb-12">
                    <Separator className="my-6" />
                    <h2 className="text-xl font-semibold">Request Again</h2>
                    <AnimatePresence>
                        <motion.div
                            key="service_types_carousel"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.1 }}
                            className="relative flex mt-4 overflow-hidden">
                            <Carousel className="w-full px-4 sm:px-6 lg:px-8">
                                <CarouselContent className="flex">
                                    {recentServiceTypes.map((service) => (
                                        <CarouselItem
                                            onClick={() => handleServiceTypeSelect(service)}
                                            key={service.id}
                                            className="lg:basis-1/4 basis-1/2 w-full sm:w-full md:w-1/3 lg:w-1/4 p-2 flex-shrink-0 pl-6"
                                        >
                                            <Card className="hover:bg-gray-50 hover:cursor-pointer">
                                                <CardHeader className="select-none">
                                                    <h3 className="text-lg font-bold">{service.name}</h3>
                                                    <CardDescription className="max-h-6 overflow-y-hidden truncate select-none">
                                                        {service.description}
                                                    </CardDescription>
                                                </CardHeader>
                                                <CardContent className="select-none">
                                                    <img
                                                        src={service.service_icon}
                                                        alt={service.name}
                                                        className="h-14 w-14"
                                                    />
                                                </CardContent>
                                            </Card>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                                <CarouselPrevious className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 p-2 rounded-full shadow-md cursor-pointer" />
                                <CarouselNext className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 p-2 rounded-full shadow-md cursor-pointer" />
                            </Carousel>
                        </motion.div>
                    </AnimatePresence>
                </div>
            )}

            <Separator className="my-6" />
            <div className="flex flex-col flex-grow py-8">
                <div className="flex flex-row justify-between">
                    <h2 className="text-xl font-semibold">Your Recent Requests</h2>
                    {recentRequests && recentRequests.length > 0 && (
                        <Link className="text-sm font-semibold text-indigo-600" to="/my-requests">
                            View All
                        </Link>
                    )}
                </div>

                {recentRequests && recentRequests.length > 0 ? (
                    <AnimatePresence>
                        <ul role="list">
                            {recentRequests.map((request) => (
                                <li key={request.id}>
                                    <motion.div
                                        key={request.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.1 }}
                                        className="relative flex justify-between gap-x-6 px-4 py-5 sm:px-6 lg:px-8"
                                    >
                                        <Link
                                            className="flex flex-1 min-w-0 gap-x-4 items-center"
                                            to={`/requests/${request.id}`}
                                        >
                                            <RequestTile request={request} />
                                        </Link>
                                    </motion.div>
                                </li>
                            ))}
                        </ul>
                    </AnimatePresence>
                ) : (
                    !loading && (
                        <div className="mt-40 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
                            <ClipboardDocumentListIcon aria-hidden="true" className="h-12 w-12 shrink-0" />
                            <h3 className="mt-2 text-base font-semibold text-gray-900">No Request found</h3>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default Home;