import React from 'react'
import { useNavigate } from 'react-router-dom'

function EditQueuePage() {
    const navigate = useNavigate()
    return(
        <div>
            <h1>Queue</h1>
            <ul>
                <div>
                <li>User1</li>
                <button>Remove</button>
                <button>Move up</button>
                <button>Move down</button>
                </div>
            </ul>
            <button onClick={()=> navigate('/customer_form')}>Go back</button>
        </div>
    )
}

export default EditQueuePage