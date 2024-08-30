import React, { useContext } from 'react'
import DressingRooms from './DressingRooms'
import { useNavigate } from 'react-router-dom'
import { MyContext } from '../mycontext'

function CustomerForm() {

    const navigate = useNavigate()
    const { handleLogout } = useContext(MyContext)
    return (
        <div>
        <input className='rounded-lg bg-pink-50 shadow-2xl' placeholder='First and Last name'></input>
        <button className='bg-pink-400 text-white rounded-lg w-24 shadow-black hover:bg-pink-600'>Add to Q</button>
        <button className='bg-pink-400 text-white rounded-lg w-24 hover:bg-pink-600' onClick={() => navigate('/queue')}>Edit the Q</button>
        <button className='bg-pink-400 text-white rounded-lg w-24 hover:bg-pink-600 ml-72 fixed' onClick={() => handleLogout()}>Logout</button>
        <div>
            <DressingRooms/>
        </div>
        </div>
    )
}

export default CustomerForm