import React, { useState, useEffect, useRef, setState } from 'react';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { getUsersData } from "../utils/List"
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { SplitButton } from 'primereact/splitbutton';
import { Stepper } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';
import { deleteData, storeData, updateData } from "../utils/Data"
import { countries, getClient, getParish } from "../utils/Function"
import swal from 'sweetalert';

import { RequiredIndicator } from '../utils/validator';
    
function User() {

    const [ clientOption, setClientOption ] = useState([]);
    const [ data, setData ] = useState([]);
    const [ disabled, setDisabled ] = useState(true);
    const [ expandedRows, setExpandedRows ] = useState(null);
    const [ fields, setFields ] = useState({});
    const [ invalid, setInvalid ] = useState([]);
    const [ loading, setLoading  ] = useState(false) 
    const [ modal, setModal  ] = useState({});
    const [ selected, setSelected ] = useState({});
    const [ selectedData, setSelectedData ] = useState({});
    const [ visible, setVisible ] = useState(false);

    const [ parishFilterLoading, setParishFilterLoading ] = useState(false)
    const [ parishFilterOption, setParishFilterOption ] = useState([]);
    const [ parishLoading, setParishLoading ] = useState(false)
    const [ parishOption, setParishOption ] = useState([]);

    const stepperRef = useRef(null);
    const table_name = "user_table";

    const modeOption = [
        { name: 'Address Line 1', value: 'address_line_1' },
        { name: 'Address Line 2', value: 'address_line_2' },
        { name: 'City', value: 'city' },
        { name: 'Civil Status', value: 'civil_status' },
        { name: 'Contact No', value: 'contact_no' },
        { name: 'Country', value: 'country' },
        { name: 'Created At', value: 'created_at' },
        { name: 'Created By', value: 'created_by' },
        { name: 'Email', value: 'email' },
        { name: 'Fullname', value: 'fullname' },
        { name: 'Gender', value: 'gender' },
        { name: 'Is Verified', value: 'is_verified' },
        { name: 'Status', value: 'status' },
        { name: 'Username', value: 'username' },
    ]

    

    const [filter, setFilter] = useState({
        client: null,
        mode: null,
        keyword: null,
        fields: modeOption,
    })

    const items = [
        {
            label: 'Active',
            icon: 'pi pi-times-circle',
            command: (e )=> {handleStatus(e)}
        },
        {
            label: 'Inactive',
            icon: 'pi pi-verified',
            command: (e )=> {handleStatus(e)}
        },
    ];

    const handleStatus = (e) => {

        swal({
            title: "Are you sure?",
            text: `You want to the status to ${e.item.label}.`,
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then((confirm) => {
            if (confirm) {
                
            } 
          });
    }

    const btnLoad = (e) => {
        e.preventDefault();
        loadData();
    }

    const loadData = async () => {
        setLoading(true);
        try {
            const fetchData = await getUsersData(filter);
            setTimeout(()=>{
                setLoading(false);
                setData(fetchData);
            },900)
        } catch (err) {
            console.error('Failed to load data:', err);
        }
    };

    const client = async () => {
        try {
            const fetchData = await getClient();
            setTimeout(()=>{
                setClientOption(fetchData);
            },250)
        } catch (err) {
            console.error('Failed to load data:', err);
        }
    };

    const parish = async (target, action) => {
        try {
            const fetchData = await getParish(target);
            action === 'filter' ? setParishFilterLoading(true) : setParishLoading(true) ;
            setTimeout(()=>{
                action === 'filter' ? setParishFilterOption(fetchData) : setParishOption(fetchData) ;
                action === 'filter' ? setParishFilterLoading(false) : setParishLoading(false) ;
            },500)
        } catch (err) {
            console.error('Failed to load data:', err);
        }
    };

    const onRowSelect = (e) => {
        let seldata = e.data;
        setDisabled(false);
        setSelected(seldata)
    };

    const onRowUnselect = (event) => {
        setDisabled(true);
    };

    const modalAction = (e) => {
        e.preventDefault();
        console.log(selected)
        const label = e.currentTarget.getAttribute('data-label');

        switch (label) {
            case 'Add':
                setFields({})
                break;
            default:
                setFields(selected)
                parish(selected.client_id.id,'field')
                break;
        }

        setModal({
            btnLabel: label === 'View' ? 'Close' : 'Submit',
            edit: label != 'Add' ? true : false,
            editable: label === 'View' ? true : false,
            icon: label === 'View' ? 'pi pi-times' : 'pi pi-check',
            label: label,
            severity: label === 'View' ? 'secondary' : 'primary',
        })
        setInvalid(false)
        setVisible(true)
    }

    const handleFilterChange = (e) => {
        console.log(e.target.value)
        e.target.name  === "client" ? parish(e.target.value.id,'filter') : '';
        setFilter((filter) => ({
          ...filter,
          [e.target.name]: e.target.value,
        }));
      };

    const fieldChangeHandle = (e) => {
        e.target.name === "client_id" ? parish(e.target.value.id,'field') : '';
        setFields((fields) => ({
            ...fields,
            [e.target.name]: e.target.value,
        }));
        
    }

    const handeDelete = (e) => {

        swal({
            title: "Are you sure?",
            text: "You want to delete this data!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then((confirm) => {
            if (confirm) {
               deleteData(table_name,selectedData.id,setDisabled,loadData);
            } 
          });
    }

    const handleSubmit = (e) => {
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
            'client_id': fields.client_id ? false : 'This field is required',
            'parish_id': fields.parish_id ? false : 'This field is required',
            'role': fields.role ? false : 'This field is required',
        }
       
        const hasErrors = Object.values(validator).some(error => error !== false);

        if(!hasErrors){
            if(modal.label === 'Add'){
                storeData(table_name,fields,setVisible,setDisabled,loadData,setInvalid);
            }else{
                updateData(fields.id,table_name,fields,setVisible,setDisabled,loadData,setInvalid);
            }
        }else{
            swal({
                title: "Opps!",
                text: 'Fix input error(s).',
                icon: "warning",
            })
            setInvalid(validator);
        }
        
    }

    const allowExpansion = (rowData) => {
       return rowData.others.length > 0;
    };

    const rowExpansionTemplate = (data) => {
        return (
            <div>
                <DataTable value={data.others}>
                    <Column />
                    <Column field="address_line_1"  header="Address Line 1"></Column>
                    <Column field="address_line_2"  header="Address Line 2"></Column>
                    <Column field="city" header="City" ></Column>
                    <Column field="country" header="Country" ></Column>
                    <Column field="created_by" header="Created By" ></Column>
                    <Column field="created_at" header="Created At" ></Column>
                </DataTable>
            </div>
        );
    };
   
    useEffect(()=> {
        loadData();
        client();
    }, [])


    return (
        <>
             <div className="card " >   
                <div className="flex justify-content-start mt-2 row gap-1 mb-4">
                    <div className="flex row gap-2">
                        <Dropdown  name="client" value={filter.client} onChange={ handleFilterChange } options={clientOption} optionLabel="name" placeholder="Select a Client" className="w-full md:w-14rem" />
                        <Dropdown  name="parish" value={filter.parish} onChange={ handleFilterChange } options={parishFilterOption} optionLabel="name" placeholder={parishFilterLoading ? "Loading..." : "Select a Parish" } className="w-full md:w-14rem" loading={parishFilterLoading} />
                        <Dropdown  name="mode" value={filter.mode} onChange={ handleFilterChange } options={modeOption} optionLabel="name" placeholder="Select a Filter" className="w-full md:w-14rem" />
                        <InputText onChange={ handleFilterChange } name="keyword" className="w-full md:w-15rem" placeholder="Enter a keyword.." />
                        <Button raised label='Show' className='border-round-md' severity="info" icon="pi pi-search" onClick={ (e) => { btnLoad(e) } } />
                    </div>
                </div>
           
                <div className="flex justify-content-end row gap-1 mb-4">
                        <Button raised label='Add' onClick={(e) => modalAction(e)} data-label='Add'  icon='pi pi-plus'/>
                        <Button raised label='View' onClick={(e) => modalAction(e)} data-label='View'  severity="secondary" icon='pi pi-eye' disabled={ disabled } />
                        <Button raised label='Edit' onClick={(e) => modalAction(e)} data-label='Edit'  severity="help" icon='pi pi-pencil' disabled={ disabled }/>
                        <Button raised label='Delete' onClick={(e) => { handeDelete(e) }}  severity="danger" icon='pi pi-trash' disabled={ disabled }/>
                        <SplitButton raised label="Status" icon="pi pi-id-card" model={items} severity="warning" disabled={ disabled }/>
                </div>

                <div style={ { minHeight: '600px'  } }>
                    <DataTable scrollable scrollHeight="600px" value={data} lazy loading={loading} selectionMode="single" selection={selectedData} onSelectionChange={(e) => setSelectedData(e.value)}  dataKey="id" 
                        onRowSelect={onRowSelect} onRowUnselect={onRowUnselect} metaKeySelection={false}
                        expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data)}
                        rowExpansionTemplate={rowExpansionTemplate}
                        tableStyle={{ minWidth: '60rem' }}>
                        <Column expander={allowExpansion} style={{ width: '5rem' }} />
                        <Column field="client" sortable header="Client"></Column>
                        <Column field="parish" sortable header="Parish"></Column>  
                        <Column field="fullname" sortable header="Fullname"></Column>
                        <Column field="gender" sortable header="Gender"></Column>
                        <Column field="civil_status" sortable header="Civil Status"></Column>
                        <Column field="username" sortable header="Username"></Column>
                        <Column field="email" sortable header="Email"></Column>
                        <Column field="contact_no" sortable header="Contact"></Column>
                        <Column field="status" sortable header="Status"></Column>
                        <Column field="is_verified" sortable header="Is Verify"></Column>
                    </DataTable>
                
                </div> 

                {/* Modal Form */}
                <div className="card flex justify-content-center">
                    <Dialog header={modal.label} className='' draggable={false} visible={visible} style={{ width: '58vw' }} onHide={() => {if (!visible) return; setVisible(false); }} >
                    
                    <Stepper ref={stepperRef} style={{ flexBasis: '50rem' }}>
                        <StepperPanel header="Details">
                           
                            <div className="flex flex-column mb-3">

                                <div className="flex flex-row col-12 gap-1">

                                    <div className="col-4 flex-column gap-2">
                                        <label className='font-bold' htmlFor="first_name">First Name <RequiredIndicator/> </label>
                                        <InputText name="first_name"  value={fields.first_name} onChange={fieldChangeHandle} className='w-full' aria-describedby="first_name-help" invalid={ invalid.first_name } disabled={ modal.editable} />
                                        <small className='text-danger'>
                                            { invalid.first_name}
                                        </small>
                                    </div>

                                    <div className="col-3 flex-column gap-2 ">
                                        <label className='font-bold' htmlFor="middle_name">Middle Name <RequiredIndicator/></label>
                                        <InputText name="middle_name" value={fields.middle_name} onChange={fieldChangeHandle} className='w-full' aria-describedby="middle_name-help" invalid={ invalid.middle_name }  disabled={ modal.editable} />
                                        <small className='text-danger'>
                                            { invalid.middle_name}
                                        </small>
                                    </div>
                               
                                    <div className="col-4 flex-column gap-2 ">
                                        <label className='font-bold' htmlFor="last_name">Last Name <RequiredIndicator/></label>
                                        <InputText name="last_name" value={fields.last_name} onChange={fieldChangeHandle} className='w-full' aria-describedby="last_name-help" invalid={ invalid.last_name }  disabled={ modal.editable} />
                                        <small className='text-danger'>
                                            { invalid.last_name}
                                        </small>
                                    </div>

                                    <div className="col-1 flex-column gap-2 ">
                                        <label className='font-bold' htmlFor="suffix">Suffix</label>
                                        <InputText name="suffix" value={fields.suffix} onChange={fieldChangeHandle} className='w-full' aria-describedby="suffix-help" invalid={ invalid.suffix }  disabled={ modal.editable} />
                                        <small className='text-danger'>
                                            { invalid.suffix}
                                        </small>
                                    </div>

                                </div>

                                <div className="flex flex-row col-12 gap-1">

                                    <div className="col-2 flex-column gap-2 ">
                                        <label className='font-bold' htmlFor="address1">Gender <RequiredIndicator/></label>
                                        <Dropdown  value={fields.gender} onChange={fieldChangeHandle} placeholder="Gender" name="gender" className="w-full" 
                                            options={ ['Male', 'Female'] } invalid={ invalid.gender } disabled={ modal.editable} />
                                        <small className='text-danger'>
                                            { invalid.gender}
                                        </small>
                                    </div>


                                    <div className="col-2 flex-column gap-2 ">
                                        <label className='font-bold' htmlFor="address2">Birthday <RequiredIndicator/></label>
                                        <Calendar className='w-full' showIcon id="calendar-12h" name="birthday"  value={ modal.edit ? new Date(fields.birthday) : new Date() } maxDate={new Date()} onChange={fieldChangeHandle}  invalid={ invalid.birthday }  disabled={ modal.editable} />
                                        <small className='text-danger'>
                                            { invalid.birthday}
                                        </small>
                                    </div>

                                    <div className="col-3 flex-column gap-2 ">
                                        <label className='font-bold' htmlFor="civil_status">Civil Status <RequiredIndicator/></label>
                                        <Dropdown  value={fields.civil_status} onChange={fieldChangeHandle} placeholder="Select a status" name="civil_status" className="w-full" 
                                            options={ ['Single', 'Married'] } invalid={ invalid.civil_status } disabled={ modal.editable} />
                                        <small className='text-danger'>
                                            { invalid.civil_status}
                                        </small>
                                    </div>

                                    <div className="col-3 flex-column gap-2 ">
                                        <label className='font-bold' htmlFor="email">Email <RequiredIndicator/></label>
                                        <InputText name="email" value={fields.email} onChange={fieldChangeHandle} className='w-full' aria-describedby="email-help" invalid={ invalid.email }  disabled={ modal.editable} />
                                        <small className='text-danger'>
                                            { invalid.email}
                                        </small>
                                    </div>

                                    <div className="col-2 flex-column gap-2 ">
                                        <label className='font-bold' htmlFor="contact_no">Contact No. <RequiredIndicator/></label>
                                        <InputNumber name="contact_no" value={fields.contact_no} onValueChange={fieldChangeHandle} useGrouping={false} className='w-' aria-describedby="contact_no-help" invalid={ invalid.contact_no }  disabled={ modal.editable} />
                                        <small className='text-danger'>
                                            { invalid.contact_no}
                                        </small>
                                    </div>

                                </div>

                                <div className="flex flex-row col-12 gap-1">

                                    <div className="col-4 flex-column gap-2 ">
                                        <label className='font-bold' htmlFor="address_line_1">Address Line 1 <RequiredIndicator/></label>
                                        <InputText name="address_line_1"  value={fields.address_line_1} onChange={fieldChangeHandle} className='w-full' aria-describedby="address_line_1-help" invalid={ invalid.address_line_1 }  disabled={ modal.editable} />
                                        <small className='text-danger'>
                                            { invalid.address_line_1}
                                        </small>
                                    </div>

                                    <div className="col-4 flex-column gap-2 ">
                                        <label className='font-bold' htmlFor="address_line_2">Address Line 2</label>
                                        <InputText name="address_line_2"  value={fields.address_line_2} onChange={fieldChangeHandle} className='w-full' aria-describedby="address_line_2-help" invalid={ invalid.address_line_2 }  disabled={ modal.editable} />
                                        <small className='text-danger'>
                                            { invalid.address_line_2}
                                        </small>
                                    </div>

                                    <div className="col-2 flex-column gap-2 ">
                                        <label className='font-bold' htmlFor="city">City<RequiredIndicator/></label>
                                        <InputText name="city"  value={fields.city} onChange={fieldChangeHandle} className='w-full' aria-describedby="city-help" invalid={ invalid.city }  disabled={ modal.editable} />
                                        <small className='text-danger'>
                                            { invalid.city}
                                        </small>
                                    </div>

                                    <div className="col-2 flex-column gap-2 ">
                                        <label className='font-bold' htmlFor="country">Country<RequiredIndicator/></label>
                                            <Dropdown  value={ fields.country } onChange={fieldChangeHandle} placeholder="Select a Country" optionLabel="name" name="country" className="w-full" 
                                            options={ countries } invalid={ invalid.country } disabled={ modal.editable} />
                                        <small className='text-danger'>
                                            { invalid.country}
                                        </small>
                                    </div>
                               
                                </div>
                            </div> 

                            <div className="flex justify-content-between -mb-4">
                                <Button raised label="Close" text severity="secondary" icon="pi pi-times" onClick={() => setVisible(false)} />
                                <Button raised label="Next" icon="pi pi-arrow-right" iconPos="right" onClick={() => stepperRef.current.nextCallback()} />
                            </div>
                        </StepperPanel>
                        <StepperPanel header="Setup">
                            
                            <div className="flex flex-column mb-3">

                                <div className="flex flex-row col-12 gap-1">

                                    <div className="flex col-4 flex-column gap-2 ">
                                        <label className='font-bold' htmlFor="client_id">Client<RequiredIndicator/></label>
                                        <Dropdown name="client_id" value={ fields.client_id } onChange={fieldChangeHandle} options={clientOption} optionLabel="name" placeholder="Select a Client" className="w-full" invalid={ invalid.client_id }  disabled={ modal.editable}/>
                                        <small className='text-danger'>
                                            { invalid.client_id}
                                        </small>
                                    </div>


                                    <div className="flex col-4 flex-column gap-2 ">
                                        <label className='font-bold' htmlFor="parish_id">Parish<RequiredIndicator/></label>
                                        <Dropdown name="parish_id" value={ fields.parish_id } onChange={fieldChangeHandle} options={parishOption} optionLabel="name" placeholder={parishLoading ? "Loading..." : "Select a Parish" } className="w-full" invalid={ invalid.parish_id }  disabled={ modal.editable}/>
                                        <small className='text-danger'>
                                            { invalid.parish_id}
                                        </small>
                                    </div>

                                    <div className="flex col-4 flex-column gap-2 ">
                                        <label className='font-bold' htmlFor="role">Role<RequiredIndicator/></label>
                                        <Dropdown name="role" value={fields.role} onChange={fieldChangeHandle} options={ ['Superadmin', 'Support'] }  optionLabel="name" placeholder="Select a Role" className="w-full" invalid={ invalid.role }  disabled={ modal.editable}/>
                                        <small className='text-danger'>
                                            { invalid.role}
                                        </small>
                                    </div>
                         
                                </div>

                                <div className="flex flex-row  gap-1">

                                    <div className="flex col-12 flex-column gap-2 ">
                                        <label className='font-bold' htmlFor="remarks">Remarks</label>
                                        <InputTextarea  name="remarks" value={fields.remarks} onChange={fieldChangeHandle} rows={3} cols={30} disabled={ modal.editable} />
                                        <small className='text-danger'>
                                            { invalid.remarks}
                                        </small>
                                    </div>
                         
                                </div>
                            </div>

                            <div className="flex justify-content-between -mb-4">
                                <Button raised label="Back" severity="secondary" icon="pi pi-arrow-left" onClick={() => stepperRef.current.prevCallback()} />
                                <Button raised label={ modal.btnLabel } severity={ modal.severity } icon={ modal.icon } iconPos="right"    onClick={ modal.editable ? e=>{ ( setVisible(false)  ) } : handleSubmit} />
                            </div>
                        </StepperPanel>
                        
                    </Stepper>
                        
                    </Dialog>
                </div>
            </div> 
        </>
    )
}

export default User