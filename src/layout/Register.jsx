import { Button } from "primereact/button"
import { Card } from "primereact/card"
import { InputText } from "primereact/inputtext"
import { useEffect, useRef, useState } from "react"
import { Link, Navigate } from "react-router-dom"
import { useStateContext } from "../context/ContextProvider"
import { RegisterData } from "../utils/Data"

function Register() {

    const {setUser, setToken} = useStateContext();
    const [invalid, setInvalid] = useState({});
    const [fields, setFields] = useState({
        name: null,
        username: null,
        password: null,
        confirm_password: null,
    })

    const fieldHandle = (e) => {
        setFields({
            ...fields,
            [e.target.name]: e.target.value
        })
    }

    const Submit = async(e) => {
        e.preventDefault();
        
        const validator = {
            'name': fields.name ? false : "this field is required",
            'username': fields.username ? false : "this field is required",
            'password': fields.password ? false : "this field is required",
            'confirm_password': fields.confirm_password ? fields.confirm_password !== fields.password ? "the password and confirm password does not match" : false: "this field is required",
        }
        setInvalid(validator)
        
        const hasErrors = Object.values(validator).some(error => error !== false);
        if(!hasErrors){
            const fetchData = await RegisterData(fields);
            if(fetchData.success){
                localStorage.setItem('Auth', JSON.stringify(fetchData.data));
                window.location.reload();
            }
        }
    }

    return (
        <>
             <Card title={ <h3 className="text-center">Create an account</h3> } className="mx-auto my-8 md:w-30rem">
                <form onSubmit={Submit}>
                    <div className="flex flex-column gap-3">

                        <div className="flex flex-column gap-1">
                            <label className="font-bold" htmlFor="name">Name:</label>
                            <InputText type="text" value={fields.name ?? ''} invalid={invalid.name ? true : false} name="name" onChange={e=>fieldHandle(e)}/>
                            <small className='text-danger'>
                               { invalid.name }
                            </small>
                        </div>
                        <div className="flex flex-column gap-1">
                            <label className="font-bold" htmlFor="username">Username:</label>
                            <InputText type="text" value={fields.username ?? ''} name="username" invalid={invalid.username ? true : false} onChange={e=>fieldHandle(e)}/>
                            <small className='text-danger'>
                               { invalid.username }
                            </small>
                        </div>

                        <div className="flex flex-column gap-1">
                            <label className="font-bold" htmlFor="password">Password:</label>
                            <InputText type="password" value={fields.password ?? ''} name="password" invalid={invalid.password ? true : false} onChange={e=>fieldHandle(e)}/>
                            <small className='text-danger'>
                               { invalid.password }
                            </small>
                        </div>

                        <div className="flex flex-column gap-1">
                            <label className="font-bold" htmlFor="confirm_password">Confirm Password:</label>
                            <InputText type="password" value={fields.confirm_password ?? ''} name="confirm_password" invalid={invalid.confirm_password ? true : false} onChange={e=>fieldHandle(e)}/>
                            <small className='text-danger'>
                               { invalid.confirm_password }
                            </small>
                        </div>

                        <Button label="Register" icon="pi pi-check" className="w-full mx-auto"/> 

                        <p>Already have an account! go to <Link to='/login' className="links">Login</Link></p>
                    </div>
                </form>
            </Card>
        </>
    )
}

export default Register
