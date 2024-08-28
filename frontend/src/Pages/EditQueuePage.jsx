import React, {useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom'

function EditQueuePage() {
    const [allCustomers, setAllCustomers] = useState([])

    useEffect(() => {
        fetch('/customers')
            .then(resp => {
                if (!resp.ok) {
                    throw new Error(`HTTP error! status: ${resp.status}`);
                }
                return resp.json();
            })
            .then(data => {
                setAllCustomers(data);
                console.log(data);
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    }, []);

    console.log("customers should be here", allCustomers)

    const navigate = useNavigate()
    return(
        <div>
            <h1 className=''>Queue</h1>
            <ul>
                <div>
                    <div>
                        {allCustomers.map(customer => (
                            <div key={customer.id}>
                                <h1>{customer.first_last_name}</h1>
                            </div>
                        ))}
                    </div>
                <li className='mb-6'>User1</li>
                <button className='bg-pink-400 rounded-lg w-16 hover:bg-pink-600'>Remove</button>
                <button className='bg-pink-400 rounded-lg w-16 hover:bg-pink-600'>up</button>
                <button className='bg-pink-400 rounded-lg w-16 hover:bg-pink-600'>down</button>
                </div>
            </ul>
            <button className='bg-pink-400 rounded-lg w-16 mt-4 hover:bg-pink-600' onClick={()=> navigate('/customer_form')}>Go back</button>
        </div>
    )
}

export default EditQueuePage