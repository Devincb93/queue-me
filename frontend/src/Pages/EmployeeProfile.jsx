import { useContext, useEffect, useState } from "react"
import React from 'react'
import { MyContext } from "../mycontext"
import * as yup from 'yup'
import { useFormik } from 'formik'
import { useNavigate } from "react-router-dom"

function EmployeeProfile() {

    const { loggedInUser, setLoggedInUser} = useContext(MyContext)
    const [employeeEdit, setEmployeeEdit] = useState({}) 
    const navigate = useNavigate()

    console.log("loggedinuser",loggedInUser)   
    useEffect(()=> {
        fetch(`http://127.0.0.1:5555/employee/${loggedInUser.id}`)
        
        .then(resp => resp.json())
        
        .then(data => setEmployeeEdit(data))
    }, [])


    const formSchema = yup.object().shape({
        employee_login: yup.string(),
        employee_password: yup.string(),
    })

    const formik = useFormik({
        initialValues: {
            employee_login: '',
            employee_password: '',
        },
        validationSchema: formSchema,
        onSubmit: async (values) => {
            try {
                console.log("Submitting login with values:", values)
                const response = await fetch(`http://127.0.0.1:5555/employee/${loggedInUser.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(values),
                     
                });
                
                const data = await response.json();

                if (response.ok) {
                    
                    setLoggedInUser(data);
                    console.log("heres the user after set", data)
                    if (loggedInUser)
                        navigate('/customer_form');
                    if (loggedInUser == null)
                        navigate('/')
                

                } else {
                    
                    alert(data.error || 'Error updating');
                }
            } catch (error) {
                console.log("Error updating:", error);
                alert('An error occurred. Please try again.');
            }
        }
    });

    function handleDelete() {
        console.log("Deleting user", loggedInUser);
    
        fetch(`http://127.0.0.1:5555/employee/${loggedInUser.id}`, {
            method: "DELETE",
        })
        .then(response => {
            if (response.ok) {
                console.log("User deleted");
                
                setLoggedInUser(null); 
                
                navigate('/');
            } else {
                return response.json().then(data => {
                    alert(data.message || 'Error deleting user');
                });
            }
        })
        .catch(error => {
            console.error("Error deleting user:", error);
            alert('An error occurred. Please try again.');
        });
    }
    

    


    
    console.log(employeeEdit.id)
    return (
        <div>
            <h1 className="m-1">Hello, {loggedInUser.employee_login}</h1>
            <p className="m-1">To update your profile please fill in the required information below:</p>
            <form onSubmit={formik.handleSubmit}>
            <input className='m-1 bg-pink-50'
                    id='employee_login'
                    name='employee_login'
                    autoComplete='current-login'
                    placeholder='employee login'
                    onChange={formik.handleChange}
                    value={formik.values.employee_login}    
                />
                
                <input className='m-1 bg-pink-50'
                    type='password'
                    id='employee_password'
                    name='employee_password'
                    autoComplete="current-password"
                    placeholder='password'
                    onChange={formik.handleChange}
                    value={formik.values.employee_password}
                />
                <p style={{color:"red"}}>{formik.errors.employee_login}</p>
                <button className='m-1 bg-pink-400 rounded-md w-16 hover:bg-pink-600' type='submit'>Update</button>
                <button className="m-1 bg-pink-400 rounded-md w-16 hover:bg-pink-600" onClick={()=>{navigate('/customer_form')}}>Go Back</button>
                <button className="m-1 bg-pink-400 rounded-md w-16 hover:bg-pink-600" onClick={()=> {handleDelete()}}>Delete</button>
            </form>
            
        </div>
    );
}
export default EmployeeProfile