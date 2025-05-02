import React, { useState, useEffect, useRef, setState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';
import { getPriestData } from '../../utils/List';
import { deleteData, storeData, updateData } from "../../utils/Data"
import swal from 'sweetalert';
import { getChapel, getClient, getParish } from '../../utils/Function';
import { InputNumber } from 'primereact/inputnumber';
import { RequiredIndicator } from '../../utils/validator';

function Priest() {

    
    const [ clientOption, setClientOption ] = useState([]);
    const [ data, setData ] = useState([]);
    const [ disabled, setDisabled ] = useState(true);
    const [ fields, setFields] = useState({});
    const [ invalid, setInvalid ] = useState([]);
    const [ loading, setLoading ] = useState(false) 
    const [ modal, setModal ] = useState({});
    const [ parishFilterLoading, setParishFilterLoading ] = useState(false)
    const [ parishFilterOption, setParishFilterOption ] = useState([]);
    const [ parishLoading, setParishLoading ] = useState(false)
    const [ parishOption, setParishOption ] = useState([]);

    const [ chapelFilterLoading, setChapelFilterLoading ] = useState(false)
    const [ chapelFilterOption, setChapelFilterOption ] = useState([]);
    const [ chapelLoading, setChapelLoading ] = useState(false)
    const [ chapelOption, setChapelOption ] = useState([]);

    const [ selected, setSelected ] = useState({});
    const [ selectedData, setSelectedData ] = useState({});
    const [ visible, setVisible ] = useState(false);
    const table_name = "priest_table";

    const modeOption = [
        { name: 'Address', value: 'address'}, 
        { name: 'Chapel Rate', value: 'chapel_rate'}, 
        { name: 'Contact No', value: 'contact_no'}, 
        { name: 'Created At', value: 'created_at'}, 
        { name: 'Created By', value: 'created_by'}, 
        { name: 'Description', value: 'description'}, 
        { name: 'Name', value: 'name'}, 
        { name: 'Parent', value: 'parent'}, 
        { name: 'Parish Rate', value: 'parish_rate'}, 
        { name: 'Remarks', value: 'remarks'}, 
        { name: 'Status', value: 'status'}, 
    ]

    const [filter, setFilter] = useState({
        client: null,
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
            const fetchData = await getPriestData(filter);
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

    const chapel = async (target, action) => {
        try {
            const fetchData = await getChapel(target);
            action === 'filter' ? setChapelFilterLoading(true) : setChapelLoading(true) ;
            setChapelLoading(true)
            setTimeout(()=>{
                setChapelOption(fetchData);
                setChapelLoading(false);

                action === 'filter' ? setChapelFilterOption(fetchData) : setChapelOption(fetchData) ;
                action === 'filter' ? setChapelFilterLoading(false) : setChapelLoading(false) ;
            },500)
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
                break;
            default:
                setFields(selected)
                parish(selected.client_id.id,'field')
                chapel(selected.chapel_id.id,'field')
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
        console.log(e.target.name);
        e.target.name  === "client" ? parish(e.target.value.id,'filter') : '';
        e.target.name  === "parish" ? chapel({ client_id: filter.client.id, parish_id: e.target.value.id},'filter') : '';
        setFilter((filter) => ({
          ...filter,
          [e.target.name]: e.target.value,
        }));
    };

    const fieldChangeHandle = (e,target) => {
        if(target){
            setFields((fields) => ({
                ...fields,
                [target]: e.value,
            }));
        }else{
            console.log(e.target.value.id);
            e.target.name === "client_id" ? parish(e.target.value.id,'field') : '';
            e.target.name === "parish_id" ? chapel(e.target.value.id,'field') : '';
            setFields((fields) => ({
                ...fields,
                [e.target.name]: e.target.value,
            }));
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
            'parish_id': fields.parish_id ? false : 'This field is required',
            'chapel_id': fields.chapel_id ? false : 'This field is required',
            'name': fields.name ? false : 'This field is required',
            'priest_rate': fields.priest_rate ? false : 'This field is required',
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
            <Button text raised label="Close" onClick={() => setVisible(false)} className="p-button-secondary mr-3" />
            { !modal.editable ? <Button raised label="Submit" onClick={ handleSubmit } className="p-button-primary"/> : '' } 
        </div>
    );

    const formatCurrency = (value) => {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'PHP' });
    };

    const amountBodyTemplate = (rowData) => {
        return formatCurrency(rowData.priest_rate);
    };
   
    useEffect(()=> {
        loadData(table_name);
        client();
    }, [])


    return (
        <>
             <div className="card " >   
                <div className="flex justify-content-start mt-2 row gap-1 mb-4">
                    <div className="flex row gap-1">
                        <Dropdown  name="client" value={filter.client} onChange={ handleFilterChange } options={clientOption} optionLabel="name" placeholder="Select a Client" className="w-full md:w-18rem" />
                        <Dropdown  name="parish" value={filter.parish} onChange={ handleFilterChange } options={parishFilterOption} optionLabel="name" placeholder={parishFilterLoading ? "Loading..." : "Select a Parish" } className="w-full md:w-18rem" loading={parishFilterLoading} />
                        <Dropdown  name="chapel" value={filter.chapel} onChange={ handleFilterChange } options={chapelFilterOption} optionLabel="name" placeholder={chapelFilterLoading ? "Loading..." : "Select a Chapel" } className="w-full md:w-18rem" loading={chapelFilterLoading} />
                        <Dropdown  name="mode" value={filter.mode} onChange={ handleFilterChange } options={modeOption} optionLabel="name" placeholder="Select a Filter" className="w-full md:w-18rem" />
                        <InputText onChange={ handleFilterChange } name="keyword" className="w-full md:w-18rem" placeholder="Enter a keyword.." />
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
                    <Column field="parish" sortable header="Parish"></Column>
                    <Column field="chapel" sortable header="Chapel"></Column>
                    <Column field="name" sortable header="Priest"></Column>
                    <Column field="priest_rate" sortable header="Priest Rate" body={amountBodyTemplate}></Column>
                    <Column field="description" sortable header="Description"></Column>
                    <Column field="status" sortable header="Status"></Column>
                    <Column field="created_by" sortable header="Created By"></Column>
                    <Column field="created_at" sortable header="Created At"></Column>
                </DataTable>
                
                </div>

                <div className="card flex justify-content-center">
                     <Dialog header={ modal.label } className='' draggable={false}  visible={visible} style={{ width: '25vw' }} onHide={() => {if (!visible) return; setVisible(false); }} footer={footerContent}>
                    
                        <div className="flex-rowflex flex-row flex-wrap">
                            <div className="flex flex-column gap-1 mt-2">
                                <label className='font-bold' htmlFor="client_id">Client <RequiredIndicator/></label>
                                <Dropdown name="client_id" value={fields.client_id} onChange={(e) => fieldChangeHandle(e)} options={clientOption} optionLabel="name" placeholder="Select a Client" className="w-full" invalid={ invalid.client_id }  disabled={ modal.editable }/>
                                <small className='text-danger'>
                                    { invalid.client_id}
                                </small>
                            </div>

                            <div className="flex flex-column gap-1 mt-2">
                                <label className='font-bold' htmlFor="parish_id">Parish <RequiredIndicator/></label>
                                <Dropdown name="parish_id" value={fields.parish_id} onChange={(e) => fieldChangeHandle(e)} options={parishOption} loading={parishLoading} optionLabel="name" placeholder={parishLoading ? "Loading..." : "Select a Parish" } className="w-full" invalid={ invalid.parish_id }  disabled={ modal.editable }/>
                                <small className='text-danger'>
                                    { invalid.parish_id}
                                </small>
                            </div>

                            <div className="flex flex-column gap-1 mt-2">
                                    <label className='font-bold' htmlFor="chapel_id">Chapel <RequiredIndicator/></label>
                                    <Dropdown name="chapel_id" value={fields.chapel_id} onChange={(e) => fieldChangeHandle(e)} options={chapelOption} loading={chapelLoading} optionLabel="name" placeholder={chapelLoading ? "Loading..." : "Select a Chapel" } className="w-full" invalid={ invalid.chapel_id }  disabled={ modal.editable }/>
                                    <small className='text-danger'>
                                    { invalid.chapel_id }
                                </small>
                            </div>
                            
                            <div className="flex flex-column gap-1 mt-2">
                                <label htmlFor="name" className="font-bold">Name <RequiredIndicator/></label>
                                <InputText name="name"  disabled={ modal.editable } value={fields.name} onChange={e => fieldChangeHandle(e)} className='w-full' aria-describedby="name-help" invalid={ invalid.name } />
                                <small className='text-danger'>
                                    { invalid.name}
                                </small>
                            </div>

                            <div className="flex flex-column gap-1 mt-2">
                                <label className="font-bold">Rate <RequiredIndicator/></label>
                                <div className="p-inputgroup flex-1">
                                    <span className="p-inputgroup-addon">₱</span>
                                    <InputNumber name="priest_rate" className='w-auto' placeholder="0" value={fields.priest_rate} invalid={ invalid.priest_rate } onChange={e => fieldChangeHandle(e,'priest_rate')}  disabled={ modal.editable }/>
                                </div>
                                <small className='text-danger'>
                                    { invalid.priest_rate}
                                </small>
                            </div>
                        
                            { modal.edit ? 
                            <div className="flex flex-column gap-1 mt-2">
                                <label htmlFor="status" className="font-bold">Status</label>
                                <Dropdown  disabled={ modal.editable } value={fields.status} onChange={e => fieldChangeHandle(e)} placeholder="Select a Status" name="status" className="w-full" 
                                    options={ ['Active', 'Inactive'] } invalid={ invalid.status } />
                                <small className='text-red-600'>
                                    { invalid.status}
                                </small>
                            </div> : "" }
                            <div className="flex flex-column gap-1 mt-2">
                                <label htmlFor="description" className="font-bold">Description</label>
                                <InputTextarea  className='w-full' disabled={ modal.editable } value={fields.description} name="description" onChange={(e) => fieldChangeHandle(e)} rows={2} cols={30} invalid={ invalid.description }  />
                                <small className='text-red-600'>
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

export default Priest
