// External libraries
import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/20/solid';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { useNavigate } from 'react-router-dom';

// Internal
import api from '../../api/apiConfig';
import { useAuth } from '../../hooks/data/useAuth';
import { useLoading } from '../../contexts/LoadingContext';

const defaultInputBorder = "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
const errorBorder = "block w-full rounded-md border-0 py-1.5 pr-10 text-red-900 ring-1 ring-inset ring-red-300 placeholder:text-red-300 focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm sm:leading-6";

const RegistrationForm = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { showLoading, hideLoading } = useLoading();

  const [buildings, setBuildings] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchBuildingsForSelect()
  }, []);

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .required('Username is required')
      .max(150, 'Username must be 150 characters or less'),
    firstname: Yup.string()
      .required('First name is required')
      .max(150, 'First name must be 150 characters or less'),
    lastname: Yup.string()
      .required('Last name is required')
      .max(150, 'Last name must be 150 characters or less'),
    email: Yup.string()
      .required('Email is required')
      .matches(
        /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
        'Invalid email address'
      ),
    password1: Yup.string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters long')
      .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
      .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .matches(/\d/, 'Password must contain at least one digit')
      .matches(/[@$!%*?&]/, 'Password must contain at least one special character'),
    password2: Yup.string()
      .required('Please confirm your password')
      .oneOf([Yup.ref('password1')], 'Passwords must match'),
    buildingId: Yup.number().required('Building is required').nullable(),
  });

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      const userData = {
        username: values.username,
        email: values.email,
        password: values.password1,
        password2: values.password2,
        first_name: values.firstname,
        last_name: values.lastname,
        building_ids: [values.buildingId],
      };

      const response = await register(userData);

      if (response) {
        setDialogOpen(true); 
      }
    } catch (error) {
      if (error.response && error.response.data) {
        const errorData = error.response.data?.details;
        Object.entries(errorData).forEach(([key, value]) => {
          switch (key) {
            case 'username':
              setFieldError('username', value[0]);
              break;
            case 'email':
              setFieldError('email', value[0]);
              break;
            case 'password':
              setFieldError('password1', value[0]);
              break;
            case 'first_name':
              setFieldError('first_name', value[0]);
              break;
            case 'last_name':
              setFieldError('last_name', value[0]);
              break;
            case 'building_ids':
              setFieldError('buildingId', 'The selected building no longer exists');
              break;
            case 'password2':
              setFieldError('password2', value[0]);
              break;
            default:
              console.warn(`Unhandled error field: ${key}`);
          }
        });
      } else {
        console.error('An unexpected error occurred', error);
      }
    } finally {
      setSubmitting(false);
    }
  };


  const fetchBuildingsForSelect = async () => {
    showLoading('Fetching Registration Buildings...')
    try {
      var response = await api.get('buildings/registration_list/');
      if (response.data.length == 0) {
        navigate('/unavailable');
      } else {
        setBuildings(response.data);
      }
    } catch (e) {
      navigate('/unavailable');
    } finally {
      hideLoading();
    }
  }

  const onDialogClose = () => {
    return null;
  }

  return (
    <>
      <Dialog open={dialogOpen} onClose={onDialogClose} className="relative z-10">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-sm sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
              <div>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <CheckIcon aria-hidden="true" className="h-6 w-6 text-green-600" />
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <DialogTitle as="h3" className="text-base font-semibold leading-6 text-gray-900">
                    Account created!
                  </DialogTitle>
                </div>
              </div>
              <div className="mt-5 sm:mt-6">
                <Link
                  to="/login"
                  className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Return to Login
                </Link>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
      <div className="h-screen w-screen bg-zinc-100">
        <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
            <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
              <h2 className="mt-2 text-left text-2xl font-bold leading-9 tracking-tight text-gray-900 py-4">
                Register an Account
              </h2>
              <Formik
                initialValues={{
                  username: '',
                  firstname: '',
                  lastname: '',
                  email: '',
                  password1: '',
                  password2: '',
                  buildingId: '',
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting, errors, touched, setFieldValue }) => (
                  <Form className="space-y-6">
                    <div>
                      <label
                        htmlFor="username"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Username
                      </label>
                      <div className="mt-2">
                        <Field
                          id="username"
                          name="username"
                          type="text"
                          autoComplete="username"
                          className={touched.username && errors.username ? errorBorder : defaultInputBorder}
                        />
                        <ErrorMessage
                          name="username"
                          component="div"
                          className="text-red-600 text-sm mt-1"
                        />
                      </div>
                    </div>
                    <div className="flex space-x-4">
                      <div className="w-1/2">
                        <label
                          htmlFor="firstname"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          First Name
                        </label>
                        <div className="mt-2">
                          <Field
                            id="firstname"
                            name="firstname"
                            type="text"
                            className={touched.firstname && errors.firstname ? errorBorder : defaultInputBorder}
                          />
                          <ErrorMessage
                            name="firstname"
                            component="div"
                            className="text-red-600 text-sm mt-1"
                          />
                        </div>
                      </div>

                      <div className="w-1/2">
                        <label
                          htmlFor="lastname"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Last Name
                        </label>
                        <div className="mt-2">
                          <Field
                            id="lastname"
                            name="lastname"
                            type="text"
                            className={touched.lastname && errors.lastname ? errorBorder : defaultInputBorder}
                          />
                          <ErrorMessage
                            name="lastname"
                            component="div"
                            className="text-red-600 text-sm mt-1"
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Email address
                      </label>
                      <div className="mt-2">
                        <Field
                          id="email"
                          name="email"
                          type="email"
                          className={touched.email && errors.email ? errorBorder : defaultInputBorder}
                        />
                        <ErrorMessage
                          name="email"
                          component="div"
                          className="text-red-600 text-sm mt-1"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium leading-6 text-gray-900">
                        Building
                      </label>
                      <Field name="buildingId">
                        {({ field }) => (
                          <Listbox
                            value={field.value}
                            onChange={(value) => setFieldValue('buildingId', value)}
                          >
                            <div className="relative mt-2 w-full">
                              <ListboxButton className={
                                touched.buildingId && errors.buildingId ? errorBorder : defaultInputBorder}>
                                <span className={"block truncate" && field.value == '' ? "opacity-80" : ''}>
                                  {field.value ? buildings.find(b => b.id === field.value)?.name : '-Select your Building-'}
                                </span>
                                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                  <ChevronDownIcon aria-hidden="true" className="h-5 w-5 text-gray-400" />
                                </span>
                              </ListboxButton>
                              <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                {buildings.map((building) => (
                                  <ListboxOption
                                    key={building.id}
                                    value={building.id}
                                    className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white"
                                  >
                                    <span className="block truncate font-normal group-data-[selected]:font-semibold">
                                      {building.name}
                                    </span>
                                    {field.value === building.id && (
                                      <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600 group-data-[focus]:text-white">
                                        <CheckIcon aria-hidden="true" className="h-5 w-5" />
                                      </span>
                                    )}
                                  </ListboxOption>
                                ))}
                              </ListboxOptions>
                            </div>
                          </Listbox>
                        )}
                      </Field>
                      <ErrorMessage
                        name="buildingId"
                        component="div"
                        className="text-red-600 text-sm mt-1"
                      />
                    </div>
                    <div className="flex space-x-4">
                      <div className="w-1/2">
                        <label
                          htmlFor="password1"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Password
                        </label>
                        <div className="mt-2">
                          <Field
                            id="password1"
                            name="password1"
                            type="password"
                            autoComplete="new-password"
                            className={touched.password1 && errors.password1 ? errorBorder : defaultInputBorder}
                          />
                          <ErrorMessage
                            name="password1"
                            component="div"
                            className="text-red-600 text-sm mt-1"
                          />
                        </div>
                      </div>

                      <div className="w-1/2">
                        <label
                          htmlFor="password2"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Confirm Password
                        </label>
                        <div className="mt-2">
                          <Field
                            id="password2"
                            name="password2"
                            type="password"
                            autoComplete="new-password"
                            className={touched.password2 && errors.password2 ? errorBorder : defaultInputBorder}
                          />
                          <ErrorMessage
                            name="password2"
                            component="div"
                            className="text-red-600 text-sm mt-1"
                          />
                        </div>

                      </div>
                    </div>

                    <div>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        {isSubmitting ? 'Submitting...' : 'Register'}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
              <p className="mt-10 text-center text-sm text-gray-500">
                Already have an account?{' '}
                <Link to="/login" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegistrationForm;
