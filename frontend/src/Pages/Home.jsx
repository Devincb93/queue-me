import React, { useContext, useEffect} from 'react'
import Login from './Login'
import { MyContext } from '../mycontext';
import { useNavigate } from 'react-router-dom';

function Home() {

    const { setLoggedInUser, loggedInUser, checkSession} = useContext(MyContext)
    const navigate = useNavigate()

    
  

    


    return (
        <div className=''>
            <div className=''>
            <Login/>
            </div>
        </div>
    )
} 

export default Home