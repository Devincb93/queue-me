import React, { useContext, useEffect, useState } from 'react';
import { Routes, Route, Outlet } from "react-router-dom";
import Home from './Pages/Home';
import CustomerForm from './Pages/CustomerForm';
import EditQueuePage from './Pages/EditQueuePage';
import CreateEmployee from './Pages/CreateEmployee';
import { MyContext } from './mycontext';
import { Navigate } from 'react-router-dom';

function App() {
  const { loggedInUser } = useContext(MyContext)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
    
  const PrivateRoute = ({ element: Component, ...rest }) => {
    const { loggedInUser } = useContext(MyContext);

    // Redirect to login if user is not logged in
    return loggedInUser && Object.keys(loggedInUser).length > 0 ? (
        <Component {...rest} />
    ) : (
        <Navigate to="/" />
    );
};

  

  


  return (
    <div>
      <Routes>
        <Route>
          
          <Route path='' element={<Home/>}/>
          <Route path='customer_form' element={<PrivateRoute element={CustomerForm}/>}/>
          <Route path='queue' element={<PrivateRoute element={EditQueuePage}/>}/>
          <Route path='create_employee' element={<CreateEmployee/>}/>
        </Route>
    
      </Routes>
    </div>
  )
}

export default App
