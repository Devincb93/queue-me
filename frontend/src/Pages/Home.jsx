import React, { useContext, useEffect} from 'react'
import Login from './Login'
import { MyContext } from '../mycontext';
import { useNavigate } from 'react-router-dom';

function Home() {

    const { setLoggedInUser, loggedInUser, checkSession} = useContext(MyContext)
    const navigate = useNavigate()

    
  

    


    return (
        <div className='flex flex-col items-center'>
            <div className='text-center'>
            <Login/>
            
            </div>
        </div>
    )
} 

export default Home