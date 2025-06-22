// Internal
import { useNotification } from '../contexts/NotificationContext';

const NotificationCount = () => {
    const { notificationItems } = useNotification();

    const unreadNotificationsCount = notificationItems?.filter(notification => !notification.is_read).length || 0;

    if (unreadNotificationsCount > 0) {
        return (
            <div className="h-4 w-4 flex items-center justify-center rounded-full bg-red-600 text-white text-xs font-semibold">
                {unreadNotificationsCount}
            </div>
        )
    }

    return (
        <>

        </>
    )
}

export default NotificationCount;