import React from 'react'
import { useNavigate } from 'react-router-dom'

function Login() {

    const navigate = useNavigate()
    return (
        <div className='bg-blue-500'>
            <input placeholder='Employee Login'></input>
            <input placeholder='Password'></input>
            <button onClick={() => navigate('/customer_form')}>Login</button>
        </div>
    )
}

export default Login