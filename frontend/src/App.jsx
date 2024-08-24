import React, { useEffect, useState } from 'react';
import { Routes, Route, Outlet } from "react-router-dom";
import Home from './Pages/Home';
import CustomerForm from './Pages/CustomerForm';
import EditQueuePage from './Pages/EditQueuePage';

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <Routes>
        <Route>
          <Route path='' element={<Home/>}/>
          <Route path='customer_form' element={<CustomerForm/>}/>
          <Route path='queue' element={<EditQueuePage/>}/>
        </Route>
    
      </Routes>
    </div>
  )
}

export default App
