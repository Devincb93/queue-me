import React from 'react'
import DressingRooms from './DressingRooms'
import { useNavigate } from 'react-router-dom'

function CustomerForm() {

    const navigate = useNavigate()
    return (
        <div>
        <input placeholder='First and Last name'></input>
        <button>Add to Q</button>
        <button onClick={() => navigate('/queue')}>Edit the Q</button>
        <div>
            <h1>DressingRooms</h1>
            <DressingRooms/>
        </div>
        </div>
    )
}

export default CustomerForm