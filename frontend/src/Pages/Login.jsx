import React, { useContext } from 'react'
import { json, useNavigate } from 'react-router-dom' 
import { MyContext } from '../mycontext'
import * as yup from 'yup'
import { useFormik } from 'formik'

function Login() {

    const navigate = useNavigate()
    const { setLoggedInUser, loggedInUser } = useContext(MyContext)

    

    const formSchema = yup.object().shape({
        employee_login: yup.string().required('Must enter a employee login'),
        employee_password: yup.string().required("Must enter a valid password"),
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
                const response = await fetch('http://127.0.0.1:5555/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(values),
                    credentials: 'include' 
                });
                
                const data = await response.json();

                if (response.ok) {
                    
                    setLoggedInUser(data);
                    console.log("heres the user after set", data)
                    navigate('/customer_form'); 
                } else {
                    
                    alert(data.error || 'Login failed');
                }
            } catch (error) {
                console.log("Error logging in:", error);
                alert('An error occurred. Please try again.');
            }
        }
    });
    
    
    return (
        <div >
            <form className=''onSubmit={formik.handleSubmit}>
                
                <br/>
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
                <button className='m-1' type='submit'>Login</button>
                
                
            </form>
            <button className='m-1' onClick={()=> navigate('create_employee')}>Create</button>
        </div>
    )
}

export default Login