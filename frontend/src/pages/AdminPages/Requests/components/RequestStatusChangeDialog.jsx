// External libraries
import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import ClipLoader from 'react-spinners/ClipLoader';


// Internal
import api from '../../../../api/apiConfig';
const defaultInputBorder = "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6";
const errorBorder = "block w-full rounded-md border-0 py-1.5 pr-10 text-red-900 ring-1 ring-inset ring-red-300 placeholder:text-red-300 focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm sm:leading-6";
import { cn } from '../../../../lib/utils'
import { useLoading } from '../../../../contexts/LoadingContext';


const RequestStatusChangeDialog = ({ open, onClose, toStatus, requestDetails, onSubmit }) => {
    const { showLoading, hideLoading } = useLoading();

    const UpdateSchema = Yup.object().shape({
        message: toStatus === 'Cancel'
            ? Yup.string().max(255, 'Maximum 255 characters').required('Comment is required.')
            : Yup.string().max(100, 'Maximum 100 characters').nullable().optional()
    });

    const handleStatusOnSubmit = async (values, { setSubmitting }) => {
        showLoading('Updating Request Status...');
        let status = '';
        switch (toStatus) {
            case 'Cancel':
                status = 'cancelled';
                break;
            case 'In-Progress':
                status = 'in_progress'
                break;
            default:
                status = 'completed'
        }

        try {
            await api.patch(`/service-requests/${requestDetails.id}/update_status/`, {
                status: status,
                comment: values.message || ""
            });
            onSubmit();
        } catch (error) {
            onSubmit(error);
        } finally {
            hideLoading();
        }
    };

    return (
        <Dialog open={open} onClose={onClose} className="relative z-40">
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
                                <DialogTitle as="h3" className="text-base font-semibold leading-6 text-gray-900 mb-8">
                                    {`Update Request to ${toStatus}`}
                                </DialogTitle>
                                <Formik
                                    initialValues={{ message: '' }}
                                    enableReinitialize
                                    validationSchema={UpdateSchema}
                                    onSubmit={handleStatusOnSubmit}
                                >
                                    {({ errors, touched, isSubmitting, isValid, dirty }) => (
                                        <Form className="grid grid-cols-1 gap-y-6 text-left">
                                            <div>
                                                <div className="flex justify-between">
                                                    <label htmlFor="message" className="block text-sm font-medium leading-6 text-gray-900">
                                                        Comment
                                                    </label>
                                                    <span id="message-requirement" className="text-sm leading-6 text-gray-500">
                                                        {toStatus === 'Cancel' ? "Required" : "Optional"}
                                                    </span>
                                                </div>
                                                <div className="mt-2">
                                                    <Field
                                                        name="message"
                                                        id="message"
                                                        type="text"
                                                        as="textarea"
                                                        rows="4"
                                                        placeholder="Enter your comments here..."
                                                        className={errors.message && touched.message ? errorBorder : defaultInputBorder}
                                                    />
                                                    <ErrorMessage name="message" component="div" className="mt-2 text-sm text-red-600" />
                                                </div>
                                            </div>
                                            <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                                                <button
                                                    type="submit"
                                                    className={cn(
                                                        "inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm sm:col-start-2",
                                                        isValid && (dirty || toStatus !== 'Cancel') && !isSubmitting
                                                            ? "bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                                            : "bg-indigo-400 text-gray-200 cursor-not-allowed"
                                                    )}
                                                    disabled={!isValid || (!dirty && toStatus === 'Cancel') || isSubmitting}
                                                >
                                                    {isSubmitting ? (
                                                        <ClipLoader color={"#ffffff"} size={20} />
                                                    ) : (
                                                        "Confirm"
                                                    )}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={onClose}
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
            </div >
        </Dialog >
    )
}

export default RequestStatusChangeDialog;