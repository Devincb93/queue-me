import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

const MyContext = React.createContext();

const MyProvider = (props) =>{
    const navigate = useNavigate()
    const [loggedInUser, setLoggedInUser] = useState({})
    const [newEmployee, setNewEmployee] = useState({})


    useEffect(() => {
      // Check session status on mount
      const checkSession = async () => {
          try {
              const response = await fetch('http://localhost:5555/check_session', {
                  method: 'GET',
                  credentials: 'include',
              });
              if (response.ok) {
                  const data = await response.json();
                  setLoggedInUser(data.employee_login);
              }
          } catch (error) {
              console.error('Error checking session:', error);
          }
      };
      checkSession();
  }, []);

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
    

    return (
        <MyContext.Provider
          value={{
           setLoggedInUser,
           loggedInUser,
           newEmployee,
           setNewEmployee,
           handleLogout
          }}
        >
          {props.children}
        </MyContext.Provider>
      );

}
const MyConsumer = MyContext.Consumer;

export { MyProvider, MyConsumer, MyContext };