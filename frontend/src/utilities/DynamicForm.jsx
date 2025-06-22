// External libraries
import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import ClipLoader from 'react-spinners/ClipLoader';

// Internal
const defaultInputBorder = "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6";
const errorBorder = "block w-full rounded-md border-0 py-1.5 pr-10 text-red-900 ring-1 ring-inset ring-red-300 placeholder:text-red-300 focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm sm:leading-6";

const DynamicForm = ({ fields, initialValues, validationSchema, onSubmit, loading, actionText }) => (
    <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values, actions) => {
            onSubmit(values, actions);
        }}
    >
        {({ isSubmitting, errors, touched }) => (
            <Form>
            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
                {fields.map((field) => (
                    <div key={field.name} className={`${field.span === 'full' ? "col-span-full" : field.span === 'half' ? "sm:col-span-3" : "sm:col-span-4"} ${field.disabled ? "opacity-80" : ""}`}>
                        <label htmlFor={field.name} className="block text-sm font-medium leading-6 text-black">
                            {field.label}
                        </label>
                        <div className="mt-2">
                            <Field
                                disabled={field.disabled}
                                id={field.name}
                                name={field.name}
                                type={field.type}
                                className={touched[field.name] && errors[field.name] ? errorBorder : defaultInputBorder}
                            />
                            <ErrorMessage name={field.name} component="div" className="text-red-600 text-sm mt-1" />
                        </div>
                    </div>
                ))}
                <div className="mt-8 flex">
                    <button
                        type="submit"
                        className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                        disabled={isSubmitting || loading}
                    >
                        {isSubmitting || loading ? <ClipLoader color="#fff" size={24} /> : actionText}
                    </button>
                </div>
                </div>
            </Form>
        )}
    </Formik>
);

export default DynamicForm;
