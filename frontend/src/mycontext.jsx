import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import Login from './Pages/Login';

const MyContext = React.createContext();

const MyProvider = (props) =>{
    const navigate = useNavigate()
    const [loggedInUser, setLoggedInUser] = useState({})
    const [newEmployee, setNewEmployee] = useState({})
    const [allCustomers, setAllCustomers] = useState([])

    useEffect(() => {
        
        const checkSession = async () => {
            const token = localStorage.getItem('userToken');
            if (token) {
                try {
                    const response = await fetch('/check_session', {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    const data = await response.json();
                    if (data.logged_in) {
                        setIsLoggedIn(true)
                        
                        
                    } else {
                        localStorage.removeItem('userToken');
                        navigate('/login');
                    }
                } catch (error) {
                    console.error('Error checking session:', error);
                    localStorage.removeItem('userToken');
                    navigate('/');
                }
            } else {
                navigate('/');
            }
        };

        checkSession();
        
    }, [Login]);

  const handleLogout = async () => {
    try {
        await fetch('http://localhost:5555/logout', {
            method: 'POST',
            credentials: 'include', // Include cookies in the request if using cookie-based sessions
        });

        sessionStorage.clear();
        setLoggedInUser({})
        navigate('/');
    } catch (error) {
        console.error('Error logging out:', error);
        alert('An error occurred while logging out. Please try again.');
    }
};

const fetchCustomersForQueue = () => {
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
    }



const addToQueue = async (values) => {
    try {
        console.log("attempting to add to official queue", values)
        const response = await fetch('http://127.0.0.1:5555/queue', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
    
            body: JSON.stringify({ 
                customer_id: values.id,

             }),
        });

        if (response.ok) {
            console.log('Customers added to queue');
        } else {
            console.error('Failed to add customers to queue');
        }
    } catch (error) {
        console.error('Error adding customers to queue:', error);
    }
};

useEffect(()=> {
    fetchCustomersForQueue()
    
}, [setAllCustomers])

    

    return (
        <MyContext.Provider
          value={{
           setLoggedInUser,
           loggedInUser,
           newEmployee,
           setNewEmployee,
           handleLogout,
           fetchCustomersForQueue,
           allCustomers,
           setAllCustomers, 
           addToQueue
          }}
        >
          {props.children}
        </MyContext.Provider>
      );

}
const MyConsumer = MyContext.Consumer;

export { MyProvider, MyConsumer, MyContext };