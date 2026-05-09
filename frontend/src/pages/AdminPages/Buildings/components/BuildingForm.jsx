// External libraries
import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import ClipLoader from 'react-spinners/ClipLoader';

// Internal
import { cn } from '../../../../lib/utils'


const defaultInputBorder = "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6";
const errorBorder = "block w-full rounded-md border-0 py-1.5 pr-10 text-red-900 ring-1 ring-inset ring-red-300 placeholder:text-red-300 focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm sm:leading-6";

const BuildingSchema = Yup.object().shape({
    name: Yup.string().max(100, 'Maximum 100 characters').required('Name is required'),
    address_line1: Yup.string().max(255, 'Maximum 255 characters').required('Address Line 1 is required'),
    address_line2: Yup.string().max(255, 'Maximum 255 characters'),
    city: Yup.string().max(100, 'Maximum 100 characters').required('City is required'),
    postcode: Yup.string()
        .matches(
            /^([A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}|GIR ?0AA)$/,
            'Postcode is not valid'
        )
        .required('Postcode is required'),
    country: Yup.string().max(100, 'Maximum 100 characters').required('Country is required'),
    latitude: Yup.number()
        .typeError('Must be a number')
        .required('Latitude is required')
        .min(-90, 'Latitude must be between -90 and 90')
        .max(90, 'Latitude must be between -90 and 90'),
    longitude: Yup.number()
        .typeError('Must be a number')
        .required('Longitude is required')
        .min(-180, 'Longitude must be between -180 and 180')
        .max(180, 'Longitude must be between -180 and 180')
});

const BuildingForm = ({ initialValues, onSubmit, onClose }) => (
    <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={BuildingSchema}
        onSubmit={onSubmit}
    >
        {({ errors, touched, isSubmitting, isValid, dirty }) => (
            <Form className="grid grid-cols-1 gap-y-6 text-left">
                <div>
                    <div className="flex justify-between">
                        <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                            Name
                        </label>
                        <span id="name-required" className="text-sm leading-6 text-gray-500">
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
                        <label htmlFor="address_line1" className="block text-sm font-medium leading-6 text-gray-900">
                            Address Line 1
                        </label>
                        <span id="address_line1_required" className="text-sm leading-6 text-gray-500">
                            Required
                        </span>
                    </div>
                    <div className="mt-2">
                        <Field
                            name="address_line1"
                            id="address_line1"
                            type="text"
                            className={errors.address_line1 && touched.address_line1 ? errorBorder : defaultInputBorder}
                        />
                        <ErrorMessage name="address_line1" component="div" className="mt-2 text-sm text-red-600" />
                    </div>
                </div>
                <div>
                    <div className="flex justify-between">
                        <label htmlFor="address_line2" className="block text-sm font-medium leading-6 text-gray-900">
                            Address Line 2
                        </label>
                        <span id="address_line2-optional" className="text-sm leading-6 text-gray-500">
                            Optional
                        </span>
                    </div>
                    <div className="mt-2">
                        <Field
                            name="address_line2"
                            id="address_line2"
                            type="text"
                            className={errors.address_line2 && touched.address_line2 ? errorBorder : defaultInputBorder}
                        />
                        <ErrorMessage name="address_line2" component="div" className="mt-2 text-sm text-red-600" />
                    </div>
                </div>
                <div>
                    <div className="flex justify-between">
                        <label htmlFor="city" className="block text-sm font-medium leading-6 text-gray-900">
                            City
                        </label>
                        <span id="city_required" className="text-sm leading-6 text-gray-500">
                            Required
                        </span>
                    </div>
                    <div className="mt-2">
                        <Field
                            name="city"
                            id="city"
                            type="text"
                            className={errors.city && touched.city ? errorBorder : defaultInputBorder}
                        />
                        <ErrorMessage name="city" component="div" className="mt-2 text-sm text-red-600" />
                    </div>
                </div>
                <div>
                    <label htmlFor="country" className="block text-sm font-medium leading-6 text-gray-900">
                        Country
                    </label>
                    <div className="mt-2">
                        <Field
                            name="country"
                            id="country"
                            as="select"
                            className={defaultInputBorder}
                            disabled
                        >
                            <option>United Kingdom</option>
                        </Field>
                    </div>
                </div>
                <div>
                    <div className="flex justify-between">
                        <label htmlFor="postcode" className="block text-sm font-medium leading-6 text-gray-900">
                            Postcode
                        </label>
                        <span id="postcode_required" className="text-sm leading-6 text-gray-500">
                            Required
                        </span>
                    </div>
                    <div className="mt-2">
                        <Field
                            name="postcode"
                            id="postcode"
                            type="text"
                            className={errors.postcode && touched.postcode ? errorBorder : defaultInputBorder}
                        />
                        <ErrorMessage name="postcode" component="div" className="mt-2 text-sm text-red-600" />
                    </div>
                </div>

                <div className="flex flex-row gap-4 justify-between">
                    <div>
                        <div className="flex justify-between">
                            <label htmlFor="latitude" className="block text-sm font-medium leading-6 text-gray-900">
                                Latitude
                            </label>
                            <span id="latitude_required" className="text-sm leading-6 text-gray-500">
                                Required
                            </span>
                        </div>
                        <div className="mt-2">
                            <Field
                                name="latitude"
                                id="latitude"
                                type="number"
                                step="0.000001"
                                className={errors.latitude && touched.latitude ? errorBorder : defaultInputBorder}
                            />
                            <ErrorMessage name="latitude" component="div" className="mt-2 text-sm text-red-600" />
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between">
                            <label htmlFor="longitude" className="block text-sm font-medium leading-6 text-gray-900">
                                Longitude
                            </label>
                            <span id="longitude_required" className="text-sm leading-6 text-gray-500">
                                Required
                            </span>
                        </div>
                        <div className="mt-2">
                            <Field
                                name="longitude"
                                id="longitude"
                                type="number"
                                step="0.000001"
                                className={errors.longitude && touched.longitude ? errorBorder : defaultInputBorder}
                            />
                            <ErrorMessage name="longitude" component="div" className="mt-2 text-sm text-red-600" />
                        </div>
                    </div>
                </div>
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                    <button
                        type="submit"
                        className={cn(
                            "inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm sm:col-start-2",
                            isValid && dirty && !isSubmitting
                                ? "bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                : "bg-indigo-400 text-gray-200 cursor-not-allowed"
                        )}
                        disabled={!isValid || !dirty || isSubmitting}
                    >
                        {isSubmitting ? (
                            <ClipLoader color={"#ffffff"} size={20} />
                        ) : (
                            initialValues?.id != null ? "Update" : 'Create'
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
);

export default BuildingForm;
