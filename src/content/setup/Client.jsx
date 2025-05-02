import React, { useState, useEffect, useRef, setState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';
import swal from 'sweetalert';
import { getClientData } from '../../utils/List';
import { deleteData, storeData, updateData } from '../../utils/Data';
import { RequiredIndicator } from '../../utils/validator';

function Client() {

    const [ data, setData ] = useState([]);
    const [ disabled, setDisabled ] = useState(true);
    const [ fields, setFields] = useState({});
    const [ invalid, setInvalid ] = useState([]);
    const [ loading, setLoading ] = useState(false) 
    const [ modal, setModal ] = useState({});
    const [ selected, setSelected ] = useState({});
    const [ selectedData, setSelectedData ] = useState({});
    const [ visible, setVisible ] = useState(false);
    const table_name = "client_table";

    const modeOption = [
        { name: 'Name', value: 'name'}, 
        { name: 'Code', value: 'code'}, 
        { name: 'Contact No', value: 'contact_no'}, 
        { name: 'Description', value: 'description'}, 
        { name: 'Status', value: 'status'}, 
        { name: 'Created By', value: 'created_by'}, 
        { name: 'Created At', value: 'created_at'}, 
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
            const fetchData = await getClientData(filter);
            setTimeout(()=>{
                setLoading(false);
                setData(fetchData);
            },1000)
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
        label === 'Add' ? setFields({}) : setFields(selected),
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

    const fieldChangeHandle = (e) => {
        setFields((fields) => ({
            ...fields,
            [e.target.name]: e.target.value,
        }));
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
            'name': fields.name ? false : 'This field is required',
            'code': fields.code ? false : 'This field is required',
            'contact_no': fields.contact_no ? false : 'This field is required',
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
            <Button raised label="Close" onClick={() => setVisible(false)} text className="p-button-secondary mr-3" />
            { !modal.editable ? <Button raised label="Submit" onClick={ handleSubmit }  className="p-button-primary"/> : '' } 
        </div>
    );
   
    useEffect(()=> {
        loadData(table_name);
    }, [])


    return (
        <>
             <div className="card " >   
                <div className="flex justify-content-start mt-2 row gap-1 mb-4">
                    <div className="flex row gap-2">
                        <Dropdown name="mode" value={filter.mode} onChange={ handleFilterChange } options={modeOption} optionLabel="name" placeholder="Select a Filter" className="w-full md:w-14rem" />
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
                        <Column field="name" sortable header="Name"></Column>
                        <Column field="code" sortable header="Code"></Column>
                        <Column field="contact_no" sortable header="Contact No"></Column>
                        <Column field="description" sortable header="Description"></Column>
                        <Column field="status" sortable header="Status"></Column>
                        <Column field="created_by" sortable header="Created By"></Column>
                        <Column field="created_at" sortable header="Created At"></Column>
                    </DataTable>
                
                </div>

                <div className="card flex justify-content-center">
                     <Dialog header={ modal.label } draggable={false}  visible={visible} style={{ width: '25vw' }} onHide={() => {if (!visible) return; setVisible(false); }} footer={footerContent}>
                    
                        <div className="flex-rowflex flex-row flex-row">
                            <div className="flex flex-column gap-1 mt-2">
                                <label htmlFor="name" className="font-bold">Name <RequiredIndicator/></label>
                                <InputText name="name"  disabled={ modal.editable } value={fields.name} onChange={e => fieldChangeHandle(e)} className='w-full' aria-describedby="name-help" invalid={ invalid.name } />
                                <small className='text-danger'>
                                    { invalid.name}
                                </small>
                            </div>

                            <div className="flex flex-column gap-1 mt-2">
                                <label htmlFor="code" className="font-bold">Code <RequiredIndicator/></label>
                                <InputText name="code" disabled={ modal.editable } value={fields.code} onChange={e => fieldChangeHandle(e)} className='w-full' aria-describedby="code-help" invalid={ invalid.code } />
                                <small className='text-danger'>
                                    { invalid.code}
                                </small>
                            </div>

                            <div className="flex flex-column gap-1 mt-2">
                                <label htmlFor="contact_no" className="font-bold">Contact <RequiredIndicator/></label>
                                <InputText name="contact_no" disabled={ modal.editable } value={fields.contact_no} onChange={e => fieldChangeHandle(e)} className='w-full' aria-describedby="contact_no-help" invalid={ invalid.contact_no } />
                                <small className='text-danger'>
                                    { invalid.contact_no}
                                </small>
                            </div>
                       
                            { modal.label != "Add" ? <div className="flex flex-column gap-1 mt-2">
                                <label htmlFor="status" className="font-bold">Status</label>
                                <Dropdown  disabled={ modal.editable } value={fields.status} onChange={e => fieldChangeHandle(e)} placeholder="Select a Status" name="status" className="w-full" 
                                    options={ ['Active', 'Inactive'] } invalid={ invalid.status } />
                                <small className='text-danger'>
                                    { invalid.status}
                                </small>
                            </div> : ''}
                            
                            <div className="flex flex-column gap-1 mt-2">
                                <label htmlFor="description" className="font-bold">Description</label>
                                <InputTextarea  className='w-full' disabled={ modal.editable } value={fields.description} name="description" onChange={(e) => fieldChangeHandle(e)} rows={5} cols={30} invalid={ invalid.description }  />
                                <small className='text-danger'>
                                    { invalid.description}
                                </small>
                            </div>
                        </div>
                        
                    </Dialog>
                </div> 
                
            </div> 
        </>
    )
}

export default Client
