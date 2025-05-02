import React, { useState, useEffect, useRef, setState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';
import { getParishData } from '../../utils/List';
import { deleteData, storeData, updateData } from "../../utils/Data"
import swal from 'sweetalert';
import { getClient, getParish } from '../../utils/Function';
import { InputNumber } from 'primereact/inputnumber';
import { InputSwitch } from 'primereact/inputswitch';
import { RequiredIndicator } from '../../utils/validator';

function Parish() {

    const [ checked, setChecked ] = useState(false);
    const [ clientOption, setClientOption ] = useState([]);
    const [ data, setData ] = useState([]);
    const [ disabled, setDisabled ] = useState(true);
    const [ fields, setFields] = useState({});
    const [ invalid, setInvalid ] = useState([]);
    const [ loading, setLoading ] = useState(false) 
    const [ modal, setModal ] = useState({});
    const [ selected, setSelected ] = useState({});
    const [ selectedData, setSelectedData ] = useState({});
    const [ visible, setVisible ] = useState(false);
    const [ parishLoading, setParishLoading ] = useState(false)
    const [ parishOption, setParishOption ] = useState([]);

    const table_name = "parish_table";

    const modeOption = [
        { name: 'Address', value: 'address'}, 
        { name: 'Chapel Rate', value: 'chapel_rate'}, 
        { name: 'Contact No', value: 'contact_no'}, 
        { name: 'Created At', value: 'created_at'}, 
        { name: 'Created By', value: 'created_by'}, 
        { name: 'Name', value: 'name'}, 
        { name: 'Parent', value: 'parent'}, 
        { name: 'Parish Rate', value: 'parish_rate'}, 
        { name: 'Remarks', value: 'remarks'}, 
        { name: 'Status', value: 'status'}, 
    ]

    const [filter, setFilter] = useState({
        fields: modeOption,
        keyword: null,
        mode: null,
    })

    const btnLoad = (e) => {
        e.preventDefault();
        loadData();
    }

    const loadData = async () => {
        
        setLoading(true);
        try {
            const fetchData = await getParishData(filter);
            setTimeout(()=>{
                setLoading(false);
                setData(fetchData);
            },1000)
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

    const onRowSelect = (e) => {
        setDisabled(false);
        setSelected(e.data);

    };

    const onRowUnselect = (event) => {
        setDisabled(true);
    };

    const modalAction = (e) => {
        e.preventDefault();
        const label = e.currentTarget.getAttribute('data-label');
        
        switch (label) {
            case 'Add':
                setFields({})
                parish("",'field')
                break;
            default:
                console.log(selected.client_id);
                setFields(selected)
                parish(selected.client_id.id,'field')
                break;
        }

        setModal({
            btnLabel: label === 'View' ? 'Close' : 'Submit',
            editable: label === 'View' ? true : false,
            icon: label === 'View' ? 'pi pi-times' : 'pi pi-check',
            label: label,
            severity: label === 'View' ? 'secondary' : 'primary',
        })
        setInvalid(false)
        setVisible(true)
    }

    const handleFilterChange = (e) => {
        setFilter((filter) => ({
          ...filter,
          [e.target.name]: e.target.value,
        }));
    };

    const parish = async (target, action) => {
        try {
            const fetchData = await getParish(target);
            action === 'filter' ? setParishFilterLoading(true) : setParishLoading(true) ;
            // console.log('fetchData',fetchData);
            setTimeout(()=>{
                setParishOption(fetchData);
                setParishLoading(false);
            },500)
        } catch (err) {
            console.error('Failed to load data:', err);
        }
    };
    
    const fieldChangeHandle = (e,target) => {
        if(target){
            setFields((fields) => ({
                ...fields,
                [target]: e.value,
            }));
        }else{
            switch (e.target.name) {
                case 'client_id':
                    parish(e.target.value.id,'field');
                    setFields((fields) => ({
                        ...fields,
                        [e.target.name]: e.target.value,
                    }));
    
                    break;
                case 'parent_id':
                    console.log(' e.target.value', e.target.value);
                    
                    setFields((fields) => ({
                        ...fields,
                        [e.target.name]: e.target.value,
                        parish_rate: e.target.value.parish_rate,
                    }));
                    
                    break;
    
                case 'isParent':
                    console.log(' e.target.value', e.target.value);
                    
                    setFields((fields) => ({
                        ...fields,
                        [e.target.name]: e.target.value,
                        chapel_rate: (e.target.value ?? "0000"),
                        parish_rate: e.target.value ? fields.parent_id ? fields.parent_id.parish_rate : 0 : 0,
                    }));
                    
                    break;
                default:
                    
                    setFields((fields) => ({
                        ...fields,
                        [e.target.name]: e.target.value,
                    }));
                    break;
            }
        }
        
       
    }

    const handeDelete = (e) => {
        e.preventDefault();

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
                swal({
                    title: "Success!",
                    text: 'Data Successfully deleted.',
                    icon: "warning",
                });
            } 
          });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const validator = {
            'client_id': fields.client_id ? false : 'This field is required',
            'name': fields.name ? false : 'This field is required',
            'parent_id': fields.isParent ? fields.parent_id ? false : 'This field is required' : false,
            'parish_rate': fields.parish_rate ? false : 'This field is required',
            'chapel_rate': fields.isParent ? fields.chapel_rate ? false : 'This field is required' : false,
            'contact_no': fields.contact_no ? false : 'This field is required',
            'address': fields.address ? false : 'This field is required',
        }
        
        const hasErrors = Object.values(validator).some(error => error !== false);

        if(!hasErrors){
            switch (modal.label) {
                case "Add":
                    storeData(table_name,fields,setVisible,setDisabled,loadData,setInvalid);
                    break;
                case "Edit":
                    updateData(fields.id,table_name,fields,setVisible,setDisabled,loadData,setInvalid);
                    break;
                default:
                    break;
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
    
    const footerContent = (
        <div>
            <Button raised text label="Close" onClick={() => setVisible(false)} className="p-button-secondary mr-3" />
            { !modal.editable ? <Button raised label="Submit" onClick={ handleSubmit } className="p-button-primary"/> : '' } 
        </div>
    );

    const formatCurrency = (value) => {
       return value.toLocaleString('en-US', { style: 'currency', currency: 'PHP' });
    };

    const parishRate = (rowData) => {
       return formatCurrency(rowData.parish_rate);
    };

    const chapelRate = (rowData) => {
        return formatCurrency(rowData.chapel_rate ?? 0);
    };

    const parentTemplate = (rowData) => {
        return <div className="flex ">
           { rowData.isParent === "Yes" ? <i className="pi pi-check" style={{ color: 'green' }}></i>  : <i className="pi pi-times" style={{ color: 'red' }}></i> }
        </div>
    };
   
    useEffect(()=> {
        loadData(table_name);
        client();
    }, [])


    return (
        <>
             <div className="card " >   
                <div className="flex justify-content-start mt-2 row gap-1 mb-4">
                    <div className="flex row gap-2">
                        <Dropdown  name="client" value={filter.client} onChange={ handleFilterChange } options={clientOption} optionLabel="name" placeholder="Select a Client" className="w-full md:w-14rem" />
                        <Dropdown  name="mode" value={filter.mode} onChange={ handleFilterChange } options={modeOption} optionLabel="name" placeholder="Select a Filter" className="w-full md:w-14rem" />
                        <InputText onChange={ handleFilterChange } name="keyword" className="w-full md:w-15rem" placeholder="Enter a keyword.." />
                        <Button raised label='Show' className='border-round-md' severity="info" icon="pi pi-search" onClick={ (e) => { btnLoad(e) } } />
                    </div>
                </div>
           
                <div className="flex justify-content-end row gap-1 mb-4">
                    <Button raised label='Add' onClick={(e) => modalAction(e)} data-label='Add' className='border-round-md' icon='pi pi-plus'/>
                    <Button raised label='View' onClick={(e) => modalAction(e)} data-label='View' className='border-round-md' severity="secondary" icon='pi pi-eye' disabled={ disabled } />
                    <Button raised label='Edit' onClick={(e) => modalAction(e)} data-label='Edit' className='border-round-md' severity="help" icon='pi pi-pencil' disabled={ disabled }/>
                    <Button raised label='Delete' onClick={(e) => { handeDelete(e) }} className='border-round-md' severity="danger" icon='pi pi-trash' disabled={ disabled }/>
                </div>

                 <div style={ { minHeight: '500px'  } }>
                    
                 <DataTable value={data} lazy loading={loading} selectionMode="single" selection={selectedData} onSelectionChange={(e) => setSelectedData(e.value)} dataKey="id"
                        onRowSelect={onRowSelect} onRowUnselect={onRowUnselect} metaKeySelection={false} tableStyle={{ minWidth: '50rem' }}>
                        <Column field="client" sortable header="Client"></Column>
                        <Column field="name" sortable header="Name"></Column>
                        <Column field="isParent" sortable header="Is Chapel" body={parentTemplate}></Column>
                        <Column field="parent" sortable header="Parent"></Column>
                        <Column field="parish_rate" sortable header="Parish Rate" body={parishRate}></Column>
                        <Column field="chapel_rate" sortable header="Chapel Rate" body={chapelRate}></Column>
                        <Column field="contact_no" sortable header="Contact No"></Column>
                        <Column field="address" sortable header="Address"></Column>
                        <Column field="remarks" sortable header="Remarks"></Column>
                        <Column field="status" sortable header="Status"></Column>
                        <Column field="created_by" sortable header="Created By"></Column>
                        <Column field="created_at" sortable header="Created At"></Column>
                    </DataTable>
                
                </div>

                <div className="card flex justify-content-center">
                     <Dialog header={ modal.label } className=''  visible={visible} style={{ width: '37.5vw' }} onHide={() => {if (!visible) return; setVisible(false); }} footer={footerContent} draggable={false}>
                    
                        <div className="flex-rowflex flex-row flex-wrap">

                            <div className="flex flex-row col-12 gap-1">
                                <div className="flex col-6 flex-column gap-1">
                                    <label className='font-bold' htmlFor="client_id">Client <RequiredIndicator/></label>
                                    <Dropdown name="client_id" value={fields.client_id} onChange={(e) => fieldChangeHandle(e)} options={clientOption} optionLabel="name" placeholder="Select a Client" className="w-full" invalid={ invalid.client_id }  disabled={ modal.editable }/>
                                    <small className='text-danger'>
                                        { invalid.client_id}
                                    </small>
                                </div>
                                
                                <div className="flex col-6 flex-column gap-1">
                                    <label htmlFor="name" className="font-bold">Name <RequiredIndicator/></label>
                                    <InputText name="name"  disabled={ modal.editable } value={fields.name} onChange={e => fieldChangeHandle(e)} className='w-full' aria-describedby="name-help" invalid={ invalid.name } />
                                    <small className='text-danger'>
                                        { invalid.name}
                                    </small>
                                </div>
                            </div>

                            <div className="flex flex-row col-12 gap-1">
                                <div className="flex col-6 flex-row align-items-center gap-2">
                                    <InputSwitch checked={fields.isParent === "Yes" ? true : false } name='isParent' onChange={(e) => fieldChangeHandle(e)} />
                                    <label className="font-bold">Is Parent </label>
                                    
                                </div>
                                {fields.isParent ? (<div className="flex col-6 flex-column gap-1">
                                        <label className='font-bold' htmlFor="parent_id">Parent Category <RequiredIndicator/></label>
                                        <Dropdown name="parent_id" value={fields.parent_id} onChange={(e) => fieldChangeHandle(e)} options={parishOption} loading={parishLoading} optionLabel="name" placeholder={parishLoading ? "Loading..." : "Select a Parish" } className="w-full" invalid={ invalid.parent_id }  disabled={ modal.editable }/>
                                        <small className='text-danger'>
                                            { invalid.parent_id}
                                        </small>
                                    </div>) : ''}
                               
                            </div>

                            <div className="flex flex-row col-12 gap-1">

                                <div className="flex col-6 flex-column gap-1">
                                    <label className="font-bold">Parish Rate <RequiredIndicator/></label>
                                    <div className="p-inputgroup flex-1">
                                        <span className="p-inputgroup-addon">₱</span>
                                        <InputNumber name="parish_rate" className='w-full' placeholder="0" inputId="integeronly" value={fields.parish_rate} invalid={ invalid.parish_rate } onChange={e => fieldChangeHandle(e,'parish_rate')}  disabled={ modal.editable || fields.isParent} />
                                    </div>
                                    <small className='text-danger'>
                                        { invalid.parish_rate}
                                    </small>
                                </div>

                                {fields.isParent ? <div className="flex col-6 flex-column gap-1">
                                    <label className="font-bold">Chapel Rate <RequiredIndicator/></label>
                                    <div className="p-inputgroup flex-1">
                                        <span className="p-inputgroup-addon">₱</span>
                                        <InputNumber name="chapel_rate" className='w-full' placeholder="0" inputId="integeronly" value={fields.chapel_rate} invalid={ invalid.chapel_rate } onChange={e => fieldChangeHandle(e,'chapel_rate')}  disabled={ modal.editable || !fields.isParent}/>
                                    </div>
                                    <small className='text-danger'>
                                        { invalid.chapel_rate}
                                    </small>
                                </div> : '' }
                            </div>
                        
                            <div className="flex col-12 flex-column gap-1">
                                <label htmlFor="contact_no" className="font-bold">Contact <RequiredIndicator/></label>
                                <InputText name="contact_no" disabled={ modal.editable } value={fields.contact_no} onChange={e => fieldChangeHandle(e)} className='w-full' aria-describedby="contact_no-help" invalid={ invalid.contact_no } />
                                <small className='text-danger'>
                                    { invalid.contact_no}
                                </small>
                            </div>

                            <div className="flex col-12 flex-column gap-1">
                                <label htmlFor="address" className="font-bold">Address <RequiredIndicator/></label>
                                <InputText name="address" disabled={ modal.editable } value={fields.address} onChange={e => fieldChangeHandle(e)} className='w-full' aria-describedby="address-help" invalid={ invalid.address } />
                                <small className='text-danger'>
                                    { invalid.address}
                                </small>
                            </div>

                            { modal.edit ? 
                            <div className="flex col-12 flex-column gap-1">
                                <label htmlFor="status" className="font-bold">Status</label>
                                <Dropdown  disabled={ modal.editable } value={fields.status} onChange={e => fieldChangeHandle(e)} placeholder="Select a Status" name="status" className="w-full" 
                                    options={ ['Active', 'Inactive'] } invalid={ invalid.status } />
                                <small className='text-danger'>
                                    { invalid.status}
                                </small>
                            </div> : "" }
                            <div className="flex col-12 flex-column gap-1">
                                <label htmlFor="remarks" className="font-bold">Remarks</label>
                                <InputTextarea  className='w-full' disabled={ modal.editable } value={fields.remarks} name="remarks" onChange={(e) => fieldChangeHandle(e)} rows={2} cols={30} invalid={ invalid.remarks }  />
                                <small className='text-danger'>
                                    { invalid.remarks}
                                </small>
                            </div>
                        </div>
                        
                    </Dialog>
                </div> 
                
            </div> 
        </>
    )
}

export default Parish
