import { Card } from "primereact/card"
import { InputText } from "primereact/inputtext"
import { Button } from "primereact/button"
import {  Link, Navigate, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { useStateContext } from "../context/ContextProvider"
import { LoginData } from "../utils/Data";

function Login() {

    const [fields, setFields] = useState({
        username: null,
        password: null,
    })

    const [ invalid, setInvalid] = useState({});
    const { setUser, setToken } = useStateContext();
    const navigate = useNavigate();

    const fieldHandle = (e) => {
        setFields({
            ...fields,
            [e.target.name]: e.target.value
        })
    }

    useEffect(()=>{
       
    })

    const Submit = async(e) => {
        e.preventDefault();
       
        try {

            const validator = {
                'username': fields.username ? false : "this field is required",
                'password': fields.password ? false : "this field is required",
            }
           
            const hasErrors = Object.values(validator).some(error => error !== false);

            if(!hasErrors){
                const fetchData = await LoginData(fields);
                if(fetchData.success){
                    localStorage.setItem('Auth', JSON.stringify(fetchData.data));
                    window.location.reload();
                }else{
                    setInvalid({
                        'password': "the password doest match. please try again",
                    });
                }
                
            }else{
                setInvalid(validator);
            }
           
        } catch (err) {
            console.error('Failed to load data:', err);
        }
    }

    return (
        <>
             <Card title={ <h3 className="text-center">Login your Account</h3> } className="mx-auto my-8 md:w-30rem">
                <form onSubmit={Submit}>
                    <div className="flex flex-column gap-3">
                        
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

                        <Button label="Login" icon="pi pi-check" className="w-full mx-auto" /> 

                        <p>Don't have account? go to <Link to='/register' className="links">Register</Link></p>
                    </div>
                </form>
            </Card>
          
        </>
    )
}

export default Login
