// External libraries
import React, { useState, useEffect } from 'react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Switch } from '@headlessui/react'
import { PhotoIcon } from '@heroicons/react/24/solid'

// Internal
import { cn } from '../../../../lib/utils'
const defaultInputBorder = "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6";
const errorBorder = "block w-full rounded-md border-0 py-1.5 pr-10 text-red-900 ring-1 ring-inset ring-red-300 placeholder:text-red-300 focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm sm:leading-6";


const ServiceTypeSchema = Yup.object().shape({
    name: Yup.string().max(100, 'Maximum 100 characters').required('Name is required'),
    description: Yup.string().max(255, 'Maximum 255 characters').required('Description is required'),
    service_icon: Yup.mixed().required('Service Icon is required'),
    is_active: Yup.boolean().required('Status is required'),
});

const ServiceTypeDialog = ({ open, onClose, selectedServiceType, handleSave  }) => {
    const [preview, setPreview] = useState(selectedServiceType?.service_icon || null);

    useEffect(() => {
        if (open) {
            setPreview(selectedServiceType?.service_icon || null);
        }
    }, [open, selectedServiceType]);

    const initialValues = {
        id: selectedServiceType?.id || '',
        name: selectedServiceType?.name || '',
        description: selectedServiceType?.description || '',
        service_icon: selectedServiceType?.service_icon || null,
        is_active: selectedServiceType?.is_active || false,
    };

    const handleClose = () => {
        onClose();
        setTimeout(() => {
            setPreview(null);
        }, 300);
    };

    return (
        <Dialog open={open} onClose={handleClose} className="relative z-40">
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
            />

            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <DialogPanel
                        transition
                        className="relative transform overflow-hidden rounded-lg bg-zinc-100 px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:max-w-lg sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95 w-full max-w-full"
                    >
                        <div>
                            <div className="mt-3 text-center sm:mt-5 ">
                                <DialogTitle as="h3" className="text-base font-semibold leading-6 text-gray-900">
                                    {selectedServiceType?.id ? 'Update Service' : 'Create Service'}
                                </DialogTitle>
                                <Formik
                                    initialValues={initialValues}
                                    enableReinitialize
                                    validationSchema={ServiceTypeSchema}
                                    onSubmit={(values, { setSubmitting, resetForm }) => {
                                        handleSave(values, selectedServiceType?.id !== undefined);
                                        handleClose();
                                        resetForm();
                                    }}
                                >
                                    {({ errors, touched, isSubmitting, setFieldValue, values }) => (
                                        <Form className="grid grid-cols-1 gap-y-6 text-left">
                                            <div>
                                                <div className="flex justify-between">
                                                    <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                                                        Name
                                                    </label>
                                                    <span id="email-optional" className="text-sm leading-6 text-gray-500">
                                                        Required
                                                    </span>
                                                </div>
                                                <div className="mt-2">
                                                    <Field
                                                        name="name"
                                                        id="name"
                                                        type="text"
                                                        className={errors.name && touched.name ? errorBorder : defaultInputBorder}
                                                    />
                                                    <ErrorMessage name="name" component="div" className="mt-2 text-sm text-red-600" />
                                                </div>
                                            </div>

                                            <div>
                                                <div className="flex justify-between">
                                                    <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                                                        Description
                                                    </label>
                                                    <span id="email-optional" className="text-sm leading-6 text-gray-500">
                                                        Required
                                                    </span>
                                                </div>
                                                <div className="mt-2">
                                                    <Field
                                                        name="description"
                                                        id="description"
                                                        as="textarea"
                                                        className={errors.description && touched.description ? errorBorder : defaultInputBorder}
                                                    />
                                                    <ErrorMessage name="description" component="div" className="mt-2 text-sm text-red-600" />
                                                </div>
                                            </div>

                                            <div className="col-span-full">
                                                <div className="flex justify-between">
                                                    <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                                                        Service Icon
                                                    </label>
                                                    <span id="email-optional" className="text-sm leading-6 text-gray-500">
                                                        Required
                                                    </span>
                                                </div>
                                                <div className={cn(
                                                    errors.service_icon && touched.service_icon ? errorBorder : 'border border-dashed border-gray-900/25',
                                                    'mt-2 flex justify-center rounded-lg px-6 py-10 bg-white'
                                                )}>
                                                    <div className="text-center">
                                                        {preview ? (
                                                            <img
                                                                src={preview}
                                                                alt="Preview"
                                                                className="mx-auto h-12 w-12 text-gray-300"
                                                            />
                                                        ) : (
                                                            <PhotoIcon aria-hidden="true" className="mx-auto h-12 w-12 text-gray-300" />
                                                        )}
                                                        <div className="mt-4 flex text-sm leading-6 text-gray-600 items-center">
                                                            <label
                                                                htmlFor="service_icon"
                                                                className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                                                            >
                                                                <span>Upload a file</span>
                                                            </label>
                                                            <input
                                                                id="service_icon"
                                                                name="service_icon"
                                                                type="file"
                                                                accept="image/*"
                                                                className="sr-only"
                                                                onChange={(event) => {
                                                                    const file = event.currentTarget.files[0];
                                                                    setFieldValue("service_icon", file);
                                                                    const reader = new FileReader();
                                                                    reader.onloadend = () => {
                                                                        setPreview(reader.result);
                                                                    };
                                                                    reader.readAsDataURL(file);
                                                                }}
                                                            />

                                                        </div>
                                                        <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 5MB</p>
                                                    </div>
                                                </div>
                                                {errors.service_icon && touched.service_icon && (
                                                    <div className="mt-2 text-sm text-red-600">{errors.service_icon}</div>
                                                )}
                                            </div>

                                            <div className="flex items-center">
                                                <label htmlFor="is_active" className="flex-1 text-sm font-medium leading-6 text-gray-900">
                                                    Enable in Application
                                                </label>
                                                <div className="mt-2">
                                                    <Switch
                                                        checked={values.is_active}
                                                        onChange={(value) => setFieldValue('is_active', value)}
                                                        className={`${values.is_active ? 'bg-indigo-600' : 'bg-gray-200'}
                        relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2`}
                                                    >
                                                        <span className="sr-only">Toggle Active Status</span>
                                                        <span
                                                            aria-hidden="true"
                                                            className={`${values.is_active ? 'translate-x-5' : 'translate-x-0'}
                            inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform`}
                                                        />
                                                    </Switch>
                                                </div>
                                            </div>
                                            <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                                                <button
                                                    type="submit"
                                                    className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                                                    disabled={isSubmitting}
                                                >
                                                    {selectedServiceType?.id ? 'Update' : 'Create'}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={handleClose}
                                                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </Form>
                                    )}
                                </Formik>
                            </div>
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    );
};

export default ServiceTypeDialog;
