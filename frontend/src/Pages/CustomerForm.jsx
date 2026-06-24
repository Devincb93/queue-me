import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { MyContext } from '../mycontext';
import { toast } from 'react-toastify';
import DressingRooms from './DressingRooms';
import EditQueuePage from './EditQueuePage';

function CustomerForm() {
    const navigate = useNavigate();
    const { handleLogout, loggedInUser, addToQueue } = useContext(MyContext);

    const formSchema = yup.object().shape({
        first_last_name: yup.string().required('First and last name are required'),
        phone_number: yup.string().required('Phone number is required'),
        email: yup.string().email('Invalid email format'),
    });

    const formik = useFormik({
        initialValues: {
            first_last_name: '',
            phone_number: '',
            email: '',
        },
        validationSchema: formSchema,
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            try {
                const response = await fetch('http://127.0.0.1:5555/customers', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(values),
                });
                
                const data = await response.json();

                if (response.ok) {
                    const queueResponse = await fetch('http://127.0.0.1:5555/add_queue', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ customer_id: data.id }),
                    });

                    if(queueResponse.ok) {
                        toast.success('Customer added to queue!');
                        resetForm();
                        // The queue will be updated automatically by the EditQueuePage component
                    } else {
                        const queueError = await queueResponse.json();
                        toast.error(queueError.error || 'Failed to add customer to queue.');
                    }
                } else {
                    toast.error(data.error || 'Failed to create customer.');
                }
            } catch (error) {
                console.error("Error creating customer:", error);
                toast.error('An error occurred. Please try again.');
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Welcome, {loggedInUser?.employee_login}
                    </h1>
                    <div>
                        <button
                            onClick={() => navigate('/employee_profile')}
                            className="mr-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        >
                            Profile
                        </button>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row lg:space-x-8">
                    {/* Left Column */}
                    <div className="lg:w-1/2">
                        {/* Add Customer Form */}
                        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Add Customer to Queue</h2>
                            <form onSubmit={formik.handleSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="first_last_name" className="block text-sm font-medium text-gray-700">Full Name</label>
                                    <input id="first_last_name" name="first_last_name" type="text" {...formik.getFieldProps('first_last_name')} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
                                    {formik.touched.first_last_name && formik.errors.first_last_name ? <div className="text-red-500 text-sm">{formik.errors.first_last_name}</div> : null}
                                </div>
                                <div>
                                    <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">Phone Number</label>
                                    <input id="phone_number" name="phone_number" type="text" {...formik.getFieldProps('phone_number')} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
                                    {formik.touched.phone_number && formik.errors.phone_number ? <div className="text-red-500 text-sm">{formik.errors.phone_number}</div> : null}
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email (Optional)</label>
                                    <input id="email" name="email" type="email" {...formik.getFieldProps('email')} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
                                    {formik.touched.email && formik.errors.email ? <div className="text-red-500 text-sm">{formik.errors.email}</div> : null}
                                </div>
                                <button type="submit" disabled={formik.isSubmitting} className="w-full py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600">
                                    {formik.isSubmitting ? 'Adding...' : 'Add to Queue'}
                                </button>
                            </form>
                        </div>
                        
                        {/* Queue */}
                        <EditQueuePage />
                    </div>

                    {/* Right Column */}
                    <div className="lg:w-1/2">
                        <DressingRooms />
                    </div>
                </div>
            </main>
        </div>
    );
}

export default CustomerForm;