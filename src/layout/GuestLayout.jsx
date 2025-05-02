import { Navigate, Outlet } from "react-router-dom"
import { useStateContext } from "../context/ContextProvider";

function GuestLayout() {
    const {user, token} = useStateContext();
   
    if(token){
        console.log(user.email);
        if (user.email === undefined) {
            return <Navigate to='/user-setup'/> 
        } else {
            return <Navigate to='/home'/> 
        }
      
    }

    return (
        <>
            <Outlet/>
        </>
       
    )
}

export default GuestLayout
