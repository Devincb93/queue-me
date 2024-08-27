import React from 'react'
import { useNavigate } from 'react-router-dom'

function Login() {

    const navigate = useNavigate()
    return (
        <div className=''>
            <input placeholder='Employee Login'></input>
            <input placeholder='Password'></input>
            <button className='' onClick={() => navigate('/customer_form')}>Login</button>
        </div>
    )
}

export default Login