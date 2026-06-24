import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function EditQueuePage() {
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [queueCustomers, setQueueCustomers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchQueue();
        const interval = setInterval(fetchQueue, 5000); // Refresh every 5 seconds
        return () => clearInterval(interval);
    }, []);

    const fetchQueue = () => {
        fetch('http://127.0.0.1:5555/queue')
            .then(resp => resp.json())
            .then(data => {
                const sortedData = data.sort((a, b) => a.queue_position - b.queue_position);
                setQueueCustomers(sortedData);
            })
            .catch(error => {
                console.error('Error fetching queue:', error)
                // toast.error('Failed to fetch queue.');
            });
    };

    const handleSelectCustomer = (customer) => {
        setSelectedCustomer(customer);
    };

    const handleAction = (action) => {
        if (!selectedCustomer) {
            toast.warn('Please select a customer first.');
            return;
        }

        let url = `http://127.0.0.1:5555/queue/move-${action}/${selectedCustomer.id}`;
        let method = 'PUT';

        if (action === 'remove') {
            url = `http://127.0.0.1:5555/queue/${selectedCustomer.id}`;
            method = 'DELETE';
        }

        fetch(url, { method })
            .then(response => response.json())
            .then(data => {
                if (data.success || data.message) {
                    toast.success(`Customer ${action}d successfully.`);
                    fetchQueue();
                    if(action === 'remove') {
                        setSelectedCustomer(null);
                    }
                } else {
                    toast.error(data.error || `Error ${action}ing customer.`);
                }
            })
            .catch(error => {
                console.error(`Error ${action}ing customer:`, error);
                toast.error(`Error ${action}ing customer.`);
                fetchQueue();
            });
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Waiting Queue</h2>
            <div className="mb-4">
                <ul className="divide-y divide-gray-200 h-64 overflow-y-auto">
                    {queueCustomers.map((customer, index) => (
                        <li
                            key={customer.id}
                            className={`p-3 flex items-center justify-between cursor-pointer transition-colors duration-200 ${selectedCustomer && selectedCustomer.id === customer.id ? 'bg-blue-100' : 'hover:bg-gray-50'}`}
                            onClick={() => handleSelectCustomer(customer)}
                        >
                            <div className="flex items-center">
                                <span className="text-md font-medium text-gray-700 mr-3">{index + 1}.</span>
                                <span className="text-md text-gray-800">{customer.customers ? customer.customers.first_last_name : '...'}</span>
                            </div>
                            {selectedCustomer && selectedCustomer.id === customer.id && (
                                <span className="text-blue-500 font-semibold text-sm">Selected</span>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="flex justify-center space-x-2">
                <button onClick={() => handleAction('up')} className="px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600">
                    Move Up
                </button>
                <button onClick={() => handleAction('down')} className="px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600">
                    Move Down
                </button>
                <button onClick={() => handleAction('remove')} className="px-4 py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600">
                    Remove
                </button>
            </div>
        </div>
    );
}

export default EditQueuePage;