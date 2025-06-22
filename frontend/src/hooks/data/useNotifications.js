// External libraries
import { useState, useCallback } from 'react';

// Internal
import api from '../../api/apiConfig';
import { useLoading } from '../../contexts/LoadingContext';


// notifications crud and state management - used within NotificationContext
export const useNotifications = () => {
    const { showLoading, hideLoading } = useLoading();
    const [notificationItems, setNotificationItems] = useState([]);
    const [showNotification, setShowNotification] = useState(false);
    const [notificationData, setNotificationData] = useState({
        type: '',
        title: '',
        message: '',
    });

    const fetchNotifications = async () => {
        showLoading('Fetching Notifications...');
        try {
            const response = await api.get(`/updates/notifications/`);
            setNotificationItems(response.data.results || response.data);
            return response.data.results || response.data;
        } catch (error) {
            console.error('Failed to fetch notifications', error);
            return [];
        } finally {
            hideLoading();
        }
    };

    const refreshNotifications = useCallback(() => {
        return fetchNotifications();
    }, []);

    const markAllAsRead = async () => {
        showLoading('Marking All Read...');
        try {
            await api.post(`updates/mark_all_read/`);
            await refreshNotifications();
        } catch (error) {
            console.error('Failed to mark notifications as read', error);
        } finally {
            hideLoading();
        }
    };

    const markNotificationAsRead = async (notificationId, serviceRequestId) => {
        showLoading('Marking as Read...');
        try {
            await api.post(`updates/${notificationId}/mark_read/`);
            await refreshNotifications();
            return `/requests/${serviceRequestId}`;
        } catch (error) {
            console.error('Failed to open notification', error);
            return null;
        } finally {
            hideLoading();
        }
    };

    const triggerNotification = useCallback((type, title, message = '') => {
        console.log("in here")
        setNotificationData({ type, title, message });
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
    }, []);

    return {
        fetchNotifications,
        notificationItems,
        setNotificationItems,
        showNotification,
        refreshNotifications,
        markAllAsRead,
        markNotificationAsRead,
        triggerNotification,
        setShowNotification,
        notificationData,
    };
};
