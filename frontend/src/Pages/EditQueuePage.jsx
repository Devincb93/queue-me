import React, {useContext, useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom'
import { MyContext } from '../mycontext'

function EditQueuePage() {
    
    const { fetchCustomersForQueue, allCustomers } = useContext(MyContext)

    

    console.log("customers should be here", allCustomers)
    

    const navigate = useNavigate()
    return(
        <div className='text-center'>
            <h1 className=' text-center top-12 left-64'>Queue</h1>
            <ul>
                <div className='justify-center'>
                    <div className='flex flex-col items-center'>
                        {allCustomers.map(customer => (
                            <div className=' text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-sm w-32 m-1 ' key={customer.id}>
                                <h1 className='text-center'>{customer.first_last_name}</h1>
                            </div>
                        ))}
                    </div>
                
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