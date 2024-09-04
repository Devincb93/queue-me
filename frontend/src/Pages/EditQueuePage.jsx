import React, {useContext, useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom'
import { MyContext } from '../mycontext'
import { ToastContainer, toast } from 'react-toastify';

function EditQueuePage() {
    
    const [ selectedCustomer, setSelectedCustomer] = useState(null);
    const [queueCustomers, setQueueCustomers] = useState([])
    

    useEffect(() => {
        fetchQueue();
    }, []);
    
    const fetchQueue = () => {
        fetch('http://127.0.0.1:5555/queue')
            .then(resp => resp.json())
            .then(data => {
                const sortedData = data.sort((a, b) => a.queue_position - b.queue_position);
                setQueueCustomers(sortedData);
            })
            .catch(error => console.error('Error fetching queue:', error));
    };
    const handleSelectCustomer = (customer) => {
        setSelectedCustomer(customer);
        console.log(customer)
    };

    const handleSendNotification = () => {
        if (selectedCustomer) {
            fetch('http://127.0.0.1:5555/send_notification', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phone_number: selectedCustomer.phone_number,
                    message_body: notificationMessage
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    toast.success('Notification sent successfully!');
                } else {
                    toast.error('Failed to send notification');
                }
            })
            .catch(error => {
                console.error('Error sending notification:', error);
                toast.error('Failed to send notification');
            });
        }
    };


    const handleRemove = () => {
        if (selectedCustomer) {
            const updatedRooms = queueCustomers.filter(customer => customer.id !== selectedCustomer.id);
            setQueueCustomers(updatedRooms); // Update state in parent component

            // Send a DELETE request to the backend to remove the customer from the queue
            fetch(`http://127.0.0.1:5555/queue/${selectedCustomer.id}`,
                 { method: 'DELETE' })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        setSelectedCustomer(null); // Clear selection after removal
                    } else {
                        console.log("There was some error deleting")
                    }
                })
                .catch(error => console.error('Error:', error));
        }
    };

    const handleMoveUp = () => {
        if (selectedCustomer) {
            const index = queueCustomers.findIndex(customer => customer.id === selectedCustomer.id);
            if (index > 0) {
                const updatedQueues = [...queueCustomers];
                [updatedQueues[index - 1], updatedQueues[index]] = [updatedQueues[index], updatedQueues[index - 1]];
                setQueueCustomers(updatedQueues);
    
                fetch(`http://127.0.0.1:5555/queue/move-up/${selectedCustomer.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ newPosition: index - 1 }),
                })
                .then(response => response.json())
                .then(data => {
                    if (!data.success) {
                        alert('Error moving customer up in the queue.');
                        // Revert the local state if the update failed
                        fetchQueue();
                    }
                })
                .catch(error => {
                    console.error('Error moving customer up:', error);
                    // Revert the local state if there was an error
                    fetchQueue();
                });
            }
        }
    };
    
    const handleMoveDown = () => {
        if (selectedCustomer) {
            const index = queueCustomers.findIndex(customer => customer.id === selectedCustomer.id);
            if (index < queueCustomers.length - 1) {
                const updatedQueues = [...queueCustomers];
                [updatedQueues[index + 1], updatedQueues[index]] = [updatedQueues[index], updatedQueues[index + 1]];
                setQueueCustomers(updatedQueues);
    
                fetch(`http://127.0.0.1:5555/queue/move-down/${selectedCustomer.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ newPosition: index + 1 }),
                })
                .then(response => response.json())
                .then(data => {
                    if (!data.success) {
                        alert('Error moving customer down in the queue.');
                        // Revert the local state if the update failed
                        fetchQueue();
                    }
                })
                .catch(error => {
                    console.error('Error moving customer down:', error);
                    // Revert the local state if there was an error
                    fetchQueue();
                });
            }
        }
    };
    console.log("customers should be here queue",queueCustomers )


    const navigate = useNavigate()
    return (
        <div className='text-center'>
            <h1 className='text-center top-12 left-64'>Queue</h1>
            <ul>
                {queueCustomers.map(customer => (
                    <li key={customer.id} onClick={() => handleSelectCustomer(customer)}>
                        {customer.first_last_name}
                    </li>
                ))}
            </ul>
            {selectedCustomer && (
                <div>
                    <h2>Selected Customer: {selectedCustomer.first_last_name}</h2>
                    <button onClick={handleRemove}>Remove</button>
                    <button onClick={handleMoveUp}>Move Up</button>
                    <button onClick={handleMoveDown}>Move Down</button>
                    <input 
                        type='text' 
                        value={notificationMessage} 
                        onChange={(e) => setNotificationMessage(e.target.value)} 
                        placeholder='Enter notification message' 
                    />
                    <button onClick={handleSendNotification}>Send Notification</button>
                </div>
            )}
            <ToastContainer />
        </div>
    );
}

export default EditQueuePage