import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { MyContext } from '../mycontext';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';

function Login() {
    const navigate = useNavigate();
    const { setLoggedInUser } = useContext(MyContext);

    const formSchema = yup.object().shape({
        employee_login: yup.string().required('Employee login is required'),
        employee_password: yup.string().required('Password is required'),
    });

    const formik = useFormik({
        initialValues: {
            employee_login: '',
            employee_password: '',
        },
        validationSchema: formSchema,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                const response = await fetch('http://127.0.0.1:5555/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(values),
                });

                const data = await response.json();

                if (response.ok) {
                    setLoggedInUser(data);
                    toast.success('Login successful!');
                    navigate('/customer_form');
                } else {
                    toast.error(data.error || 'Login failed');
                }
            } catch (error) {
                console.error("Error logging in:", error);
                toast.error('An error occurred. Please try again.');
            } finally {
                setSubmitting(false);
            }
        }
    });

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center font-sans">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center tracking-heading-normal">Employee Login</h1>
                <form onSubmit={formik.handleSubmit} className="space-y-6">
                    <div>
                        <label
                            htmlFor="employee_login"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Employee Login
                        </label>
                        <input
                            id="employee_login"
                            name="employee_login"
                            type="text"
                            autoComplete="username"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.employee_login}
                            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                                formik.touched.employee_login && formik.errors.employee_login ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {formik.touched.employee_login && formik.errors.employee_login && (
                            <p className="mt-2 text-sm text-red-600">{formik.errors.employee_login}</p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="employee_password"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Password
                        </label>
                        <input
                            id="employee_password"
                            name="employee_password"
                            type="password"
                            autoComplete="current-password"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.employee_password}
                            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                                formik.touched.employee_password && formik.errors.employee_password ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {formik.touched.employee_password && formik.errors.employee_password && (
                            <p className="mt-2 text-sm text-red-600">{formik.errors.employee_password}</p>
                        )}
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={formik.isSubmitting}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
                        >
                            {formik.isSubmitting ? 'Logging in...' : 'Login'}
                        </button>
                    </div>
                </form>
                <div className="mt-6 text-center">
                    <button
                        onClick={() => navigate('/create_employee')}
                        className="font-medium text-blue-600 hover:text-blue-500"
                    >
                        Create a new account
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Login;