// External libraries
import { useState } from 'react';
import React from 'react';
import * as Yup from 'yup';
import { MapPinIcon } from '@heroicons/react/24/outline';

// Internal
import { useUser } from '../../contexts/UserContext';
import api from '../../api/apiConfig';
import DynamicForm from '../../utilities/DynamicForm';
import { useNotification } from '../../contexts/NotificationContext';
import { useLoading } from '../../contexts/LoadingContext';

const Profile = () => {
    const { user } = useUser();
    const { triggerNotification } = useNotification();
    const { showLoading, hideLoading } = useLoading();

    const [loading, setLoading] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    const [notificationData, setNotificationData] = useState({
        type: '',
        title: '',
        message: '',
    })

    const passwordFields = [
        { name: 'currentPassword', label: 'Current Password', type: 'password', span: 'full' },
        { name: 'newPassword', label: 'New Password', type: 'password', span: 'full' },
        { name: 'newPasswordConfirmed', label: 'Confirm New Password', type: 'password', span: 'full' },
    ];

    const passwordSchema = Yup.object().shape({
        currentPassword: Yup.string().required('Current password is required'),
        newPassword: Yup.string()
            .min(8, 'Password must be at least 8 characters')
            .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
            .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
            .matches(/[0-9]/, 'Password must contain at least one number')
            .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character')
            .required('New password is required'),
        newPasswordConfirmed: Yup.string()
            .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
            .required('You need to confirm your password'),
    });

    const handlePasswordUpdate = async (values, { setSubmitting, resetForm, setFieldError }) => {
        try {
            showLoading('Updating Password...');
            const inputs = {
                current_password: values.currentPassword,
                new_password1: values.newPassword,
                new_password2: values.newPasswordConfirmed
            };
            await api.post('/auth/update_password/', inputs);
            triggerNotification('SUCCESS', 'Password updated successfully');
            resetForm();
        } catch (error) {
            if (error.response && error.response.data) {
                const errorData = error.response.data.details;

                if (errorData.current_password && errorData.current_password.current_password) {
                    setFieldError('currentPassword', errorData.current_password.current_password);
                }
                if (errorData.new_password1) {
                    setFieldError('newPassword', errorData.new_password1);
                }
                if (errorData.new_password2) {
                    setFieldError('newPasswordConfirmed', errorData.new_password2);
                }
            } else {
                triggerNotification('FAIL', 'An Error has occurred', error.message || 'An unexpected error occurred');
            }
        } finally {
            setSubmitting(false);
            hideLoading();
        }
    };



    return (
        <>
            <div className="sm:flex-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-2xl font-semibold leading-6 text-gray-900">My Profile</h1>
                <p className="mt-2 text-sm text-gray-700">
                    View your information and update your password.
                </p>
            </div>

            <div className="divide-y divide-white/5">
                <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
                    <div>
                        <h2 className="text-base font-semibold leading-7 text-black">Personal Information</h2>
                        <p className="mt-1 text-sm leading-6 text-gray-400">
                            All information associated with you.
                        </p>
                    </div>

                    <form className="md:col-span-2">
                        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
                            <div className="col-span-full opacity-80">
                                <label htmlFor="username" className="block text-sm font-medium leading-6 text-black">
                                    Username
                                </label>
                                <div className="mt-2">
                                    <div className="flex rounded-md bg-white/5 ring-1 ring-inset ring-white/10 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500">
                                        <input
                                            disabled
                                            readOnly
                                            value={user.username ? user.username : ''}
                                            id="username"
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-full opacity-80">
                                <label htmlFor="email" className="block text-sm font-medium leading-6 text-black">
                                    Email address
                                </label>
                                <div className="mt-2">
                                    <input
                                        disabled
                                        readOnly
                                        value={user.email ? user.email : ''}
                                        id="email"
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                            <div className="sm:col-span-3  opacity-80">
                                <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-black">
                                    First name
                                </label>
                                <div className="mt-2">
                                    <input
                                        onChange={(e) => setFirstName(e.target.value)}
                                        defaultValue={user.first_name ? user.first_name : ''}
                                        id="first-name"
                                        name="first-name"
                                        type="text"
                                        autoComplete="given-name"
                                        disabled
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-3  opacity-80">
                                <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-black">
                                    Last name
                                </label>
                                <div className="mt-2">
                                    <input
                                        onChange={(e) => setLastName(e.target.value)}
                                        defaultValue={user.last_name ? user.last_name : ''}
                                        disabled
                                        id="last-name"
                                        name="last-name"
                                        type="text"
                                        autoComplete="family-name"
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                {user.buildings.length > 0 && (
                    <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
                        <div>
                            <h2 className="text-base font-semibold leading-7 text-black">Assigned Buildings</h2>
                            <p className="mt-1 text-sm leading-6 text-gray-400">
                                The buildings available to your account, these can only be changed by your System Administrator and are used when creating requests.
                            </p>
                        </div>
                        {
                            user.buildings != null && user.buildings.length > 0 ?
                                <ul role="list"
                                    className="md:col-span-2 divide-y divide-gray-100 overflow-hidden bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
                                    {user.buildings.map((building) => (
                                        <li key={building.id} className="relative flex justify-between items-center gap-x-6 px-4 py-6 sm:px-6">
                                            <div className="flex min-w-0 gap-x-4 flex-auto">
                                                <div className="min-w-0 flex-auto">
                                                    <p className="text-sm font-medium leading-6 text-gray-900">
                                                        {building.name}
                                                    </p>
                                                    <p className="mt-1 flex text-sm leading-5 text-gray-500">
                                                        {`${building.city} - ${building.postcode}`}
                                                    </p>
                                                </div>
                                            </div>
                                            {building.latitude && building.longitude ?
                                                <a
                                                    href={`https://www.google.com/maps?q=${building.latitude},${building.longitude}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="ml-auto"
                                                >
                                                    <MapPinIcon className="h-6 w-6 text-indigo-600" />
                                                </a> : null
                                            }
                                        </li>
                                    ))}
                                </ul> : null
                        }
                    </div>)}
                <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
                    <div>
                        <h2 className="text-base font-semibold leading-7 text-black">Change password</h2>
                        <p className="mt-1 text-sm leading-6 text-gray-400">
                            Update your password associated with your account.
                        </p>
                    </div>

                    <div className="md:col-span-2">
                        <DynamicForm
                            fields={passwordFields}
                            initialValues={{
                                currentPassword: '',
                                newPassword: '',
                                newPasswordConfirmed: '',
                            }}
                            validationSchema={passwordSchema}
                            onSubmit={handlePasswordUpdate}
                            loading={loading}
                            actionText="Update"
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Profile;
