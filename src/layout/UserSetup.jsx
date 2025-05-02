import { Card } from "primereact/card"
import { RequiredIndicator } from "../utils/validator"
import { Dropdown } from "primereact/dropdown"
import { InputText } from "primereact/inputtext"
import { InputNumber } from "primereact/inputnumber"
import { useState } from "react"
import { Calendar } from "primereact/calendar"
import { countries } from "../utils/Function"
import { Divider } from "primereact/divider"
import { Button } from "primereact/button"
import { useStateContext } from "../context/ContextProvider"
import { updateData } from "../utils/Data"
import { useNavigate } from "react-router-dom"

function UserSetup() {
    const [ fields, setFields ] = useState({});
    const [ invalid, setInvalid ] = useState([]);
    const [ loading, setLoading  ] = useState(false) 
    const { user, setUser } = useStateContext();
    const [ disabled, setDisabled ] = useState(true);
    const [ visible, setVisible ] = useState(false);
    const table_name = "user_table";
    const navigate = useNavigate();

    const loadData = async () => {
       
    };
    
    const fieldChangeHandle = (e) => {
        setFields((fields) => ({
            ...fields,
            [e.target.name]: e.target.value,
        }));
    }

    const handleSubmit = async(e) => {
        e.preventDefault();
        
        const validator = {
            'first_name': fields.first_name ? false : 'This field is required',
            'middle_name': fields.middle_name ? false : 'This field is required',
            'last_name': fields.last_name ? false : 'This field is required',
            'gender': fields.gender ? false : 'This field is required',
            'birthday': fields.birthday ? false : 'This field is required',
            'civil_status': fields.civil_status ? false : 'This field is required',
            'email': fields.email ? false : 'This field is required',
            'contact_no': fields.contact_no ? false : 'This field is required',
            'address_line_1': fields.address_line_1 ? false : 'This field is required',
            'city': fields.city ? false : 'This field is required',
            'country': fields.country ? false : 'This field is required',
        }
       
        const hasErrors = Object.values(validator).some(error => error !== false);

        if(!hasErrors){
            const update = await updateData(user.id,table_name,fields,setVisible,setDisabled,loadData,setInvalid);
            navigate('/home')
            window.location.reload();
        }else{
            swal({
                title: "Opps!",
                text: 'Fix input error(s).',
                icon: "warning",
            })
            setInvalid(validator);
        }

    }
    return (
        <div>
            <Card title={ `User Setup` } className="mx-auto my-8 md:w-6">
                <div className="flex flex-column mb-3">
                
                    <div className="flex flex-row col-12 gap-1">

                        <div className="col-4 flex-column gap-2">
                            <label className='font-bold' htmlFor="first_name">First Name <RequiredIndicator/> </label>
                            <InputText name="first_name"  value={fields.first_name} onChange={fieldChangeHandle} className='w-full' aria-describedby="first_name-help" invalid={ invalid.first_name } />
                            <small className='text-danger'>
                                { invalid.first_name}
                            </small>
                        </div>

                        <div className="col-3 flex-column gap-2 ">
                            <label className='font-bold' htmlFor="middle_name">Middle Name <RequiredIndicator/></label>
                            <InputText name="middle_name" value={fields.middle_name} onChange={fieldChangeHandle} className='w-full' aria-describedby="middle_name-help" invalid={ invalid.middle_name }  />
                            <small className='text-danger'>
                                { invalid.middle_name}
                            </small>
                        </div>
                    
                        <div className="col-4 flex-column gap-2 ">
                            <label className='font-bold' htmlFor="last_name">Last Name <RequiredIndicator/></label>
                            <InputText name="last_name" value={fields.last_name} onChange={fieldChangeHandle} className='w-full' aria-describedby="last_name-help" invalid={ invalid.last_name }  />
                            <small className='text-danger'>
                                { invalid.last_name}
                            </small>
                        </div>

                        <div className="col-1 flex-column gap-2 ">
                            <label className='font-bold' htmlFor="suffix">Suffix</label>
                            <InputText name="suffix" value={fields.suffix} onChange={fieldChangeHandle} className='w-full' aria-describedby="suffix-help" invalid={ invalid.suffix }  />
                            <small className='text-danger'>
                                { invalid.suffix}
                            </small>
                        </div>

                    </div>

                    <div className="flex flex-row col-12 gap-1">

                        <div className="col-3 flex-column gap-2 ">
                            <label className='font-bold' htmlFor="address1">Gender <RequiredIndicator/></label>
                            <Dropdown  value={fields.gender} onChange={fieldChangeHandle} placeholder="Gender" name="gender" className="w-full" 
                                options={ ['Male', 'Female'] } invalid={ invalid.gender } />
                            <small className='text-danger'>
                                { invalid.gender}
                            </small>
                        </div>


                        <div className="col-3 flex-column gap-2 ">
                            <label className='font-bold' htmlFor="address2">Birthday <RequiredIndicator/></label>
                            <Calendar className='w-full' showIcon id="calendar-12h" name="birthday"  value={new Date()} maxDate={new Date()} onChange={fieldChangeHandle}  invalid={ invalid.birthday }  />
                            <small className='text-danger'>
                                { invalid.birthday}
                            </small>
                        </div>

                        <div className="col-3 flex-column gap-2 ">
                            <label className='font-bold' htmlFor="civil_status">Civil Status <RequiredIndicator/></label>
                            <Dropdown  value={fields.civil_status} onChange={fieldChangeHandle} placeholder="Select a status" name="civil_status" className="w-full" 
                                options={ ['Single', 'Married'] } invalid={ invalid.civil_status } />
                            <small className='text-danger'>
                                { invalid.civil_status}
                            </small>
                        </div>

                        <div className="col-3 flex-column gap-2 ">
                            <label className='font-bold' htmlFor="email">Email <RequiredIndicator/></label>
                            <InputText name="email" value={fields.email} onChange={fieldChangeHandle} className='w-full' aria-describedby="email-help" invalid={ invalid.email }  />
                            <small className='text-danger'>
                                { invalid.email}
                            </small>
                        </div>

                    </div>

                   

                    <div className="flex flex-row col-12 gap-1">

                        <div className="col-6 flex-column gap-2 ">
                            <label className='font-bold' htmlFor="address_line_1">Address Line 1 <RequiredIndicator/></label>
                            <InputText name="address_line_1"  value={fields.address_line_1} onChange={fieldChangeHandle} className='w-full' aria-describedby="address_line_1-help" invalid={ invalid.address_line_1 }  />
                            <small className='text-danger'>
                                { invalid.address_line_1}
                            </small>
                        </div>

                        <div className="col-6 flex-column gap-2 ">
                            <label className='font-bold' htmlFor="address_line_2">Address Line 2</label>
                            <InputText name="address_line_2"  value={fields.address_line_2} onChange={fieldChangeHandle} className='w-full' aria-describedby="address_line_2-help" invalid={ invalid.address_line_2 }  />
                            <small className='text-danger'>
                                { invalid.address_line_2}
                            </small>
                        </div>

                    </div>

                    <div className="flex flex-row col-12 gap-1">

                        <div className="col-4 flex-column gap-2 ">
                            <label className='font-bold' htmlFor="city">City<RequiredIndicator/></label>
                            <InputText name="city"  value={fields.city} onChange={fieldChangeHandle} className='w-full' aria-describedby="city-help" invalid={ invalid.city }  />
                            <small className='text-danger'>
                                { invalid.city}
                            </small>
                        </div>

                        <div className="col-4 flex-column gap-2 ">
                            <label className='font-bold' htmlFor="country">Country<RequiredIndicator/></label>
                                <Dropdown  value={ fields.country } onChange={fieldChangeHandle} placeholder="Select a Country" optionLabel="name" name="country" className="w-full" 
                                options={ countries } invalid={ invalid.country } />
                            <small className='text-danger'>
                                { invalid.country}
                            </small>
                        </div>

                        <div className="col-4 flex-column gap-2 ">
                            <label className='font-bold' htmlFor="contact_no">Contact No. <RequiredIndicator/></label>
                            <InputNumber name="contact_no" value={fields.contact_no} onValueChange={fieldChangeHandle} useGrouping={false} className='w-full' aria-describedby="contact_no-help" invalid={ invalid.contact_no }  />
                            <small className='text-danger'>
                                { invalid.contact_no}
                            </small>
                        </div>

                    </div>

                    <div className="flex flex-column justify-content-between -mb-4 px-2 py-3">
                        <Button raised label={ `Submit` } severity={ `success` } icon={ `pi pi-check` } iconPos="right"    onClick={ handleSubmit } />
                    </div>

                </div> 
            </Card>
        </div>
    )
}

export default UserSetup
