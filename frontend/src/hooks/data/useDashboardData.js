// External libraries
import { useState, useEffect } from 'react';

// Internal
import api from '../../api/apiConfig';
import { useNotification } from '../../contexts/NotificationContext';
import { useLoading } from '../../contexts/LoadingContext';

// dashboard fetches and state management for charts on cards
export const useDashboardData = () => {
    const { showLoading, hideLoading } = useLoading();
    const { triggerNotification } = useNotification();

    const [generalStats, setGeneralStats] = useState(null);
    const [todaysUpdates, setTodaysUpdates] = useState(null);
    const [actionsRequired, setActionsRequired] = useState(null);
    const [requestsByBuilding, setRequestsByBuilding] = useState([]);
    const [requestsByServiceType, setRequestsByServiceType] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [timeRange, setTimeRange] = useState("90days");

    const fetchRequestsOverTimeData = async (timeframe) => {
        try {
            setChartData([]);
            showLoading("Fetching Requests Over Time...");
            const response = await api.get(`dashboard/requests_over_time/?timeframe=${timeframe}`);
            setChartData(response.data.requests_over_time);
        } catch (e) {
            triggerNotification("ERROR", "Failed to fetch requests over time data", "Please try again.");
        } finally {
            hideLoading();
        }
    };

    const fetchGeneralStats = async () => {
        try {
            showLoading('Fetching General Stats...');
            const response = await api.get('dashboard/general_stats/');
            setGeneralStats(response.data.stats);
        } catch (e) {
            triggerNotification('ERROR', 'Failed to fetch General Stats', 'Please try again');
        } finally {
            hideLoading();
        }
    };

    const fetchTodaysUpdates = async () => {
        try {
            showLoading('Fetching Todays Updates...');
            const response = await api.get('dashboard/todays_updates/');
            setTodaysUpdates(response.data.updates_today);
        } catch (e) {
            triggerNotification('ERROR', 'Failed to fetch Todays Updates', 'Please try again');
        } finally {
            hideLoading();
        }
    };

    const fetchActionRequired = async () => {
        try {
            showLoading('Fetching Actions Required...');
            const response = await api.get('dashboard/action_required/');
            setActionsRequired(response.data.actions_required);
        } catch (e) {
            triggerNotification('ERROR', 'Failed to fetch Actions Required', 'Please try again');
        } finally {
            hideLoading();
        }
    };

    const fetchRequestsByBuilding = async () => {
        try {
            showLoading('Fetching Requests by Building...');
            const response = await api.get('dashboard/requests_by_building/');
            setRequestsByBuilding(response.data.requests_by_building);
        } catch (e) {
            triggerNotification('ERROR', 'Failed to fetch Requests by Building', 'Please try again');
        } finally {
            hideLoading();
        }
    };

    const fetchRequestsByServiceType = async () => {
        try {
            showLoading('Fetching Requests by Service Type...');
            const response = await api.get('dashboard/requests_by_service_type/');
            setRequestsByServiceType(response.data.requests_by_service_type);
        } catch (e) {
            triggerNotification('ERROR', 'Failed to fetch Requests by Service Type', 'Please try again');
        } finally {
            hideLoading();
        }
    };

    useEffect(() => {
        fetchGeneralStats();
        fetchTodaysUpdates();
        fetchActionRequired();
        fetchRequestsByBuilding();
        fetchRequestsByServiceType();
    }, []);

    useEffect(() => {
        fetchRequestsOverTimeData(timeRange);
    }, [timeRange]);

    return {
        generalStats,
        todaysUpdates,
        actionsRequired,
        requestsByBuilding,
        requestsByServiceType,
        chartData,
        timeRange,
        setTimeRange
    };
};
