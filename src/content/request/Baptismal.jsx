import React, { useState, useEffect, useRef, setState } from 'react';
import swal from 'sweetalert';
import { Badge } from 'primereact/badge';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Carousel } from 'primereact/carousel';
import { classNames } from 'primereact/utils';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { deleteData, storeData, updateData, updateFileData } from "../../utils/Data"
import { Dialog } from 'primereact/dialog';
import { Divider } from 'primereact/divider';
import { Dropdown } from 'primereact/dropdown';
import { getBaptismalData } from '../../utils/List';
import { getClient, getParish, getPriest, getStatusSeverity } from '../../utils/Function';
import { Image } from 'primereact/image';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Stepper } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import moment from 'moment-timezone';
import { RequiredIndicator } from '../../utils/validator';

function Baptismal() {

    const [ clientOption, setClientOption ] = useState([]);
    const [ data, setData ] = useState([]);
    const [ disabled, setDisabled ] = useState(true);
    const [ expandedRows, setExpandedRows ] = useState(null);
    const [ fields, setFields] = useState({});
    const [ invalid, setInvalid ] = useState([]);
    const [ loading, setLoading ] = useState(false) 
    const [ modal, setModal ] = useState({});
    const [ parishFilterLoading, setParishFilterLoading ] = useState(false)
    const [ parishFilterOption, setParishFilterOption ] = useState([]);
    const [ parishLoading, setParishLoading ] = useState(false)
    const [ parishOption, setParishOption ] = useState([]);
    const [ previewFileDialog, setPreviewFileDialog ] = useState(false);
    const [ priestLoading, setPriestLoading ] = useState(false)
    const [ priestOption, setPriestOption ] = useState([]);
    const [ selected, setSelected ] = useState({});
    const [ selectedData, setSelectedData ] = useState({});
    const [ visible, setVisible ] = useState(false);
    const stepperRef = useRef(null);
    const table_name = "baptism_table";
    const toast = useRef(null);
    
    let emp = {
        id: null,
        firstname: '',
        middlename: '',
        lastname: '',
    };

    const [ child, setChild ] = useState(emp);
    const [ childs, setChilds ] = useState([]);
    const [ parent, setParent ] = useState(emp);
    const [ parents, setParents ] = useState([]);
    const [ selectedchilds, setSelectedChild ] = useState(null);
    const [ selectedParents, setSelectedParent ] = useState(null);
    
    const [ deleteDialog, setDeleteDialog ] = useState(false);
    const [ dialog, setDialog ] = useState(false);
    const [ submitted, setSubmitted ] = useState(false);
    const [ target,setTarget]  = useState(null);
    
    const modeOption = [
        { name: 'Control ID', value: 'control_id' },
        { name: 'Created At', value: 'created_at' },
        { name: 'Created By', value: 'created_by' },
        { name: 'Start Date', value: 'start' },
        { name: 'End Date', value: 'end' },
        { name: 'Father', value: 'father' },
        { name: 'Mother', value: 'mother' },
        { name: 'No Of Guest', value: 'no_of_guest' },
        { name: 'Parish Rate', value: 'parish_rate' },
        { name: 'Remarks', value: 'remarks' },
        { name: 'Request Status', value: 'request_status' },
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
            const fetchData = await getBaptismalData(filter);
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

    const priest = async (target) => {
        console.log(target);
        try {
            const fetchData = await getPriest(target);
            setPriestLoading(true)
            setTimeout(()=>{
                setPriestOption(fetchData);
                setPriestLoading(false);
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
        let label = e.currentTarget.getAttribute('data-label');

        switch (label) {
            case 'Add':
                setFields({})
                break;
            default:
                setFields(selected)
                setChilds(selected.childs)
                setParents(selected.parents)
                parish(selected.client_id.id,'field')
                priest(selected.priest_id.id)
                break;
        }

        setModal({
            label: label,
            editable: label === 'View' ? true : false,
            icon: label === 'View' ? 'pi pi-times' : 'pi pi-check',
            severity: label === 'View' ? 'secondary' : 'primary',
        })
        setInvalid(false)
        setVisible(true)
    }

    const getMedia = (file) => {
        if (file) {
            const imageUrl = URL.createObjectURL(file); // Generate a temporary URL
            // Ensure fields.image is an array

            if (!Array.isArray(fields.image)) {
                fields.image = [];
            }
           
            // Push the new object into the array
            fields.image.push({
                uniq_key: 'Baptism-'+Math.random().toString(36).substring(2,7).toUpperCase(),
                module: 'Baptism',
                filename: file.name,
                baseURL: imageUrl,
                objectURL: file,
                created_by: 'R.Robl50',
                created_at: moment().format("MMMM D YYYY, h:mm:ss a")
            });

            setFields((fields) => ({
                ...fields,
                ['image']: fields.image,
            }));

        }
    }

    const handleFilterChange = (e) => {
        e.target.name  === "client" ? parish(e.target.value.id,'filter') : '';
        setFilter((filter) => ({
          ...filter,
          [e.target.name]: e.target.value,
        }));
    };

    const fieldChangeHandle = (e,target) => {
      
        if(target){
            if(target === 'files'){
                const file = e.target.files[0];
                getMedia(file);
            }else{
                setFields((fields) => ({
                    ...fields,
                    [target]: e.value,
                }));
            }
           
        }else{
            switch (e.target.name) {
                case 'client_id':

                    parish(e.target.value.id,'field');
                    setPriestOption([])
                    setFields((fields) => ({
                        ...fields,
                        [e.target.name]: e.target.value,
                        parish_id: null,
                        parish_rate: 0,
                        priest_id: null,
                        priest_rate: 0,
                    }));

                    break;
                case 'parish_id':
                    
                    // priest(e.target.value.id);
                    priest({ client_id: fields.client_id.id, parish_id: e.target.value.id});
                    setFields((fields) => ({
                        ...fields,
                        [e.target.name]: e.target.value,
                        parish_rate: e.target.value.parish_rate,
                    }));
                    
                    break;

                case 'priest_id':
                    
                    setFields((fields) => ({
                        ...fields,
                        [e.target.name]: e.target.value,
                        priest_rate: e.target.value.priest_rate,
                    }));
                    
                    break;

                case 'image':

                    const file = e.target.files[0];
                    
                    getMedia(file);

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
            'father_firstname': fields.father_firstname ? false : 'This field is required.',
            'father_middlename': fields.father_middlename ? false : 'This field is required.',
            'father_lastname': fields.father_lastname ? false : 'This field is required.',
            'mother_firstname': fields.mother_firstname ? false : 'This field is required.',
            'mother_middlename': fields.mother_middlename ? false : 'This field is required.',
            'mother_lastname': fields.mother_lastname ? false : 'This field is required.',
            'contact': fields.contact ? false : 'This field is required.',
            'address': fields.address ? false : 'This field is required.',
            'client_id': fields.client_id ? false : 'This field is required.',
            'parish_id': fields.parish_id ? false : 'This field is required.',
            'parish_rate': fields.parish_rate ? false : 'This field is required.',
            'priest_id': fields.priest_id ? false : 'This field is required.',
            'priest_rate': fields.priest_rate ? false : 'This field is required.',
            'no_of_guest': fields.no_of_guest ? false : 'This field is required.',
            'date_start': fields.date_start ? false : 'This field is required.',
            'time_start': fields.time_start ? false : 'This field is required.',
            'date_end': fields.date_end ? false : 'This field is required.',
            'time_end': fields.time_end ? false : 'This field is required.',
            'image': fields.image ? fields.image.length != 0 ? false : "You need to upload atleast 1 file" : 'You need to upload atleast 1 file.',
            'childs': childs.length != 0 ? false : "God child's need atleast 1 record.",
            'parents': parents.length != 0 ? false : "God parent's need atleast 1 record.",
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

    // for God Child
    const openNew = (e,formtarget) => {
        setTarget(formtarget);
        switch (formtarget) {
            case 'God Child':
                setChild(emp);
                setDialog(true);
                setSubmitted(false);
                break;
            default:
                setParent(emp);
                setDialog(true);
                setSubmitted(false);
                break;
        }
    };

    const hideDialog = () => {
        setSubmitted(false);
        setDialog(false);
        
    };

    const hidedeleteDialog = () => {
        setDeleteDialog(false);
    };

    const hidePreviewFileDialog = () => {
        setPreviewFileDialog(false);
    };

    const saveRecord = () => {
        setSubmitted(true);
        switch (target) {
            case 'God Child':
         
                if(child.firstname && child.middlename && child.lastname) {
                    let _childs =  [...childs];
                    let _child = { ...child };

                    if (child.id) {
                        const index = findIndexById(child.id);
                        _childs[index] = _child;
                        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'God Child Updated', life: 3000 });
                    } else {
                        _child.id = createId();
                        _child.data = 'God Child';
                        _childs.push(_child);
                        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'God Child Added', life: 3000 });
                    }
                    setDialog(false);
                    setChilds(_childs);
                    setChild(emp);
                    setFields((fields) => ({ ...fields, ['childs']: _childs,  }));
                }   
                break;

            case 'God Parent':
                if (parent.firstname || parent.middlename || parent.lastname) {
                    let _parents =  [...parents];
                    let _parent = { ...parent };
        
                    if (parent.id) {
                        const index = findIndexById(parent.id);
                        _parents[index] = _parent;
                        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'God Parent Updated', life: 3000 });
                    } else {
                        _parent.id = createId();
                        _parent.data = 'God Parent';
                        _parents.push(_parent);
                        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'God Parent Added', life: 3000 });
                    }
                    setDialog(false);
                    setParents(_parents);
                    setParent(emp);
                    setFields((fields) => ({ ...fields, ['parents']: _parents,  }));
                }
                break;

            default:
                break;
        }
        
    };

    const edit = (value) => {
        setTarget(value.data)
        
        switch (value.data) {
            case 'God Child':
                setChild({ ...value })
                break;
        
            default:
                setParent({ ...value })
                break;
        }
        setDialog(true);
    };

    const confirmDelete = (value) => {
        switch (value.data) {
            case 'God Child':
                setChild(value)
                break;
        
            default:
                setParent(value)
                break;
        }
        setDeleteDialog(true);
    };

    const deleteRecords = () => {
        switch (child.data) {
            case 'God Child':
                let _childs = childs.filter((val) => val.id !== child.id);
                setChilds(_childs);
                setDeleteDialog(false);
                setChild(emp);
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Child Remove', life: 3000 });
                break;
            default:
                let _parents = parents.filter((val) => val.id !== parent.id);
                setParents(_parents);
                setDeleteDialog(false);
                setParent(emp);
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Parent Remove', life: 3000 });
                break;
        }
    };

    const findIndexById = (id) => {
        let index = -1;
       
        switch (target) {
            case 'God Child':
                for (let i = 0; i < childs.length; i++) {
                    if (childs[i].id === id) {
                        index = i;
                        break;
                    }
                }
                break;
        
            default:
                if (parents[i].id === id) {
                    index = i;
                    break;
                }
                break;
        }
        

        return index;
    };

    const createId = () => {
        let id = '';
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        return id;
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
       
        switch (target) {
            case 'God Child':
                let _child = { ...child };
                _child[`${name}`] = val;
                setChild(_child);
                break;
        
            default:
                let _parent = { ...parent };
                _parent[`${name}`] = val;
                setParent(_parent);
                break;
        }
        
    };
    
    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded size='small' className="mr-2" onClick={() => edit(rowData)} />
                <Button icon="pi pi-trash" rounded size='small' severity="danger" onClick={() => confirmDelete(rowData)} />
            </React.Fragment>
        );
    };

    const dialogFooter = (
        <React.Fragment>
            <Button raised label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button raised label="Save" icon="pi pi-check" onClick={saveRecord} />
        </React.Fragment>
    );

    const deleteDialogFooter = (
        <React.Fragment>
            <Button raised label="No" icon="pi pi-times" outlined onClick={hidedeleteDialog} />
            <Button raised label="Yes" icon="pi pi-check" severity="danger" onClick={deleteRecords} />
        </React.Fragment>
    );

    const allowExpansion = (rowData) => {
        return rowData.others.length > 0;
    };

    const statusBodyTemplate = (rowData) => {
        return <Tag value={rowData.status.toUpperCase()} severity={getStatusSeverity(rowData.status)}></Tag>;
    };

    const documentBodyTemplate = (rowData) => {
        return <i className="pi pi-file p-overlay-badge" onClick={(e) => previewFile(rowData)} style={{ fontSize: '1.5rem' }}>
            <Badge value={rowData.documents}></Badge>
        </i>;
    };

    const rowExpansionTemplate = (data) => {
        return (
            <div className="">
                <DataTable value={data.others}>
                    <Column />
                    <Column field="father" header="Father"></Column>
                    <Column field="mother" header="Mother"></Column>
                    <Column field="no_of_guest" header="No of Guest"></Column>
                    <Column field="remarks" header="Remarks" ></Column>
                    <Column field="created_by" header="Created by" ></Column>
                    <Column field="created_at" header="Date Created" ></Column>
                </DataTable>
            </div>
        );
    };

    const previewFile = (rowData) => {
        // setVisibleLoader(true)
        // ShowLoader(setVisibleLoader);
        setTimeout(() => {
            setFields(rowData)
            setPreviewFileDialog(true);
        }, 1500); 
       
    }

    const footerContent = (
        <div className=''>
            <Button label="Close" onClick={(e) => previewClose(e)} className="p-button-secondary"/>
        </div>
    );

    const previewClose = (e) => {
        setPreviewFileDialog(false)
        if(previewFileDialog){
            toast.current.show({ severity: 'info', summary: 'Success', detail: 'File Remove' });
            updateFileData(table_name,fields,loadData);
        }
    }

    const removeImage = (e,uniq_key) => {
        
        const newImg = fields.image.filter(item => item.uniq_key !== uniq_key);
        setFields((fields) => ({
            ...fields,
            ['image']: newImg,
        }));
        
    }
    
    const responsiveOptions = [
        {
            breakpoint: '1400px',
            numVisible: 2,
            numScroll: 1
        },
        {
            breakpoint: '1199px',
            numVisible: 3,
            numScroll: 1
        },
        {
            breakpoint: '767px',
            numVisible: 2,
            numScroll: 1
        },
        {
            breakpoint: '575px',
            numVisible: 1,
            numScroll: 1
        }
    ];

    const previewTemplate = (rowFiles) => {
        return (

            <div className="surface-border m-1 text-center py-4 px-3">
                    <div className="mb-1">
                        <Image src={rowFiles.baseURL} alt="Image" width="170"height='160' preview />
                    </div>
                    <div>
                    <h5 className='mb-1 text-wrap'>{rowFiles.filename.substring(0, 17)}</h5>
                    <h6 className='mt-0 mb-3'>{rowFiles.uniq_key}</h6 >
                    <div className="mt-3 flex flex-wrap gap-2 justify-content-center">
                        <Button icon="pi pi-times" severity='danger' rounded size='small' id={rowFiles.uniq_key} onClick={(e) => { removeImage(e,rowFiles.uniq_key) }} raised />
                    </div>
                    </div>
            </div>

        );
    };

    

    const formatCurrency = (value) => {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'PHP' });
    };

    const amountBodyTemplate = (rowData) => {
        return formatCurrency(rowData.parish_rate);
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
                        <Dropdown   name="client" value={filter.client} onChange={ handleFilterChange } options={clientOption} optionLabel="name" placeholder="Select a Client" className="w-full md:w-14rem" />
                        <Dropdown   name="parish" value={filter.parish} onChange={ handleFilterChange } options={parishFilterOption} optionLabel="name" placeholder={parishFilterLoading ? "Loading..." : "Select a Parish" } className="w-full md:w-14rem" loading={parishFilterLoading} />
                        <Dropdown   name="mode" value={filter.mode} onChange={ handleFilterChange } options={modeOption} optionLabel="name" placeholder="Select a Filter" className="w-full md:w-14rem" />
                        <InputText onChange={ handleFilterChange } name="keyword" className="w-full md:w-15rem" placeholder="Enter a keyword.." />
                        <Button raised label='Show' className='border-round-md' severity="info" icon="pi pi-search" onClick={ (e) => { btnLoad(e) } } />
                    </div>
                </div>
           
                <div className="flex justify-content-end row gap-1 mb-4">
                    <Button raised label='Add' onClick={(e) => modalAction(e)} data-label='Add' className='border-round-md' icon='pi pi-plus' />
                    <Button raised label='View' onClick={(e) => modalAction(e)} data-label='View' className='border-round-md' severity="secondary" icon='pi pi-eye' disabled={ disabled } />
                    <Button raised label='Edit' onClick={(e) => modalAction(e)} data-label='Edit' className='border-round-md' severity="help" icon='pi pi-pencil' disabled={ disabled }/>
                    <Button raised label='Delete' onClick={(e) => { handeDelete(e) }} className='border-round-md' severity="danger" icon='pi pi-trash' disabled={ disabled }/>
                </div>

                 <div style={ { minHeight: '500px'  } }>
                    {/* body={amountBodyTemplate} */}
                    <DataTable value={data} lazy loading={loading} selectionMode="single" selection={selectedData} onSelectionChange={(e) => setSelectedData(e.value)}  dataKey="id" 
                        onRowSelect={onRowSelect} onRowUnselect={onRowUnselect} metaKeySelection={false} tableStyle={{ minWidth: '60rem' }}
                        expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data)} rowExpansionTemplate={rowExpansionTemplate} >
                        <Column expander={allowExpansion} style={{ width: '5rem' }} />
                        <Column field="client" sortable header="Client"></Column>
                        <Column field="parish" sortable header="Parish"></Column>
                        <Column field="control_id" sortable header="Control ID"></Column>
                        <Column field="start" header="Start (Date/Time)" sortable></Column>
                        <Column field="end" header="End (Date/Time)"  sortable></Column>
                        <Column field="parish_rate" sortable header="Parish Rate" body={amountBodyTemplate}></Column>
                        <Column field="status" sortable header="Status" body={statusBodyTemplate}></Column>
                        <Column field="documents" sortable header="Documents" body={documentBodyTemplate}></Column>
                    </DataTable>
                
                </div>

                <div className="card flex justify-content-center">
                <Dialog header={modal.label} className=''  visible={visible} style={{ width: '60vw' }} onHide={() => {if (!visible) return; setVisible(false); }} draggable={false} >
                    
                    <Stepper ref={stepperRef} style={{ flexBasis: '50rem' }}>
                        <StepperPanel header="Guardian" >
                           
                            <div className="flex flex-column h-auto mb-5">
                                <Divider className='-mb-1 font-bold'>Father Details</Divider>

                                <div className="flex col-12 flex-row-column gap-1">

                                    <div className="flex col-4 flex-column gap-1">
                                        <label className='font-bold' htmlFor="father_firstname">First Name <RequiredIndicator/></label>
                                        <InputText name="father_firstname"  value={fields.father_firstname} onChange={e => fieldChangeHandle(e)} className='w-full' aria-describedby="father_firstname-help" invalid={ invalid.father_firstname } disabled={ modal.editable} />
                                        <small className='text-danger'>
                                            { invalid.father_firstname}
                                        </small>
                                    </div>

                                     <div className="flex col-3 flex-column gap-1">
                                        <label className='font-bold' htmlFor="father_middlename">Middle Name <RequiredIndicator/></label>
                                        <InputText name="father_middlename" value={fields.father_middlename} onChange={e => fieldChangeHandle(e)} className='w-full' aria-describedby="father_middlename-help" invalid={ invalid.father_middlename }  disabled={ modal.editable} />
                                        <small className='text-danger'>
                                            { invalid.father_middlename}
                                        </small>
                                    </div>
                               
                                     <div className="flex col-4 flex-column gap-1">
                                        <label className='font-bold' htmlFor="father_lastname">Last Name <RequiredIndicator/></label>
                                        <InputText name="father_lastname" value={fields.father_lastname} onChange={e => fieldChangeHandle(e)} className='w-full' aria-describedby="father_lastname-help" invalid={ invalid.father_lastname }  disabled={ modal.editable} />
                                        <small className='text-danger'>
                                            { invalid.father_lastname}
                                        </small>
                                    </div>

                                     <div className="flex col-1 flex-column gap-1">
                                        <label className='font-bold' htmlFor="father_suffix">Suffix</label>
                                        <InputText name="father_suffix" value={fields.father_suffix} onChange={e => fieldChangeHandle(e)} className='w-5rem' aria-describedby="father_suffix-help" invalid={ invalid.father_suffix }  disabled={ modal.editable} />
                                        <small className='text-danger'>
                                            { invalid.father_suffix}
                                        </small>
                                    </div>

                                </div>

                                <Divider className='-mb-1 font-bold'>Mother Details</Divider>

                                <div className="flex col-12 flex-row-column gap-1">
                                    <div className="flex col-4 flex-column gap-1">
                                        <label className='font-bold' htmlFor="mother_firstname">First Name <RequiredIndicator/></label>
                                        <InputText name="mother_firstname"  value={fields.mother_firstname} onChange={e => fieldChangeHandle(e)} className='w-full' aria-describedby="mother_firstname-help" invalid={ invalid.mother_firstname } disabled={ modal.editable} />
                                        <small className='text-danger'>
                                            { invalid.mother_firstname}
                                        </small>
                                    </div>

                                    <div className="flex col-3 flex-column gap-1">
                                        <label className='font-bold' htmlFor="mother_middlename">Middle Name <RequiredIndicator/></label>
                                        <InputText name="mother_middlename" value={fields.mother_middlename} onChange={e => fieldChangeHandle(e)} className='w-full' aria-describedby="mother_middlename-help" invalid={ invalid.mother_middlename }  disabled={ modal.editable} />
                                        <small className='text-danger'>
                                            { invalid.mother_middlename}
                                        </small>
                                    </div>
                               
                                    <div className="flex col-4 flex-column gap-1">
                                        <label className='font-bold' htmlFor="mother_lastname">Last Name <RequiredIndicator/></label>
                                        <InputText name="mother_lastname" value={fields.mother_lastname} onChange={e => fieldChangeHandle(e)} className='w-full' aria-describedby="mother_lastname-help" invalid={ invalid.mother_lastname }  disabled={ modal.editable} />
                                        <small className='text-danger'>
                                            { invalid.mother_lastname}
                                        </small>
                                    </div>

                                    <div className="flex col-1 flex-column gap-1">
                                        <label className='font-bold' htmlFor="mother_suffix">Suffix</label>
                                        <InputText name="mother_suffix" value={fields.mother_suffix} onChange={e => fieldChangeHandle(e)} className='w-5rem' aria-describedby="mother_suffix-help" invalid={ invalid.mother_suffix }  disabled={ modal.editable} />
                                        <small className='text-danger'>
                                            { invalid.mother_suffix}
                                        </small>
                                    </div>

                                </div>

                                <Divider className='-mb-1 font-bold'>Others</Divider>

                                <div className="flex flex-row-column gap-1">
                                    <div className="flex col-4 flex-column gap-1">
                                        <label className='font-bold' htmlFor="contact">Contact <RequiredIndicator/></label>
                                        <InputNumber name="contact" useGrouping={false} className='w-auto'  value={fields.contact} invalid={ invalid.contact } onChange={e => fieldChangeHandle(e,'contact')}  disabled={ modal.editable } required/>
                                        <small className='text-danger'>
                                            { invalid.contact}
                                        </small>
                                    </div>

                                    <div className="flex col-8 flex-column gap-1">
                                        <label className='font-bold' htmlFor="address">Address <RequiredIndicator/></label>
                                        <InputText name="address" value={fields.address} onChange={e => fieldChangeHandle(e)} className='w-auto' aria-describedby="address-help" invalid={ invalid.address }  disabled={ modal.editable} />

                                        <small className='text-danger'>
                                            { invalid.address}
                                        </small>
                                    </div>
                                    
                                </div>
                               
                            </div> 

                            <div className="flex justify-content-between -mb-4">
                                <Button raised text label="Close" severity="secondary" icon="pi pi-times" onClick={() => setVisible(false)} />
                                <Button raised label="Next" icon="pi pi-arrow-right" iconPos="right" onClick={() => stepperRef.current.nextCallback()} />
                            </div>
                        </StepperPanel>
                        <StepperPanel header="Baptismal" >
                           
                            <div className="flex flex-column h-auto mb-5">

                            <Divider className='-mb-1 font-bold'>Baptismal Information</Divider>

                                <div className="flex col-12 flex-row-column gap-1">
                                    
                                    <div className="flex col flex-column gap-1">
                                        <label className='font-bold' htmlFor="client_id">Client <RequiredIndicator/></label>
                                        <Dropdown  name="client_id" value={fields.client_id} onChange={(e) => fieldChangeHandle(e)} options={clientOption} optionLabel="name" placeholder="Select a Client" className="w-full"  invalid={ invalid.client_id }  disabled={ modal.editable}/>
                                        <small className='text-danger'>
                                            { invalid.client_id}
                                        </small>
                                    </div>

                                    <div className="flex col flex-column gap-1">
                                        <label className='font-bold' htmlFor="parish_id">Parish <RequiredIndicator/></label>
                                        <Dropdown  name="parish_id" value={fields.parish_id} onChange={(e) => fieldChangeHandle(e)} options={parishOption} loading={parishLoading} optionLabel="name" placeholder={parishLoading ? "Loading..." : "Select a Parish" } className="w-full" invalid={ invalid.parish_id }  disabled={ modal.editable }/>
                                        <small className='text-danger'>
                                            { invalid.parish_id}
                                        </small>
                                    </div>

                                    <div className="flex col flex-column gap-1">
                                        <label className='font-bold' htmlFor="parish_rate">Parish Rate <RequiredIndicator/></label>
                                        <div className="p-inputgroup flex-1">
                                            <span className="p-inputgroup-addon">₱</span>
                                            <InputNumber name="parish_rate" className='w-full' placeholder="0" value={fields.parish_rate} invalid={ invalid.parish_rate } disabled />
                                        </div>
                                        <small className='text-gray-600'>
                                            Note: The rate is based on the parish.
                                        </small>
                                    </div>

                                    <div className="flex col flex-column gap-1">
                                        <label className='font-bold' htmlFor="priest_id">Priest <RequiredIndicator/></label>
                                        <Dropdown  name="priest_id" value={fields.priest_id} onChange={(e) => fieldChangeHandle(e)} options={priestOption} loading={priestLoading} optionLabel="name" placeholder={priestLoading ? "Loading..." : "Select a Parish" } className="w-full" invalid={ invalid.priest_id }  disabled={ modal.editable }/>
                                        <small className='text-danger'>
                                            { invalid.priest_id}
                                        </small>
                                    </div>
                                    
                                    
                                
                                    <div className="flex col flex-column gap-1">
                                        <label className='font-bold' htmlFor="priest_rate">Priest Rate <RequiredIndicator/></label>
                                        <div className="p-inputgroup flex-1">
                                            <span className="p-inputgroup-addon">₱</span>
                                            <InputNumber name="priest_rate" className='w-full' placeholder="0" value={fields.priest_rate} invalid={ invalid.priest_rate } disabled />
                                        </div>
                                        <small className='text-gray-600'>
                                        Note: The rate is based on the priest.
                                        </small>
                                    </div>
                                   
                                </div>

                                <div className="flex flex-row-column gap-1 flex-row mt-2">

                                    <div className="flex col flex-column gap-1">
                                        <label className='font-bold' htmlFor="no_of_guest">No. of Guest <RequiredIndicator/></label>
                                        <InputNumber name="no_of_guest" useGrouping={false} className='w-auto' placeholder="0" value={fields.no_of_guest} invalid={ invalid.no_of_guest } onChange={e => fieldChangeHandle(e,'no_of_guest')}  disabled={ modal.editable }/>
                                        <small className='text-danger'>
                                            { invalid.no_of_guest}
                                        </small>
                                    </div>

                                    <div className="flex col flex-column gap-1">
                                        <label className='font-bold' htmlFor="date_start">Start Date <RequiredIndicator/></label>
                                        <Calendar className='w-full' showIcon id="calendar-12h" name="date_start" minDate={new Date()} value={ modal.edit ? new Date(fields.date_start) : fields.date_start } onChange={(e) => fieldChangeHandle(e)}  invalid={ invalid.date_start }  disabled={ modal.editable} />
                                        <small className='text-danger'>
                                            { invalid.date_starts}
                                        </small>
                                    </div>

                                    <div className="flex col flex-column gap-1">
                                        <label className='font-bold' htmlFor="time_start">Start Time <RequiredIndicator/></label>
                                        <Calendar className='w-full' hourFormat="12"  showIcon timeOnly icon={() => <i className="pi pi-clock" />} id="calendar-12h" name="time_start"  value={ modal.edit ? new Date(fields.time_start) : fields.time_start } onChange={(e) => fieldChangeHandle(e)} showTime invalid={ invalid.time_start }  disabled={ modal.editable} />
                                        <small className='text-danger'>
                                            { invalid.time_starts}
                                        </small>
                                    </div>

                                    <div className="flex col flex-column gap-1">
                                        <label className='font-bold' htmlFor="date_end">End Date <RequiredIndicator/></label>
                                        <Calendar className='w-full' showIcon id="calendar-12h" name="date_end" minDate={new Date()} value={ modal.edit ? new Date(fields.date_end) : fields.date_end } onChange={(e) => fieldChangeHandle(e)}  invalid={ invalid.date_end }  disabled={ modal.editable} />
                                        <small className='text-danger'>
                                            { invalid.date_ends}
                                        </small>
                                    </div>

                                    <div className="flex col flex-column gap-1">
                                        <label className='font-bold' htmlFor="time_end">End Time <RequiredIndicator/></label>
                                        <Calendar className='w-full' hourFormat="12" timeOnly showIcon icon={() => <i className="pi pi-clock" />} id="calendar-12h" name="time_end"  value={ modal.edit ? new Date(fields.time_end) : fields.time_end } onChange={(e) => fieldChangeHandle(e)} invalid={ invalid.time_end }  disabled={ modal.editable} />
                                        <small className='text-danger'>
                                            { invalid.time_ends}
                                        </small>
                                    </div>
                                    
                                </div>

                                <div className="flex flex-row-column gap-1 flex-row mt-2">
                                    <div className="flex col-12  flex-column gap-1">
                                        <label className='font-bold' htmlFor="remarks">Remarks</label>
                                        <InputTextarea className='w-auto' name="remarks" value={fields.remarks} onChange={(e) => fieldChangeHandle(e)} rows={2} cols={30}  disabled={ modal.editable} />
                                        <small className='text-danger'>
                                            { invalid.remarks}
                                        </small>
                                    </div>
                                </div>
                               
                            </div> 

                            <div className="flex justify-content-between -mb-4">
                                <Button raised label="Back" severity="secondary" icon="pi pi-arrow-left" onClick={() => stepperRef.current.prevCallback()} />
                                <Button raised label="Next" icon="pi pi-arrow-right" iconPos="right" onClick={() => stepperRef.current.nextCallback()} />
                            </div>
                        </StepperPanel> 
                        <StepperPanel header="God Child" >
                            <div className="flex flex-column h-25rem ">
                                <Toast ref={toast} />   
                                <div className="flex justify-content-end p-2">
                                    <Button raised label="Add God Child"  className="child" icon="pi pi-plus" rounded size='small' severity="success" onClick={ (e) =>  { openNew(e,'God Child') }} />
                                </div>
                                <DataTable scrollable scrollHeight="250px" value={childs} selection={selectedchilds} onSelectionChange={(e) => setSelectedChild(e.value)} dataKey="id" >
                                    <Column field="firstname" header="Firstname" sortable style={{ minWidth: '12rem' }}></Column>
                                    <Column field="middlename" header="Middlename" sortable style={{ minWidth: '16rem' }}></Column>
                                    <Column field="lastname" header="Lastname" sortable style={{ minWidth: '10rem' }}></Column>
                                    { !modal.editable ? <Column body={actionBodyTemplate} header="Action" style={{ minWidth: '12rem' }}></Column> : ""}
                                    
                                </DataTable>
                                <small className='font-bold mt-3 text-danger'>
                                    { invalid.childs}
                                </small>
                            </div>
                            <div className="flex justify-content-between -mb-4">
                                <Button raised label="Back" severity="secondary" icon="pi pi-arrow-left" onClick={() => stepperRef.current.prevCallback()} />
                                <Button raised label="Next" icon="pi pi-arrow-right" iconPos="right" onClick={() => stepperRef.current.nextCallback()} />
                            </div>

                        </StepperPanel>
                        <StepperPanel header="God Parent" >
                            <div className="flex flex-column h-25rem ">
                                <Toast ref={toast} />   
                                <div className="flex justify-content-end p-2">
                                    <Button raised label="Add God Parent" className="parent" icon="pi pi-plus" rounded size='small' severity="success" onClick={ (e) =>  { openNew(e,'God Parent') }} />
                                </div>
                                <DataTable scrollable scrollHeight="250px" value={parents} selection={selectedParents} onSelectionChange={(e) => setSelectedParent(e.value)} dataKey="id" >
                                    <Column field="firstname" header="Firstname" sortable style={{ minWidth: '12rem' }}></Column>
                                    <Column field="middlename" header="Middlename" sortable style={{ minWidth: '16rem' }}></Column>
                                    <Column field="lastname" header="Lastname" sortable style={{ minWidth: '10rem' }}></Column>
                                    { !modal.editable ? <Column body={actionBodyTemplate} header="Action" style={{ minWidth: '12rem' }}></Column> : ''}
                                </DataTable>
                                <small className='font-bold mt-3 text-danger'>
                                    { invalid.parents }
                                </small>
                                
                            </div>

                            <div className="flex justify-content-between -mb-4">
                                <Button raised label="Back" severity="secondary" icon="pi pi-arrow-left" onClick={() => stepperRef.current.prevCallback()} />
                                <Button raised label="Next" icon="pi pi-arrow-right" iconPos="right" onClick={() => stepperRef.current.nextCallback()} />
                            </div>
                        </StepperPanel>

                        <StepperPanel header="File" >
                            <div className="flex flex-column h-30rem">
                                
                                <div className="flex mb-2 justify-content-center">
                                    <input type="file" name="image" className="custom-files" onChange={(e) => fieldChangeHandle(e,'files')} accept="image/*" />
                                </div>
                
                                <Carousel value={fields.image ?? []} numVisible={3} numScroll={1} responsiveOptions={responsiveOptions} itemTemplate={previewTemplate} />
                                
                                <div className="flex col-12 flex-row-column gap-1">
                                    <small className='text-danger'>
                                        { invalid.image}
                                    </small>
                                </div>
                                
                            </div>

                            <div className="flex justify-content-between -mb-4">
                                <Button raised label="Back" severity="secondary" icon="pi pi-arrow-left" onClick={() => stepperRef.current.prevCallback()} />
                                <Button raised label='Submit' severity={ modal.severity } icon={ modal.icon } iconPos="right" onClick={ modal.editable ? e=>{setVisible(false)} : handleSubmit} />
                            </div>
                        </StepperPanel>
                    </Stepper>
                        
                    </Dialog>

                    {/* -------------------------------------------------------------------------- */}

                    <Dialog visible={dialog} draggable={false} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header={ target } modal className="p-fluid" footer={dialogFooter} onHide={hideDialog}>
                
                        <div className="field">
                            <label className='font-bold' htmlFor="firstname"> Firstname  <RequiredIndicator/></label>
                            <InputText 
                                id="firstname" 
                                value={target === 'God Child' ? child.firstname : parent.firstname} 
                                onChange={(e) => onInputChange(e, 'firstname')} 
                                required 
                                autoFocus 
                                className={classNames({ 'p-invalid': submitted && !(target === 'God Child' ? child.firstname : parent.firstname) })}
                            />
                            
                            {submitted && (target === 'God Child' ? !child.firstname : !parent.firstname) && (
                                <small className="p-error">Firstname is required.</small>
                            )}
                            
                            
                        </div>
                        
                        <div className="field">
                            <label className='font-bold' htmlFor="middlename"> Middlename  <RequiredIndicator/></label>
                            <InputText 
                                id="middlename" 
                                value={target === 'God Child' ? child.middlename : parent.middlename} 
                                onChange={(e) => onInputChange(e, 'middlename')} 
                                required 
                                autoFocus 
                                className={classNames({ 'p-invalid': submitted && !(target === 'God Child' ? child.middlename : parent.middlename) })}
                            />
                            
                            {submitted && !(target === 'God Child' ? child.middlename : parent.middlename) && (
                                <small className="p-error">Middlename is required.</small>
                            )}
                        </div>

                        <div className="field">
                            <label className='font-bold' htmlFor="lastname"> Lastname  <RequiredIndicator/></label>
                            <InputText 
                                id="lastname" 
                                value={target === 'God Child' ? child.lastname : parent.lastname} 
                                onChange={(e) => onInputChange(e, 'lastname')} 
                                required 
                                autoFocus 
                                className={classNames({ 'p-invalid': submitted && !(target === 'God Child' ? child.lastname : parent.lastname) })}
                            />
                            
                            {/* Show validation message if submitted and lastname is missing */}
                            {submitted && !(target === 'God Child' ? child.lastname : parent.lastname) && (
                                <small className="p-error">Lastname is required.</small>
                            )}
                        </div>
                    
                    </Dialog>

                    <Dialog visible={deleteDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteDialogFooter} onHide={hidedeleteDialog}>
                        <div className="confirmation-content">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {child && (
                                <span>
                                    Are you sure you want to delete <b>{child.name}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog draggable={false} visible={previewFileDialog} style={{ width: '60rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Uploaded Files" footer={footerContent} modal  onHide={hidePreviewFileDialog}>
                    
                        <div className="card h-27rem">
                            <div className="flex mb-2 justify-content-center">
                                    <input type="file" name="image" onChange={(e) => fieldChangeHandle(e,'files')} accept="image/*" />
                            </div>
                            <Toast ref={toast}></Toast>
                            <Carousel value={fields.image} numVisible={3} numScroll={3} responsiveOptions={responsiveOptions} itemTemplate={previewTemplate} />
                        </div>
                    
                    </Dialog>
                </div> 
                
            </div> 
        </>
    )
}

export default Baptismal