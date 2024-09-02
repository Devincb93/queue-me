import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { MyContext } from '../mycontext'

function CreateEmployee(){

    const navigate = useNavigate()
    const { newEmployee, setNewEmployee } = useContext(MyContext)
    

    const formSchema = yup.object().shape({
        employee_login: yup.string().required('Must enter a employee login'),
        employee_password: yup.string().required("Must enter a password"),
    })

    const formik = useFormik({
        initialValues: {
            employee_login: '',
            employee_password: '',
        },
        validationSchema: formSchema,
        onSubmit: (values) => {
            console.log("form submitted with values:", values)
            fetch(`http://localhost:5555/employees`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    employee_login: values.employee_login,
                    employee_password: values.employee_password
                })
            })
            .then(resp => resp.json())
            .then(data => {
                setNewEmployee(data)
                console.log(data)
                navigate('/')
            })
            
            .catch ((error) => {
            console.error("Error creating employee login", error)
        })    
        }
    })
    
    
    return (
        <div>
            <form onSubmit={formik.handleSubmit}>
                <label htmlFor='employee_login'/>
                <br/>
                <input className='m-1 rounded-md bg-pink-50'
                    id='employee_login'
                    name='employee_login'
                    onChange={formik.handleChange}
                    value={formik.values.employee_login}
                    />
                <label htmlFor='employee_password'/>
                <input className='m-1 rounded-md bg-pink-50'
                    type='password'
                    id='employee_password'
                    name='employee_password'
                    onChange={formik.handleChange}
                    value={formik.values.employee_password}
                    />
                <button type='submit'>Submit</button>
            </form>
            <button onClick={() => navigate('/')}>Back</button>
        </div>
    )
}

export default CreateEmployee