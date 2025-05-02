import React, { useState, useEffect, useRef, setState } from 'react';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import { formatCurrency, getClient, getParish, getStatusSeverity } from "../../utils/Function"
import { getManageBaptismalData } from '../../utils/List';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { saveData } from '../../utils/Data';
import swal from 'sweetalert';
import { Toast } from 'primereact/toast';
import { Panel } from 'primereact/panel';
import { Navigate, useNavigate } from 'react-router-dom';

function ManageBaptism() {

    const [ clientOption, setClientOption ] = useState([]);
    const [ data, setData ] = useState([]);
    const [disabled, setDisabled ] = useState({
        approved: true,
        denied: true,
        payment: true,
        donation: true,
    });
    const [ expandedRows, setExpandedRows ] = useState(null);
    const [ fields, setFields ] = useState({});
    const [ loading, setLoading  ] = useState(false) 
    const [ selected, setSelected ] = useState({});
    const [ selectedData, setSelectedData ] = useState({});
    const [ paymentVisible, setPaymentVisible ] = useState(false);
    const [ parishFilterLoading, setParishFilterLoading ] = useState(false)
    const [ parishFilterOption, setParishFilterOption ] = useState([]);

    const table_name = "manage_baptism_table";
    const toast = useRef(null);
    const navigate = useNavigate();

    const modeOption = [
        { name: "Control ID" , value: "uniq_key"},
        { name: "Created At" , value: "created_at"},
        { name: "Created By" , value: "created_by"},
        { name: "Start Date" , value: "start"},
        { name: "End Date" , value: "end"},
        { name: "Payment Status" , value: "payment_status"},
        { name: "Priest" , value: "priest"},
        { name: "Reference Key" , value: "ref_key"},
        { name: "Remarks" , value: "remarks"},
        { name: "Request Status" , value: "status"},
        { name: "Status" , value: "status"},
        { name: "Total Amount" , value: "total_amount"},
    ]

    const countries = [
        { name: 'Australia' },
        { name: 'Brazil' },
        { name: 'China' },
        { name: 'Egypt' },
        { name: 'France' },
        { name: 'Germany' },
        { name: 'India' },
        { name: 'Japan' },
        { name: 'Philippines' },
        { name: 'Spain' },
        { name: 'United States' }
    ];

    const [filter, setFilter] = useState({
        client: null,
        mode: null,
        keyword: null,
        fields: modeOption,
    })



 

    const btnLoad = (e) => {
        e.preventDefault();
        loadData();
    }

    const loadData = async () => {
        setLoading(true);
        try {
            const fetchData = await getManageBaptismalData(filter);
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
        const status = e.data.status;
        const payment_status = e.data.payment_status;

        setSelected(e.data);
        setDisabled({
            approved: (status === "New" && payment_status === "New") ? false: true,
            denied: (status === "New" && payment_status === "New") ? false: true,
            payment: (status === "Pending" && payment_status === "Approved") ? false: true,
            donation: status === "Completed" ? false: true,
        })
    };

    const onRowUnselect = (event) => {
        setSelected({});
        setDisabled({
            approved: true,
            denied: true,
            payment: true,
            donation: true,
        })
    };

    // Modal 
    const modalAction = (e) => {
        e.preventDefault();
        let status = e.currentTarget.value;
        switch (selectedData.payment_status) {
            case "New":
                swal({
                    title: "Are you sure?",
                    text: `You are about to ${e.currentTarget.id} this data.`,
                    icon: e.currentTarget.id === "Approve" ? "info" : "warning",
                    buttons: true,
                    closeOnClickOutside: false,
                    dangerMode: e.currentTarget.id === "Approve" ? false : true,
                })
                .then((confirm) => {
                    if (confirm) {
                        saveData(selectedData,table_name,status,loadData,setDisabled,setPaymentVisible)
                    } 
                });
                
            break;

            case "Approved":
                setPaymentVisible(true)
                
                break;
        
            default:
                saveData(selectedData,table_name,"New",loadData,setDisabled)
                break;
        }
        
       
    }

    const handleFilterChange = (e) => {
        e.target.name  === "client" ? parish(e.target.value.id,'filter') : '';
        setFilter((filter) => ({
          ...filter,
          [e.target.name]: e.target.value,
        }));
      };
    
    const allowExpansion = (rowData) => {
       return rowData.others.length > 0;
    };

    const rowExpansionTemplate = (data) => {
        return (
            <div>
                <DataTable value={data.others}>
                    <Column />
                    <Column field="priest" header="Priest" ></Column>
                    <Column field="start" header="Start (Date/Time)" ></Column>
                    <Column field="end" header="End (Date/Time)"  ></Column>
                    <Column field="baptism_remarks" header="Remarks" ></Column>
                    <Column field="created_by" header="Created By" ></Column>
                    <Column field="created_at" header="Created At" ></Column>
                </DataTable>
            </div>
        );
    };

    const format = (value) => {
        return value.toLocaleString('en-US');
    };

    const amountBodyTemplate = (rowData) => {
        return (
            <div className="flex flex-column text-sm row-gap-2">
                <div className="flex flex-wrap column-gap-3 justify-content-between">
                    <div>Parish</div>
                    <div className='font-bold'>{formatCurrency(rowData.parish_id.parish_rate)}</div>
                </div>
                <div className="flex flex-wrap column-gap-3  justify-content-between">
                    <div>Priest</div>
                    <div className='font-bold'>{formatCurrency(rowData.priest_id.priest_rate)}</div>
                </div>
                <div className="flex flex-wrap column-gap-3 justify-content-between">
                    <div className='font-bold text-primary'>Total Amount</div>
                    <div className='font-bold text-blue-600'>{formatCurrency(rowData.parish_id.parish_rate+rowData.priest_id.priest_rate)}</div>
                </div>
            </div>
        );
    };

    const PaymentstatusBodyTemplate = (rowData) => {
        return <Tag value={rowData.payment_status.toUpperCase()} severity={getStatusSeverity(rowData.payment_status)}></Tag>;
    };

    const statusBodyTemplate = (rowData) => {
        return <Tag value={rowData.status.toUpperCase()} severity={getStatusSeverity(rowData.status)}></Tag>;
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
                        <Dropdown   name="parish" value={filter.parish} onChange={ handleFilterChange } options={parishFilterOption} optionLabel="name" placeholder={parishFilterLoading ? "Loading..." : "Select a Parish" } className="w-full md:w-14rem" loading={parishFilterLoading} />
                        <Dropdown  name="mode" value={filter.mode} onChange={ handleFilterChange } options={modeOption} optionLabel="name" placeholder="Select a Filter" className="w-full md:w-14rem" />
                        <InputText onChange={ handleFilterChange } name="keyword" className="w-full md:w-15rem" placeholder="Enter a keyword.." />
                        <Button raised label='Show' className='border-round-md' severity="info" icon="pi pi-search" onClick={ (e) => { btnLoad(e) } } />
                    </div>
                </div>
           
                <div className="flex justify-content-end row gap-1 mb-4">
                    <Button raised value='Approved' label='Approve' onClick={(e) => modalAction(e)} id='Approve' severity="primary" className='border-round-md' icon='pi pi-check' disabled={ disabled.approved }/>
                    <Button raised value='Denied' label='Deny' onClick={(e) => modalAction(e)} id='Deny' className='border-round-md' severity="contrast" icon='pi pi-ban' disabled={ disabled.denied } />
                    <Button raised value='For Payment' label='Process' onClick={(e) => modalAction(e)} id='Payment' className='border-round-md' severity="payment" icon='pi pi-credit-card' disabled={ disabled.payment }/>
                    <Button raised text value='For Donation' label='For Donation' onClick={(e) => modalAction(e)}  id='Donation' className='border-round-md' severity="help" icon='pi pi-money-bill' disabled={ disabled.donation }/>
                </div>

                <div style={ { minHeight: '600px'  } }>
                    
                    <DataTable scrollable scrollHeight="600px" style={{ minWidth: '50rem' }} value={data} lazy loading={loading} selectionMode="single" selection={selectedData} onSelectionChange={(e) => setSelectedData(e.value)}  dataKey="id" 
                        onRowSelect={onRowSelect} onRowUnselect={onRowUnselect}
                        expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data)}
                        rowExpansionTemplate={rowExpansionTemplate}
                        tableStyle={{ minWidth: '60rem' }}> 
                        <Column expander={allowExpansion} style={{ width: '5rem' }} />
                        <Column field="client" sortable header="Client"></Column>
                        <Column field="parish" sortable header="Parish"></Column>
                        <Column field="uniq_key" sortable header="Control ID"></Column>
                        <Column field="ref_key" sortable header="Reference Key"></Column>
                        <Column field="total_amount" sortable header="Amount" body={amountBodyTemplate}></Column>
                        <Column field="payment_status" sortable header="Payment Status" body={PaymentstatusBodyTemplate}></Column>
                        <Column field="status" sortable header="Status" body={statusBodyTemplate}></Column>
                    </DataTable>
                
                </div> 

                <ConfirmDialog
                    group="declarative"
                    visible={paymentVisible}
                    onHide={() => setPaymentVisible(false)}
                    content={({ hide }) => (
                        <Panel header={` Payment Confirmation`} className=''>
                           
                            <div className="flex flex-wrap col-12 -mt-3">
                                <div className='flex flex-column col-6'>
                                    <label className="font-semibold px-1 text-sm">Control ID</label>
                                    <InputText value={selected.uniq_key} className='w-full' variant="filled" disabled={ true} />
                                </div>

                                <div className='flex flex-column col-6'>
                                    <label className="font-semibold px-1 text-sm">Reference key</label>
                                    <InputText value={selected.ref_key} className='w-full' variant="filled" disabled={ true} />
                                </div>
                            </div>
                            <div className="flex flex-wrap col-12">
                                <div className='flex flex-column col-4'>
                                    <label className="font-semibold px-1 text-sm">Client</label>
                                    <InputText value={selected.client} className='w-full' variant="filled" disabled={ true} />
                                </div>

                                <div className='flex flex-column col-4'>
                                    <label className="font-semibold px-1 text-sm">Parish</label>
                                    <InputText value={selected.parish} className='w-full' variant="filled" disabled={ true} />
                                </div>

                                <div className='flex flex-column col-4'>
                                    <label className="font-semibold px-1 text-sm">Priest</label>
                                    <InputText value={selected.priest} className='w-full' variant="filled" disabled={ true} />
                                </div>
                            </div>

                            <div className="flex flex-wrap col-12">
                                
                                <div className='flex flex-column col-4'>
                                    <label className="font-semibold px-1 text-sm">Status</label>
                                    <InputText value={selected.status} className='w-full' variant="filled" disabled={ true} />
                                </div>

                                <div className='flex flex-column col-4'>
                                    <label className="font-semibold px-1 text-sm">Payment Status</label>
                                    <InputText value={selected.payment_status} className='w-full' variant="filled" disabled={ true} />
                                </div>

                                <div className='flex flex-column col-4'>
                                    {amountBodyTemplate(selected)}
                                </div>
                            </div>

                            <div className="flex justify-content-end flex-wrap p-2 gap-3">
                                <Button severity='secondary' icon="pi pi-times" label="Close" onClick={(e) => { setPaymentVisible(false) }}/>
                                <Button severity='success' icon="pi pi-check" label="Confirm Payment" onClick={(e) => { saveData(selectedData,table_name,"For Payment",loadData,setDisabled,setPaymentVisible) }}/>
                            </div>
                           
                        </Panel>
                    )}
                    style={{ width: '34vw' }} />
               
            </div> 
        </>
    )
}

export default ManageBaptism