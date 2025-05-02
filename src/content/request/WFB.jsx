import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Column } from "primereact/column";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { DataTable } from "primereact/datatable";
import { deleteData, storeData, updateData } from "../../utils/Data";
import { Dialog } from "primereact/dialog";
import { Divider } from "primereact/divider";
import { Dropdown } from "primereact/dropdown";
import { getChapel, getClient, getParish, getPriest } from "../../utils/Function";
import { getWFBData } from "../../utils/List";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { moveDate } from "../../utils/CalendarData";
import { Panel } from "primereact/panel";
import { Stepper } from "primereact/stepper";
import { StepperPanel } from "primereact/stepperpanel";
import { Tag } from "primereact/tag";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import dayGridPlugin from "@fullcalendar/daygrid";
import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import moment from 'moment-timezone';
import timeGridPlugin from "@fullcalendar/timegrid";
import { Carousel } from "primereact/carousel";
import { Badge } from "primereact/badge";
import { Checkbox } from "primereact/checkbox";
import { Image } from "primereact/image";

function WFB() {
    const [ chapelLoading, setChapelLoading ] = useState(false)
    const [ chapelOption, setChapelOption ] = useState([]);
    const [ clientOption, setClientOption ] = useState([]);
    const [ currentEvents, setCurrentEvents ] = useState([]);
    const [ data, setData ] = useState([]);
    const [ disabled, setDisabled ] = useState(false);
    const [ edit, setEdit ] = useState(false);
    const [ fields, setFields] = useState({});
    const [ invalid, setInvalid ] = useState([]);
    const [ loading, setLoading ] = useState(false);
    const [ modal, setModal ] = useState({});
    const [ parishFilterLoading, setParishFilterLoading ] = useState(false)
    const [ parishFilterOption, setParishFilterOption ] = useState([]);
    const [ parishLoading, setParishLoading ] = useState(false)
    const [ parishOption, setParishOption ] = useState([]);
    const [ previewFileDialog, setPreviewFileDialog ] = useState(false);
    const [ priestLoading, setPriestLoading ] = useState(false)
    const [ priestOption, setPriestOption ] = useState([]);
    const [ target, setTarget ] = useState(null);
    const [ visible, setVisible ] = useState(false);
    const calendarRef = useRef(null);
    const stepperRef = useRef(null);
    const table_name = "wfb_table";
    const toast = useRef(null);

    const [ filter, setFilter ] = useState({
        client: null,
        parish: null,
        mode: null,
        New: false,
        Ongoing: false,
        Completed: false,
        Cancelled: false,
        Closed: false,
    })

    const createId = () => {
        let id = '';
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    };

    let emp = {
        id: createId(),
        start: fields.start,
        time_start: fields.customStart,
        end: fields.end, 
        time_end: fields.customEnd,
    };
    
    const btnLoad = (e) => {
        e.preventDefault();
        loadData();
    }

    const loadData = async () => {
        setLoading(true);
        try {
            const fetchData = await getWFBData(filter);
            setTimeout(()=>{
                setLoading(false);
                setData(fetchData);
                setFilter((filters) => ({
                    ...filters,
                    New: false,
                    Ongoing: false,
                    Completed: false,
                    Cancelled: false,
                    Closed: false,
                }));
            },0)
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

    const chapel = async (target) => {
        try {
            const fetchData = await getChapel(target);
            setChapelLoading(true)
            setTimeout(()=>{
                setChapelOption(fetchData);
                setChapelLoading(false);
            },500)
        } catch (err) {
            console.error('Failed to load data:', err);
        }
    };

    const priest = async (target) => {
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

    const onLegendChange = (e) => {
        
            const calendarApi = calendarRef.current.getApi();
            const allEvents = calendarApi.getEvents(); // Get all events
            // Filter events with status "New"
            const newEvents = allEvents.filter((event) => event.extendedProps.request_status === e.target.name);
            if(e.checked){
                console.log(e.target.name);
                console.log(e.checked);
                newEvents.forEach((event) => event.setProp("display", "none"));
            }else{
                console.log(e.target.name);
                console.log(e.checked);
                newEvents.forEach((event) => event.setProp("display", ""));
            }
            

            // Example: Hide all "New" events
            
            
            setFilter((filters) => ({
                ...filters,
                [e.target.name]: e.checked,
            }));
    };

    
    const handleFilterChange = (e) => {
        e.target.name  === "client" ? parish(e.target.value.id,'filter') : '';
        setFilter((filter) => ({
            ...filter,
            [e.target.name]: e.target.value,
        }));
        
    };

    const handleDateClick = (selected) => {

        const start = moment(new Date(selected.start)).format('l');
        const end = moment(new Date(selected.end)).subtract(1, 'days').format('l');
        
        swal({
            title: "Do you want to add record?",
            text: `Start: ${start} - End ${end}` ,
            icon: "info",
            buttons: true,
        })
        .then((confirm) => {
            if (confirm) {
                setFields((field) => ({
                    ['customStart']: start,
                    ['customEnd']: end,
                    ['start']: selected.startStr,
                    ['end']: selected.endStr,
                    ['chapel_schedule']: [{
                        id: createId(),
                        start: start,
                        time_start: selected.start,
                        end: end, 
                        time_end: selected.end,
                    }],
                }))
                setDisabled(false)
                setVisible(true)
            } 
        });

    };

    const handleEventClick = (selected) => {
        console.log('Click',selected.event.id);
        setTarget(selected.event.id);
        setFields(selected.event._def.extendedProps)
        setEdit(true);
    };

    const handleEventChange = (selected) => {
        const newDate = selected.event._instance.range;
        const date = (value) => {
            return moment(value).format('l');
        }

        swal({
            title: "Do you want to change the date of this record?",
            text: `Start: ${date(newDate.start)} - End ${date(newDate.end)}`,
            icon: "info",
            buttons: true,
        })
        .then((confirm) => {
            if (confirm) {
                const saveNewDate = {
                    id: selected.event.extendedProps.target,
                    customStart: moment(newDate.start).format('l'),
                    customEnd: moment(newDate.end).subtract(1, 'days').format('l'),
                    start: moment(newDate.start).format('YYYY-MM-DD'),
                    end: moment(newDate.end).format('YYYY-MM-DD'),
                }

                moveDate(saveNewDate,loadData);
                
            }else{
                loadData();
            } 
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const validator = {
            'decease_fullname': fields.decease_fullname ? false : 'This field is required',
            'gender': fields.gender ? false : 'This field is required',
            'date_of_birth': fields.date_of_birth ? false : 'This field is required',
            'date_of_death': fields.date_of_death ? false : 'This field is required',
            'age': fields.age ? false : 'This field is required',
            'civil_status': fields.civil_status ? false : 'This field is required',
            'religion': fields.religion ? false : 'This field is required',
            'cause_of_death': fields.cause_of_death ? false : 'This field is required',
            'place_of_death': fields.place_of_death ? false : 'This field is required',
            'family_fullname': fields.family_fullname ? false : 'This field is required',
            'relation': fields.relation ? false : 'This field is required',
            'contact': fields.contact ? false : 'This field is required',
            'email': fields.email ? false : 'This field is required',
            'client_id': fields.client_id ? false : 'This field is required',
            'parish_id': fields.parish_id ? false : 'This field is required',
            'chapel_id': fields.chapel_id ? false : 'This field is required',
            'priest_id': fields.priest_id ? false : 'This field is required',
            'image': fields.image ? fields.image.length != 0 ? false : "You need to upload atleast 1 file" : 'You need to upload atleast 1 file.',
        }
        
        const hasErrors = Object.values(validator).some(error => error !== false);

        if(!hasErrors){
            console.log(modal);
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
                        setFields((fields) => ({
                            ...fields,
                            [e.target.name]: e.target.value,
                            ['parish_id']: "",
                            ['chapel_id']: "",
                            ['priest_id']: "",
                        }));
                        setChapelOption([]);
    
                        break;
                    case 'parish_id':

                        chapel({ client_id: fields.client_id.id, parish_id: e.target.value.id});
                        setFields((fields) => ({
                            ...fields,
                            [e.target.name]: e.target.value,
                            ['chapel_id']: "",
                            ['priest_id']: "",
                        }));
                        
                        break;
                    case 'chapel_id':
                        
                        // priest(e.target.value.id);
                        priest({ client_id: fields.client_id.id, parish_id: fields.parish_id.id});

                        setFields((fields) => ({
                            ...fields,
                            [e.target.name]: e.target.value,
                            ['chapel_rate']: e.target.value.chapel_rate,
                            ['priest_id']: "",
                        }));
                        
                        break;
                    case 'priest_id':
                        
                        setFields((fields) => ({
                            ...fields,
                            [e.target.name]: e.target.value,
                            ['priest_rate']: e.target.value.priest_rate,
                        }));
                        
                        break;
                    case 'date_of_death':

                        setFields((fields) => ({
                            ...fields,
                            [e.target.name]: e.target.value,
                            ['age']: parseInt(moment(e.target.value).diff(moment(fields.date_of_birth), 'years', true)),
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

    const handeDelete = () => {
        confirmDialog({
            message: 'You want to delete this data!',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-circle ',
            defaultFocus: 'accept',
            accept: (e) => { 
                deleteData(table_name,fields.target,setDisabled,loadData);
                setEdit(false)
            },
        });
    };

    const handeUpdates = (e) => {
        confirmDialog({
            message: 'You want to update status to '+fields.request_status+'!',
            header: 'Update Confirmation',
            icon: 'pi pi-exclamation-circle ',
            draggable: false,
            defaultFocus: 'accept',
            accept: (e) => { 
                updateData(target,table_name,fields,setVisible,setDisabled,loadData);
                setEdit(false)
            },
        });
    };

    const openEditModal = (e,label) => {
        if(label === "Edit"){
            setDisabled(false);
        }else{
            setDisabled(true);
        }
        setEdit(false);
        setVisible(true);
        parish(fields.client_id.id);
        chapel(fields.parish_id.id);
        priest(fields.chapel_id.id);
    }

    const onRowEditComplete = (e) => {
        let _chapel_schedule = [...fields.chapel_schedule];
        let { newData, index } = e;
        _chapel_schedule[index] = newData;
        setFields((fields) => ({
            ...fields,
            ['chapel_schedule']: _chapel_schedule,
        }));
    };

    const allowEdit = (rowData) => {
        return rowData.name !== 'Blue Band';
    };

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

    const showFiles = () => {
        console.log('fields',fields);
        confirmDialog({
            header: 'Files',
            draggable: false,
            style: { width: '40vw', height: '27vw' },
            message: (
                <div className="flex flex-column gap-3 ">
                    <Toast ref={toast}></Toast>
                    <Carousel value={fields.image ?? []} numVisible={3} numScroll={1} responsiveOptions={responsiveOptions} itemTemplate={previewTemplate} />
                </div>
            ),
            acceptLabel: "OK",
            accept: "",
            rejectClassName: "hidden"
        });
    };

    const textDisplay = (options, target) => {
        return <Calendar type="text"  id="calendar-12h" hourFormat="12" value={new Date(options.value)} onChange={(e) => options.editorCallback(e.target.value)} disabled={target} timeOnly={!target}/>;
    };

    const templateStart = (rowData) => {  return ( <Calendar type="text" id="calendar-12h" value={new Date(rowData.start)} disabled/> ); };
    const templateEnd = (rowData) => {  return ( <Calendar type="text" id="calendar-12h" value={new Date(rowData.end)} disabled/> ); };
    const templateStartTime = (rowData) => {  return (  <Calendar type="text" id="calendar-12h" value={new Date(rowData.time_start)} disabled hourFormat="12" timeOnly/>  ); };
    const templateEndTime = (rowData) => {  return (  <Calendar type="text" id="calendar-12h" value={new Date(rowData.time_end)} disabled hourFormat="12" timeOnly/>  ); };
    
    useEffect(()=> {
        loadData(table_name);
        client();
    }, [])

    const headerContent = (
        <div className="flex flex-row-column align-items-center justify-content-center gap-6">
            {fields.target ? (
                <div className="flex align-items-center gap-2">
                    <Avatar icon="pi pi-id-card" style={{ backgroundColor: '#2196F3', color: '#ffffff' }} /> 
                    <div className="flex flex-column">
                        <span className="font-bold white-space-nowrap text-base">{fields.control_id}</span>
                        <small className="text-xs">Control ID</small>
                    </div>
                </div>
            ) : ''}
            <div className="flex align-items-center gap-2"> 
                <Avatar icon="pi pi-calendar" style={{ backgroundColor: '#2196F3', color: '#ffffff' }} /> 
                <div className="flex flex-column">
                    <span className="font-bold white-space-nowrap text-base">{fields.customStart}</span>
                    <small className="text-xs">Start Date</small>
                </div>
            </div>

            <div className="flex align-items-center gap-2">
                <Avatar icon="pi pi-calendar" style={{ backgroundColor: '#2196F3', color: '#ffffff' }} /> 
                <div className="flex flex-column">
                    <span className="font-bold white-space-nowrap text-base">{fields.customEnd}</span>
                    <small className="text-xs">End Date</small>
                </div>
            </div>
        </div>
    );

    const previewFile = (e) => {
        e.preventDefault(e)
        setPreviewFileDialog(true);
    }

    const headerContentInfo = (
        <div className="flex align-items-center justify-content-between gap-6">
            <div className="flex align-items-center gap-2">
                <div className="flex flex-column">
                    <span className="font-bold white-space-nowrap text-md">{fields.control_id}</span>
                </div>
            </div>

            <div className="flex align-items-center gap-3">
                <Avatar icon="pi pi-file" style={{ backgroundColor: '#a855f7', color: '#ffffff' }} onClick={() => showFiles() } className={`p-overlay-badge ${fields.documents === 0 ? 'hidden' : '`'}`} > <Badge severity="info" value={fields.documents}/></Avatar> 
                <Avatar icon="pi pi-file-pdf" tooltip="Print" tooltipoptions ={{ position: 'top' }} style={{ backgroundColor: '#E52020', color: '#ffffff' }} /> 
            </div>
        </div>
    );

    const editFooterContent = (
        <div className="flex justify-content-between">
            <div className="flex justify-content-end gap-1">
                <Button raised icon="pi pi-pencil" label="Edit" severity="edit" size="small" onClick={ (e) => openEditModal(e,'Edit') } />
                <Button raised icon="pi pi-eye" label="View" severity="secondary" size="small" onClick={ (e) => openEditModal(e,'View') }/>
                <Button raised icon="pi pi-trash" label="Delete" severity="danger" size="small" onClick={handeDelete} />
            </div>
            <div className="flex justify-content-end gap-1">
                <Button raised icon="pi pi-times" label="Close" severity="secondary" text size="small" onClick={(e) => { setEdit(false) }} />
            </div>
        </div>
    );

    const footerContent = (
        <div className=''>
            <Button label="Close" onClick={(e) => { previewFileDialog(false) }} className="p-button-secondary"/>
        </div>
    );

    const hidedeleteDialog = () => {
        setDeleteDialog(false);
    };

    return (
        <div>
            <div className="card" >  

            <div className="flex justify-content-start  row gap-1 mb-4">
                <div className="flex flex-column gap-2">
                    <div className="flex flex-row-column gap-2">
                        <Dropdown  name="client" value={filter.client} onChange={ handleFilterChange } options={clientOption} optionLabel="name" placeholder="Select a Client" className="w-20rem" />
                        <Dropdown  name="parish" value={filter.parish} onChange={ handleFilterChange } options={parishFilterOption} optionLabel="name" placeholder={parishFilterLoading ? "Loading..." : "Select a Parish" } className="w-20rem" loading={parishFilterLoading} />
                        <Button raised label='Show' className='border-round-md' severity="info" icon="pi pi-search" onClick={ (e) => { btnLoad(e) } } />
                    </div>

                    <div className="flex flex-row-column py-2 gap-2">

                        <div className="card flex flex-wrap justify-content-center gap-3">
                            <div className="flex align-items-center">
                                <Badge value="0" style={ { backgroundColor: 'var(--color-new)', color: 'var(--color-new)'} }></Badge>
                                <Checkbox checked={filter.New} inputId="new" name="New" onChange={ onLegendChange } />
                                <label htmlFor="new" className="ml-2" style={{ textDecoration: filter.New ? 'line-through' : 'none' }}>New</label>
                            </div>
                            <div className="flex align-items-center">
                                <Badge value="0" style={ { backgroundColor: 'var(--color-ongoing)', color: 'var(--color-ongoing)'} }></Badge>
                                <Checkbox checked={filter.Ongoing} inputId="ongoing" name="Ongoing" onChange={ onLegendChange } />
                                <label htmlFor="ongoing" className="ml-2" style={{ textDecoration: filter.Ongoing ? 'line-through' : 'none' }}>Ongoing</label>
                            </div>
                            <div className="flex align-items-center">
                                <Badge value="0" style={ { backgroundColor: 'var(--color-completed)', color: 'var(--color-completed)'} }></Badge>
                                <Checkbox checked={filter.Completed} inputId="completed" name="Completed" onChange={ onLegendChange } />
                                <label htmlFor="completed" className="ml-2" style={{ textDecoration: filter.Completed ? 'line-through' : 'none' }}>Completed</label>
                            </div>
                            <div className="flex align-items-center">
                                <Badge value="0" style={ { backgroundColor: 'var(--color-cancelled)', color: 'var(--color-cancelled)'} }></Badge>
                                <Checkbox checked={filter.Cancelled} inputId="cancelled" name="Cancelled" onChange={ onLegendChange } />
                                <label htmlFor="cancelled" className="ml-2" style={{ textDecoration: filter.Cancelled ? 'line-through' : 'none' }}>Cancelled</label>
                            </div>
                            <div className="flex align-items-center">
                                <Badge value="0" style={ { backgroundColor: 'var(--color-closed)', color: 'var(--color-closed)'} }></Badge>
                                <Checkbox checked={filter.Closed} inputId="closed" name="Closed" onChange={ onLegendChange } />
                                <label htmlFor="closed" className="ml-2" style={{ textDecoration: filter.Closed ? 'line-through' : 'none' }}>Closed</label>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>

            <FullCalendar
                height="100vh"
                plugins={[
                    dayGridPlugin,
                    timeGridPlugin,
                    interactionPlugin,
                    listPlugin,
                ]}
                headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
                }}
                ref={calendarRef}
                initialView="dayGridMonth"
                editable={true}
                selectable={true}
                selectMirror={true}
                dayMaxEvents={true}
                events={data}
                select={handleDateClick}
                eventClick={handleEventClick}
                eventsSet={(events) => setCurrentEvents(events)}
                eventMouseEnter={(info) => {
                    const calEvent = info.event.extendedProps;
                    const tooltipString = `
                        <div class="flex flex-column shadow-3 rounded p-3 py-3 bg-white border-round-lg md:font-medium gap-2 w-auto" style="overflow-wrap: break-word;  position: absolute; z-index: 10001; color: black !important">
                            
                                <span class="font-weight-bold text-uppercase text-xl mb-1">${calEvent.control_id}</span>

                                 <div class="flex flex-row gap-4">
                                    <div class="flex flex-column md:font-medium">
                                        <span class="text-md">${calEvent.customStart}</span>
                                        <Tag class="text-xs">Start Date</Tag>
                                    </div> 
                                    <div class="flex flex-column md:font-medium">
                                        <span class="text-md">${calEvent.customEnd}</span>
                                        <small class="text-xs">End Date</small>
                                    </div>
                                    <div class="flex flex-column md:font-medium">
                                        <span class="text-md">${calEvent.status}</span>
                                        <small class="text-xs">Status</small>
                                    </div>  
                                </div> 

                                 <div class="flex flex-row gap-4">
                                    <div class="flex flex-column md:font-medium">
                                        <span class="text-md">${calEvent.created_by}</span>
                                        <Tag class="text-xs">Created By</Tag>
                                    </div> 
                                    <div class="flex flex-column md:font-medium">
                                        <span class="text-md">${calEvent.created_at }</span>
                                        <small class="text-xs">Created At</small>
                                    </div>
                                   
                                </div> 
                            </div>
                        </div>
                    `;
                
                    // Convert the string to a DOM element
                    const tooltip = document.createElement('div');
                    tooltip.innerHTML = tooltipString;
                    const tooltipElement = tooltip.firstElementChild; // Get the actual tooltip element
                
                    // Append the tooltip to the body
                    document.body.appendChild(tooltipElement);
                
                    // Function to position the tooltip
                    const positionTooltip = (e) => {
                        tooltipElement.style.top = `${e.pageY + 10}px`;
                        tooltipElement.style.left = `${e.pageX + 10}px`;
                    };
                
                    // Add mousemove event listener to position the tooltip
                    info.el.addEventListener('mousemove', positionTooltip);
                
                    // Function to clean up the tooltip
                    const cleanupTooltip = () => {
                        if (tooltipElement && tooltipElement.parentNode === document.body) {
                            document.body.removeChild(tooltipElement); // Remove the tooltip if it exists in the DOM
                        }
                        info.el.removeEventListener('mousemove', positionTooltip); // Remove the mousemove listener
                        info.el.removeEventListener('mouseleave', cleanupTooltip); // Remove the mouseleave listener
                    };
                
                    // Add mouseleave event listener to clean up the tooltip
                    info.el.addEventListener('mouseleave', cleanupTooltip);
                }}
                eventDrop={handleEventChange}
                
            />

            </div>

            <Dialog header={headerContent} draggable={false} visible={visible} style={{ width: '60vw' }} onHide={() => {if (!visible) return; setVisible(false); }} >

                <Stepper ref={stepperRef} style={{ flexBasis: '50rem' }}>

                        <StepperPanel header="Information" >
                                                   
                            <div className="flex flex-column h-auto">
                                <Divider className='mb-1 -mt-2 font-bold'>Decease Information</Divider>

                                <div className="flex col-12 flex-row-column gap-1">

                                    <div className="flex col-5 flex-column gap-1">
                                        <label className='font-bold' htmlFor="decease_fullname">Fullname</label>
                                        <InputText name="decease_fullname"  value={fields.decease_fullname} onChange={e => fieldChangeHandle(e)} className='w-full' aria-describedby="decease_fullname-help" invalid={ invalid.decease_fullname } disabled={ disabled } />
                                        <small className='text-danger'>
                                            { invalid.decease_fullname ? 'This field is required' : ''}
                                        </small>
                                    </div>

                                    <div className="flex col-2 flex-column gap-1">
                                        <label className='font-bold' htmlFor="gender">Gender</label>
                                        <Dropdown  name="gender" value={fields.gender} onChange={e => fieldChangeHandle(e)} disabled={ disabled } invalid={ invalid.gender }  options={
                                            [
                                                { name: 'Male', value: 'Male'}, 
                                                { name: 'Female', value: 'Female'}, 
                                            ]
                                        } optionLabel="name" placeholder="Gender" className="w-full" />
                                        <small className='text-danger'>
                                            { invalid.gender ? 'This field is required' : ''}
                                        </small>
                                    </div>

                                    <div className="flex col-2 flex-column gap-1">
                                        <label className='font-bold' htmlFor="date_of_birth">Date of Birth</label>
                                        <Calendar className='w-full' showIcon id="calendar-12h" name="date_of_birth" showButtonBar maxDate={new Date()} value={ modal.edit ? new Date(fields.date_of_birth) : fields.date_of_birth } onChange={(e) => fieldChangeHandle(e)}  invalid={ invalid.date_of_birth }  disabled={ disabled } />
                                        <small className='text-danger'>
                                            { invalid.date_of_birth ? 'This field is required' : ''}
                                        </small>
                                    </div>

                                    <div className="flex col-2 flex-column gap-1">
                                        <label className='font-bold' htmlFor="date_of_death">Date of Death</label>
                                        <Calendar className='w-full' showIcon id="calendar-12h" name="date_of_death" minDate={fields.date_of_birth} maxDate={new Date()} value={ modal.edit ? new Date(fields.date_of_death) : fields.date_of_death } onChange={(e) => fieldChangeHandle(e)}  invalid={ invalid.date_of_death }  disabled={ disabled } />
                                        <small className='text-danger'>
                                            { invalid.date_of_death ? 'This field is required' : ''}
                                        </small>
                                    </div>

                                    <div className="flex col-1 flex-column gap-1">
                                        <label className='font-bold' htmlFor="age">Age</label>
                                        <InputText name="age" value={fields.age} onChange={e => fieldChangeHandle(e)} className='w-full' aria-describedby="age-help" invalid={ invalid.age }  disabled={true} />
                                        <small className='text-danger'>
                                            { invalid.age ? 'This field is required' : ''}
                                        </small>
                                    </div>

                                </div>


                                <div className="flex col-12 flex-row-column gap-1">

                                    <div className="flex col-2 flex-column gap-1">
                                        <label className='font-bold' htmlFor="civil_status">Civil Status</label>
                                        <Dropdown  name="civil_status" value={fields.civil_status} onChange={e => fieldChangeHandle(e)} invalid={ invalid.civil_status } disabled={ disabled } options={
                                            [
                                                { name: 'Single', value: 'Single'}, 
                                                { name: 'Married', value: 'Married'}, 
                                                { name: 'Widowed', value: 'Widowed'}, 
                                            ]
                                        } optionLabel="name" placeholder="Civil Status" className="w-full" />
                                        <small className='text-danger'>
                                            { invalid.civil_status ? 'This field is required' : ''}
                                        </small>
                                    </div>


                                    <div className="flex col-2 flex-column gap-1">
                                        <label className='font-bold' htmlFor="religion">Religion</label>
                                        <InputText name="religion" value={fields.religion} onChange={e => fieldChangeHandle(e)} className='w-full' aria-describedby="religion-help" invalid={ invalid.religion }  disabled={ disabled } />
                                        <small className='text-danger'>
                                            { invalid.religion ? 'This field is required' : ''}
                                        </small>
                                    </div>

                                    <div className="flex col-3 flex-column gap-1">
                                        <label className='font-bold' htmlFor="cause_of_death">Cause of Death</label>
                                        <InputText name="cause_of_death" value={fields.cause_of_death} onChange={e => fieldChangeHandle(e)} className='w-full' aria-describedby="cause_of_death-help" invalid={ invalid.cause_of_death }  disabled={ disabled } />

                                        <small className='text-danger'>
                                            { invalid.cause_of_death ? 'This field is required' : ''}
                                        </small>
                                    </div>

                                    <div className="flex col-5 flex-column gap-1">
                                        <label className='font-bold' htmlFor="place_of_death">Place of Death</label>
                                        <InputText name="place_of_death" value={fields.place_of_death} onChange={e => fieldChangeHandle(e)} className='w-full' aria-describedby="place_of_death-help" invalid={ invalid.place_of_death }  disabled={ disabled } />

                                        <small className='text-danger'>
                                            { invalid.place_of_death ? 'This field is required' : ''}
                                        </small>
                                    </div>

                                </div>

                                <Divider className='mb-1 font-bold'>Family Information</Divider>

                                <div className="flex col-12 flex-row-column gap-1">

                                    <div className="flex col-5 flex-column gap-1">
                                        <label className='font-bold' htmlFor="family_fullname">Fullname</label>
                                        <InputText name="family_fullname" value={fields.family_fullname} onChange={e => fieldChangeHandle(e)} className='w-full' aria-describedby="family_fullname-help" invalid={ invalid.family_fullname }  disabled={ disabled } />
                                        <small className='text-danger'>
                                            { invalid.family_fullname ? 'This field is required' : ''}
                                        </small>
                                    </div>

                                    <div className="flex col-2 flex-column gap-1">
                                        <label className='font-bold' htmlFor="relation">Relation</label>
                                        <InputText name="relation" value={fields.relation} onChange={e => fieldChangeHandle(e)} className='w-full' aria-describedby="relation-help" invalid={ invalid.relation }  disabled={ disabled } />
                                        <small className='text-danger'>
                                            { invalid.relation ? 'This field is required' : ''}
                                        </small>
                                    </div>

                                    <div className="flex col-2 flex-column gap-1">
                                        <label className='font-bold' htmlFor="contact">Phone Number</label>
                                        <InputNumber name="contact" className='w-full' useGrouping={false} value={fields.contact} invalid={ invalid.contact } onChange={e => fieldChangeHandle(e,'contact')}  disabled={ disabled  } required/>
                                        <small className='text-danger'>
                                            { invalid.contact ? 'This field is required' : ''}
                                        </small>
                                    </div>

                                    <div className="flex col-3 flex-column gap-1">
                                        <label className='font-bold' htmlFor="email">Email</label>
                                        <InputText name="email" className='w-full'  value={fields.email} invalid={ invalid.email } onChange={e => fieldChangeHandle(e)}  disabled={ disabled  } required/>
                                        <small className='text-danger'>
                                             { invalid.email ? 'This field is required' : ''}
                                        </small>
                                    </div>

                                </div>
                                
                            </div> 

                            <div className="flex justify-content-between -mb-4">
                                <Button raised label="Close" severity="secondary" text icon="pi pi-times" onClick={() => setVisible(false)} />
                                <Button raised label="Next" icon="pi pi-arrow-right" iconPos="right" onClick={() => stepperRef.current.nextCallback()} />
                            </div>
                        </StepperPanel>
                       
                        <StepperPanel header="Chapel" >
                        <div className="flex flex-column h-25rem">
                        <Divider className='mb-1 -mt-2 font-bold'>Setup</Divider>

                            <div className="flex col-12 flex-row-column gap-1">

                                <div className="flex col-3 flex-column gap-1">
                                    <label className='font-bold' htmlFor="client_id">Client</label>
                                    <Dropdown name="client_id" value={fields.client_id} onChange={(e) => fieldChangeHandle(e)} options={clientOption} optionLabel="name" placeholder="Select a Client" className="w-full"  invalid={ invalid.client_id }  disabled={ disabled }/>
                                    <small className='text-danger'>
                                        { invalid.client_id ? 'This field is required' : ''}
                                    </small>
                                </div>

                                <div className="flex col-3 flex-column gap-1">
                                    <label className='font-bold' htmlFor="parish_id">Parish</label>
                                    <Dropdown name="parish_id" value={fields.parish_id} onChange={(e) => fieldChangeHandle(e)} options={parishOption} loading={parishLoading} optionLabel="name" placeholder={parishLoading ? "Loading..." : "Select a Parish" } className="w-full" invalid={ invalid.parish_id }  disabled={ disabled  }/>
                                    <small className='text-danger'>
                                        { invalid.parish_id ? 'This field is required' : ''}
                                    </small>
                                </div>

                                <div className="flex col-3 flex-column gap-1">
                                    <label className='font-bold' htmlFor="chapel_id">Chapel</label>
                                    <Dropdown name="chapel_id" value={fields.chapel_id} onChange={(e) => fieldChangeHandle(e)} options={chapelOption} loading={chapelLoading} optionLabel="name" placeholder={chapelLoading ? "Loading..." : "Select a Chapel" } className="w-full" invalid={ invalid.chapel_id }  disabled={ disabled  }/>
                                    <small className='text-danger'>
                                        { invalid.client_id ? 'This field is required' : ''}
                                    </small>
                                    <small className='text-red ml-2 font-bold'>
                                        Chapel Rate: { fields.chapel_rate ? fields.chapel_rate.toLocaleString('en-US', { style: 'currency', currency: 'PHP' }) : 0}
                                    </small>
                                </div>

                                <div className="flex col-3 flex-column gap-1">
                                    <label className='font-bold' htmlFor="priest_id">Priest</label>
                                    <Dropdown name="priest_id" value={fields.priest_id} onChange={(e) => fieldChangeHandle(e)} options={priestOption} loading={priestLoading} optionLabel="name" placeholder={priestLoading ? "Loading..." : "Select a Priest" } className="w-full" invalid={ invalid.priest_id }  disabled={ disabled  }/>
                                    <small className='text-danger'>
                                        { invalid.client_id ? 'This field is required' : ''}
                                    </small>
                                    <small className='text-red ml-2 font-bold'>
                                        Priest Rate: { fields.priest_rate ? fields.priest_rate.toLocaleString('en-US', { style: 'currency', currency: 'PHP' }) : 0}
                                    </small>
                                </div>

                            </div>

                            <Divider className='font-bold'>Schedule</Divider>

                            <div className="flex flex-column justify-content-between">
                                {/* <div className="flex justify-content-end px-1 -mt-3 py-3">
                                    <Button label="Add Chapel" icon="pi pi-plus" severity="info" onClick={ addChapel }/>
                                </div> */}
                                <DataTable value={fields.chapel_schedule} editMode="row" dataKey="id" onRowEditComplete={onRowEditComplete} scrollable scrollHeight="250px" tableStyle={{ minWidth: '50rem' }}>
                                    <Column field="start" header="Date In" body={templateStart}  editor={(options) => textDisplay(options, true)} style={{ width: '20%' }}></Column>
                                    <Column field="time_start" header="Time Start" body={templateStartTime} editor={(options) => textDisplay(options, false)} style={{ width: '20%' }}></Column>
                                    <Column field="end" header="Date Out"  body={templateEnd} editor={(options) => textDisplay(options, true)} style={{ width: '20%' }}></Column>
                                    <Column field="time_end" header="Time End" body={templateEndTime} editor={(options) => textDisplay(options, false)} style={{ width: '20%' }}></Column>
                                    <Column rowEditor={allowEdit} headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
                                </DataTable>
                            </div>
                            </div>
                            <div className="flex justify-content-between -mb-4">
                                <Button label="Back" severity="secondary" icon="pi pi-arrow-left" onClick={() => stepperRef.current.prevCallback()} />
                                <Button label="Next" icon="pi pi-arrow-right" iconPos="right" onClick={() => stepperRef.current.nextCallback()} />
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
                            <Button label="Back" severity="secondary" icon="pi pi-arrow-left" onClick={() => stepperRef.current.prevCallback()} />
                            <Button label={ disabled ? 'Close' : 'Submit' } icon={ disabled ? "pi pi-times" : "pi pi-check"} severity={ disabled ? "secondary" : "info"} raised iconPos="right" onClick={ (e) => { disabled ? setVisible(false) : handleSubmit(e) }  } /> 
                        </div>
                        </StepperPanel>
                </Stepper>
            </Dialog>
            
            <Toast ref={toast} />
            <ConfirmDialog />

            <Dialog draggable={false} header={headerContentInfo} modal visible={edit} onHide={() => {if (!visible) return; setVisible(false); }} footer={editFooterContent} >  {/* footer={footerContent} */}
                <div className="flex flex-row gap-3 ">
                    <div className="flex flex-row-column gap-3 py-2">
                        <div className="flex flex-column font-bold gap-2">
                            <span>Client :</span>
                            <span>Parish :</span>
                            <span>Chapel :</span>
                        </div>
                        <div className="flex flex-column gap-2">
                            <span>{fields.client}</span>
                            <span>{fields.parish}</span>
                            <span>{fields.chapel}</span>
                        </div>
                    </div>
                    <div className="flex flex-row-column ml-8">
                        <div className="flex flex-column col-12 gap-1">
                            <Dropdown name="request_status" value={fields.request_status} onChange={(e) => fieldChangeHandle(e)} options={['New','Ongoing','Completed','Cancelled','Closed']} placeholder="Updates" className="w-9rem p-inputtext-sm"/>
                            <Button raised icon="pi pi-check" label="Updates" severity="primary" disabled={ fields.status === fields.request_status ? true : false } size="small" onClick={ handeUpdates } />
                        </div>
                    </div>
                </div>

                
                <Divider/>
                <div className="flex flex-row-column gap-4 py-2">
                    <div className="flex flex-row gap-2">
                        <div className="flex flex-column font-bold gap-2">
                            <span>Date In :</span>
                            <span>Date Out :</span>
                        </div>
                        <div className="flex flex-column gap-2">
                            <span>{fields.date_started}</span>
                            <span>{fields.date_ended}</span>
                        </div>
                    </div>
                    <div className="flex flex-row gap-2">
                        <div className="flex flex-column font-bold gap-2">
                            <span>Status :</span>
                            <span>Created By :</span>
                        </div>
                        <div className="flex flex-column gap-2">
                            <span>{fields.status}</span>
                            <span>{fields.created_by}</span>
                        </div>
                    </div>
                </div>
            </Dialog>

        </div>
    )
}

export default WFB
