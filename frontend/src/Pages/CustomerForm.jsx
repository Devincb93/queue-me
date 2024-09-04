import React, { useContext } from 'react'
import DressingRooms from './DressingRooms'
import { useNavigate } from 'react-router-dom'
import { MyContext } from '../mycontext'
import * as yup from 'yup'
import { useFormik } from 'formik'

function CustomerForm() {

    const navigate = useNavigate()
    const { handleLogout, addToQueue, loggedInUser } = useContext(MyContext)

    const formSchema = yup.object().shape({
        first_last_name: yup.string().required('Must enter a first and last name'),
        phone_number: yup.string().required("Must enter a valid phone number"),
        email: yup.string(),
    })


    const formik = useFormik({
        initialValues: {
            first_last_name: '',
            phone_number: '',
            email: '',
        },
        validationSchema: formSchema,
        onSubmit: async (values) => {
            try {
                console.log("Submitting login with values:", values)
                addToQueue(values)
                const response = await fetch('http://127.0.0.1:5555/customers', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(values),
                     
                });
                
                const data = await response.json();

                if (response.ok) {
                    const customerId = data.id; 
                
                    console.log("here ya data",data)
                    addToQueue(data)
                    navigate('/customer_form'); 
                } else {
                    
                    alert(data.error || 'customer post failed');
                }
            } catch (error) {
                console.log("failed posting customer:", error);
                alert('An error occurred. Please try again.');
            }
        }
    });

    return (
        <div className='text-center'>
            <form className='p-1 ' onSubmit={formik.handleSubmit}>
                <input className='rounded-md m-1'
                id='first_last_name'
                name='first_last_name'
                placeholder='first and last name'
                onChange={formik.handleChange}
                value={formik.values.first_last_name}
                />
                <input className=' rounded-md m-1'
                id='phone_number'
                name='phone_number'
                placeholder='phone number'
                onChange={formik.handleChange}
                value={formik.values.phone_number}
                />
                <input className='rounded-md m-1'
                id='email'
                name='email'
                placeholder='email'
                onChange={formik.handleChange}
                value={formik.values.email}
                />
                <button className='bg-pink-400 rounded-md w-16 hover:bg-pink-600' type='submit'>Add Babe</button>
                
                <button className='m-1 bg-pink-400 rounded-md w-16 hover:bg-pink-600' type='button' onClick={()=>navigate('/queue')}>Edit</button>
                <p className='underline'>Hi {loggedInUser.employee_login}, 
                    <button className='m-1 bg-pink-400 rounded-md w-16 hover:bg-pink-600' type='button' onClick={()=> handleLogout()}>Log Out</button>
                    <button className='m-1 bg-pink-400 rounded-md w-16 hover:bg-pink-600' type='button' onClick={()=> navigate('/employee_profile')}>Update</button>
                </p>
                <DressingRooms/>

            </form>
        </div>
    )
}

export default CustomerForm