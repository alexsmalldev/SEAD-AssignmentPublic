// External
import React, { useEffect } from 'react';
import moment from 'moment';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { EnvelopeIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useNavigate } from 'react-router-dom';

// Internal
import { useNotification } from '../../contexts/NotificationContext';
import { useLoading } from '../../contexts/LoadingContext';

const Notifications = ({ openNotifications, setOpenNotifications }) => {
  const { notificationItems, refreshNotifications, markAllAsRead, markNotificationAsRead } = useNotification();
  const { showLoading, hideLoading } = useLoading();
  const navigate = useNavigate();

  useEffect(() => {
    if (openNotifications) {
      refreshNotifications().then(() => hideLoading());
    }
  }, [openNotifications, refreshNotifications]);

  const formatCreatedDate = (date) => {
    return moment(date).calendar(null, {
      sameDay: '[Today at] h:mm A',
      nextDay: '[Tomorrow at] h:mm A',
      nextWeek: 'dddd [at] h:mm A',
      lastDay: '[Yesterday at] h:mm A',
      lastWeek: '[Last] dddd [at] h:mm A',
      sameElse: 'M/D/YYYY [at] h:mm A'
    });
  }

  const handleMarkAllRead = async () => {
    await markAllAsRead();
  };

  const handleNotificationOnClick = async (notification) => {
    const path = await markNotificationAsRead(notification.id, notification.service_request);
    if (path) {
      setOpenNotifications(false);
      navigate(path);
    }
  };

  return (
    <Dialog open={openNotifications} onClose={setOpenNotifications} className="relative z-40">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity duration-300 ease-in-out data-[closed]:opacity-0"
      />

      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 left-0 flex max-w-full pr-10">
            <DialogPanel
              transition
              className="p-6 pointer-events-auto relative w-screen max-w-md transform transition duration-300 ease-in-out data-[closed]:-translate-x-full sm:duration-300"
            >
              <div className="rounded-lg flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                <div className="px-4 sm:px-6 flex justify-between">
                  <DialogTitle className="text-xl font-semibold leading-6 text-gray-900 flex flex-row gap-2">
                    <EnvelopeIcon
                      className="w-6 h-6 text-indigo-600"></EnvelopeIcon>
                    Notifications
                  </DialogTitle>
                  <button type="button" onClick={() => setOpenNotifications(false)}>
                    <XMarkIcon className="w-6 h-6 text-gray-400"></XMarkIcon>
                  </button>
                </div>
                <div className="relative mt-6 flex-1">
                  {notificationItems && notificationItems.length > 0 ? (
                    <>
                      <div className="flex flex-row justify-end mx-4">
                        <button
                          type="button"
                          disabled={!notificationItems.some(item => item.is_read === false)}
                          onClick={handleMarkAllRead}
                          className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        >
                          Mark All Read

                        </button>
                      </div>
                      <ul role="list" className="divide-y divide-gray-100 mt-4">
                        {notificationItems.map((item) => (
                          <li key={item.id}
                            onClick={() => { handleNotificationOnClick(item) }}
                            className="py-4 px-2 flex flex-row justify-between items-center gap-4 hover:cursor-pointer hover:bg-zinc-950/5">
                            <div className="px-2 flex flex-col gap-2">
                              <div className="flex flex-row justify-between">
                                <p className="text-sm font-semibold text-gray-900">{item.title}</p>

                              </div>
                              <p className="text-xs text-gray-500">{formatCreatedDate(item.created_date)}</p>
                            </div>
                            {item.is_read == false ? <span className="flex h-2 w-2 translate-y-1 rounded-full bg-red-600" /> : null}
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <div className="mt-20 flex justify-center items-center">You're all up to date!</div>
                  )}
                </div>

              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  )
}

export default Notifications;