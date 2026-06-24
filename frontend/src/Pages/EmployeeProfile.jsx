import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { MyContext } from '../mycontext';
import { toast } from 'react-toastify';

function EmployeeProfile() {
    const { loggedInUser, setLoggedInUser } = useContext(MyContext);
    const navigate = useNavigate();

    const formSchema = yup.object().shape({
        employee_login: yup.string(),
        employee_password: yup.string().min(6, 'Password must be at least 6 characters'),
    });

    const formik = useFormik({
        initialValues: {
            employee_login: loggedInUser?.employee_login || '',
            employee_password: '',
        },
        validationSchema: formSchema,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                const response = await fetch(`http://127.0.0.1:5555/employee/${loggedInUser.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(values),
                });
                
                const data = await response.json();

                if (response.ok) {
                    setLoggedInUser(data);
                    toast.success('Profile updated successfully!');
                    navigate('/customer_form');
                } else {
                    toast.error(data.error || 'Error updating profile');
                }
            } catch (error) {
                console.error("Error updating profile:", error);
                toast.error('An error occurred. Please try again.');
            } finally {
                setSubmitting(false);
            }
        },
    });

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            try {
                const response = await fetch(`http://127.0.0.1:5555/employee/${loggedInUser.id}`, {
                    method: "DELETE",
                });

                if (response.ok) {
                    toast.success("Account deleted successfully.");
                    setLoggedInUser(null);
                    navigate('/');
                } else {
                    const data = await response.json();
                    toast.error(data.message || 'Error deleting account');
                }
            } catch (error) {
                console.error("Error deleting user:", error);
                toast.error('An error occurred. Please try again.');
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Your Profile</h1>
                <form onSubmit={formik.handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="employee_login" className="block text-sm font-medium text-gray-700">
                            Employee Login
                        </label>
                        <input
                            id="employee_login"
                            name="employee_login"
                            type="text"
                            {...formik.getFieldProps('employee_login')}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                        />
                        {formik.touched.employee_login && formik.errors.employee_login && (
                            <p className="mt-2 text-sm text-red-600">{formik.errors.employee_login}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="employee_password" className="block text-sm font-medium text-gray-700">
                            New Password
                        </label>
                        <input
                            id="employee_password"
                            name="employee_password"
                            type="password"
                            {...formik.getFieldProps('employee_password')}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                        />
                        {formik.touched.employee_password && formik.errors.employee_password && (
                            <p className="mt-2 text-sm text-red-600">{formik.errors.employee_password}</p>
                        )}
                    </div>

                    <div className="flex space-x-4">
                        <button
                            type="submit"
                            disabled={formik.isSubmitting}
                            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            {formik.isSubmitting ? 'Updating...' : 'Update Profile'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/customer_form')}
                            className="w-full py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                        >
                            Back
                        </button>
                    </div>
                </form>
                <div className="mt-6 border-t pt-6">
                    <button
                        onClick={handleDelete}
                        className="w-full py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                        Delete Account
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EmployeeProfile;