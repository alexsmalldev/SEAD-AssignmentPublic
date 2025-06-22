// External libraries
import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import ClipLoader from 'react-spinners/ClipLoader';
import { CheckBadgeIcon } from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';

// Internal
import { useAuth } from '../../hooks/data/useAuth';

const defaultInputBorder =
  'block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6';
const errorBorder =
  'block w-full rounded-md border-0 py-1.5 text-red-900 ring-1 ring-inset ring-red-300 placeholder:text-red-300 focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm sm:leading-6';

const LoginForm = () => {
  const { login } = useAuth();

  const validationSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required'),
  });

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      await login(values);
    } catch (error) {
      setFieldError('password', 'Invalid credentials');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="h-screen w-screen bg-zinc-100">
      <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
            <div className="flex flex-row justify-center items-center">
              <CheckBadgeIcon aria-hidden="true" className="h-6 w-6 text-indigo-400" />
              <label className="group flex gap-x-3 rounded-md p-2 text-base font-semibold leading-6">FacilityCare</label>
            </div>
            <div className="pt-8 pb-4">
              <h2 className="text-left text-xl font-bold leading-9 tracking-tight text-gray-900">
                Sign in to your account
              </h2>
            </div>


            <Formik
              initialValues={{ username: '', password: '' }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, errors, touched }) => (
                <Form className="space-y-6">
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
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
                      <ErrorMessage name="username" component="div" className="text-red-600 text-sm mt-1" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                      Password
                    </label>
                    <div className="mt-2">
                      <Field
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        className={touched.password && errors.password ? errorBorder : defaultInputBorder}
                      />
                      <ErrorMessage name="password" component="div" className="text-red-600 text-sm mt-1" />
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      {isSubmitting  ? <ClipLoader color="#fff" size={24} /> : 'Sign in'}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
            <p className="mt-10 text-center text-sm text-gray-500">
              New to FacilityCare?{' '}
              <Link to="/register" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                Register Now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
