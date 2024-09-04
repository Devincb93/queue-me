import React, {useContext, useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom'
import { MyContext } from '../mycontext'
import { ToastContainer, toast } from 'react-toastify';

function EditQueuePage() {
    
    const [ selectedCustomer, setSelectedCustomer] = useState(null);
    const [queueCustomers, setQueueCustomers] = useState([])
    const navigate = useNavigate()
    

    useEffect(() => {
        fetchQueue();
    }, [navigate]);
    
    const fetchQueue = () => {
        fetch('http://127.0.0.1:5555/queue')
            .then(resp => resp.json())
            .then(data => {
                const sortedData = data.sort((a, b) => a.queue_position - b.queue_position);
                setQueueCustomers(data);
                console.log("the sorted data", queueCustomers)
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
            const updatedqueue = queueCustomers.filter(customer => customer.id !== selectedCustomer.id);
            setQueueCustomers(updatedqueue); 

            fetch(`http://127.0.0.1:5555/queue/${selectedCustomer.id}`,
                 { method: 'DELETE' })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        setSelectedCustomer(null); 
                    } else {
                        console.log("There was some error deleting")
                    }
                })
                .catch(error => console.error('Error:', error));
        }
    };

    const handleMoveUp = () => {
        if (selectedCustomer) {
            console.log("this is the customer id for moving up", selectedCustomer.id)
            fetch(`http://127.0.0.1:5555/queue/move-up/${selectedCustomer.id}`, { method: 'PUT' })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    fetchQueue();  
                } else {
                    alert(data.error || 'Error moving customer up in the queue.');
                }
            })
            .catch(error => console.error('Error moving customer up:', error));
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
                    body: JSON.stringify({ id: index + 1 }),
                })
                .then(response => response.json())
                .then(data => {
                    if (!data.success) {
                        alert('Error moving customer down in the queue.');
                       
                        fetchQueue();
                    }
                })
                .catch(error => {
                    console.error('Error moving customer down:', error);
                    
                    fetchQueue();
                });
            }
        }
    };
    console.log("customers should be here queue",queueCustomers )


    
    return (
        <div className='text-center'>
            <h1 className='text-center top-12 left-64 grid items-center'>Queue</h1>
            <ul>
                {queueCustomers.map(customer => (
                    <li className='bg-pink-400 m-1 w-80 h-7 items-center text-center hover:bg-pink-500' key={customer.id} onClick={() => handleSelectCustomer(customer)}>
                        {customer.first_last_name}
                    </li>
                ))}
            </ul>
            <button onClick={()=>{handleMoveUp()}} className='m-1 bg-pink-400 hover:bg-pink-600 rounded-md w-16'>Up</button>
            <button onClick={()=>{handleMoveDown()}} className='m-1 bg-pink-400 hover:bg-pink-600 rounded-md w-16'>Down</button>
            <button onClick={()=>{navigate('/customer_form')}}>Go Back</button>
            {/* {selectedCustomer && (
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
            <ToastContainer /> */}
        </div>
    );
}

export default EditQueuePage