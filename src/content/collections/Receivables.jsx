import React, { useState, useEffect, useRef, setState } from 'react';
import PayPal from '../../assets/images/paypal.png';
import Funeral from '../../assets/images/funeral.png';
import Cash from '../../assets/images/cash.png';
import Baptism from '../../assets/images/baptism.png';
import Bank from '../../assets/images/bank.png';
import { Tag } from 'primereact/tag';
import { RadioButton } from 'primereact/radiobutton';
import { InputText } from 'primereact/inputtext';
import { getReceivableData } from '../../utils/List';
import { formatCurrency, getClient, getParish, getStatusSeverity, ReceivableItem } from '../../utils/Function';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { DataScroller } from 'primereact/DataScroller';
import { Column } from 'primereact/column';
import { classNames } from "primereact/utils";
import { Card } from 'primereact/card';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { useStateContext } from '../../context/ContextProvider';
import { Divider } from 'primereact/divider';
import { Panel } from 'primereact/panel';
import { RequiredIndicator } from '../../utils/validator';
import { submitReceivable } from '../../utils/Data';
import { useNavigate } from 'react-router-dom';


function Receivables() {

    const [ addedItems, setAddedItems ] = useState([]);
    const [ data, setData ] = useState([]);
    const [ disabled, setDisabled ] = useState(true);
    const [ fields, setFields] = useState({});
    const [ invalid, setInvalid ] = useState([]);
    const [ loading, setLoading ] = useState(false) 
    const [ paymentTotal, setPaymentTotal ] = useState(0);
    const [ receivableItem, setReceivableItem ] = useState([]);
    const [ selected, setSelected ] = useState({});
    const [ selectedData, setSelectedData ] = useState(null);
    const [ visible, setVisible ] = useState(false);
    const { setSubtitle } = useStateContext();
    const [ clientOption, setClientOption ] = useState([]);
    const [ parishFilterLoading, setParishFilterLoading ] = useState(false)
    const [ parishFilterOption, setParishFilterOption ] = useState([]);
    const table_name = "receivables_table";
    const navigate = useNavigate();
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
            const fetchData = await getReceivableData(filter);
            setTimeout(()=>{
                setLoading(false);
                setData(fetchData);
            },1000)
        } catch (err) {
            console.error('Failed to load data:', err);
        }
    };

    const loadCart = async (target) => {
        try {
            const data = await ReceivableItem(target);
            setReceivableItem(data)
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
                setParishFilterOption(fetchData);
                setParishFilterLoading(false);

            },500)
        } catch (err) {
            console.error('Failed to load data:', err);
        }
    };

    const onRowSelect = (e) => {
        if(e.data.status === "New"){
            setDisabled(false);
            setSelected(e.data);
            setPaymentTotal(e.data.total_amount)
        }else{
            setDisabled(true);
            setSelected({});
        }
       

    };

    const onRowUnselect = (event) => {
        setDisabled(true);
    };

    const action = (e) => {
        e.preventDefault();
        setVisible(true)
        setFields({ mop: "Cash", total_amount: selectedData.total_amount})
        setSubtitle([{ label: "Payments Receivables" }, { label: "Process" }])
        loadCart(selectedData.uniq_key)
    }

    const back = (e) => {
        e.preventDefault();
        setVisible(false)
        setSelected({});
    }

    const handleFilterChange = (e) => {
        e.target.name  === "client" ? parish(e.target.value.id,'filter') : '';
        setFilter((filter) => ({
          ...filter,
          [e.target.name]: e.target.value,
        }));
      };

    const fieldChangeHandle = (e) => {
        setFields((fields) => ({
            ...fields,
            [e.target.name]: e.target.value,
            ['ref_key']: selected.uniq_key
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
      
        const validator = {
            'title': fields.title ? false : 'This field is required.',
            'paid_by_whom': fields.paid_by_whom ? false : 'This field is required.',
            'bank_name': fields.mop === "Bank" ? fields.bank_name ? false : 'This field is required.' : false,
            'card_number': fields.mop === "Bank" ? fields.card_number ? false : 'This field is required.' : false,
            'amount': fields.mop === "Cash" ? parseInt(fields.amount) <= parseInt(fields.total_amount) ? 'Invalid Amount' : false ?  'This field is required.' : false : false,
            'transaction_date': fields.transaction_date ? false : 'This field is required.',
            'remarks': fields.remarks ? false : 'This field is required.',
        }
        
        const hasErrors = Object.values(validator).some(error => error !== false);

        if(!hasErrors){
            console.log(hasErrors,validator,fields);
            submitReceivable(table_name,fields,selected,addedItems,setDisabled,loadData);
            setVisible(false)
            setInvalid({});
        }else{
            swal({
                title: "Opps!",
                text: 'Fix input error(s).',
                icon: "warning",
            })
            setInvalid(validator);
        }
    }

    const amountBodyTemplate = (rowData) => {
        return formatCurrency(rowData.total_amount);
    };

    const amount = (rowData) => {
        return formatCurrency(rowData);
    };

    const statusBodyTemplate = (rowData) => {
        return <Tag value={rowData.status.toUpperCase()} severity={getStatusSeverity(rowData.status)}></Tag>;
    };

    const cartHandle = (id,amount) => (e) => {
        e.preventDefault();
        if (!addedItems.includes(id)) {
            // Add the item to the cart
            setAddedItems((prev) => [...prev, id]);
            setPaymentTotal(paymentTotal-amount);
            
        } else {
            // Remove the item from the cart
            setAddedItems((prev) => prev.filter((num) => num !== id));
            setPaymentTotal(paymentTotal+amount);
        }
        
    };

    const itemTemplate = (category, index) => {
        
        return (
            <div className="col-12" key={category.id}>
                <div className={classNames('flex flex-column xl:flex-row xl:align-items-start p-4 gap-4', { 'border-top-1 surface-border': 0 })}>
                    <img className="w-9 sm:w-16rem xl:w-8rem shadow-2 block xl:block mx-auto border-round p-4" src={category.module === "Baptism" ? Baptism : Funeral } alt={2} />
                    <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
                        <div className="flex flex-column align-items-center sm:align-items-start gap-2">
                            <div className="flex flex-column gap-1"><span className='text-xl font-bold'>{category.uniq_key}</span> </div>
                            <div className="flex flex-column gap-1"><span className='text-sm font-bold'>{category.mng_baptism_key}</span> </div>
                            <div className="flex flex-column gap-1 mb-3"><span className='text-sm font-bold'>{category.baptism_key}</span> </div>
                            <div className="flex align-items-center gap-3">
                                <span className="flex align-items-center gap-2">
                                    <i className="pi pi-tag"></i>
                                    <span className="text-sm font-semibold">{category.module}</span>
                                </span>
                                {statusBodyTemplate(category)}
                            </div>
                        </div>
                        <div className="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
                            <span className="text-lg mb-2 amount font-semibold">{formatCurrency(category.total_amount)}</span>
                            <Button rounded
                                key={category.id}
                                icon={addedItems.includes(category.uniq_key) ? 'pi pi-undo' : 'pi pi-trash'}
                                data-key={category.uniq_key}
                                value={category.total_amount}
                                severity={addedItems.includes(category.uniq_key) ? 'danger' : 'danger'}
                                className="mt-2"
                                size='small'
                                label={addedItems.includes(category.uniq_key) ? 'Undo' : 'Remove'}
                                onClick={cartHandle(category.uniq_key,category.total_amount)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const orderSummary = (options) => {
        const className = `${options.className} justify-content-space-between py-3`;
        return (
            <div className={className}>
                <div className="flex align-items-center gap-2">
                    <span className="text-xl font-bold">Order Summary</span>
                </div>
            </div>
        );
    };

    const paymentsTemplates = (options) => {
        const className = `${options.className} justify-content-space-between py-3`;
        return (
            <div className={className}>
                <div className="flex align-items-center gap-2">
                    <span className="text-xl font-bold">Payments Details</span>
                </div>
            </div>
        );
    };

    const footerTemplate = (options) => {
        const className = `${options.className} flex flex-wrap align-items-center justify-content-end gap-3`;

        return (
            <div className={className}>
                <div className="flex align-items-center py-2">
                    <Button severity="info" className='text-lg' text label={`Total Amount: ${formatCurrency(paymentTotal)}`} />
                </div>
                
            </div>
        );
    };
    
    useEffect(()=> {
        client();
        loadData();
    }, [])


    
    return (
        <>
             <div className="card">   
             <div className={ visible === false ? `show` : `hidden`}> 
                        
                    <div className="flex justify-content-start mt-2 row gap-1 mb-4">
                        <div className="flex row gap-2">
                        <Dropdown   name="client" value={filter.client} onChange={ handleFilterChange } options={clientOption} optionLabel="name" placeholder="Select a Client" className="w-full md:w-14rem" />
                        <Dropdown   name="parish" value={filter.parish} onChange={ handleFilterChange } options={parishFilterOption} optionLabel="name" placeholder={parishFilterLoading ? "Loading..." : "Select a Parish" } className="w-full md:w-14rem" loading={parishFilterLoading} />
                            <Dropdown variant="filled"  name="mode" value={filter.mode} onChange={ handleFilterChange } options={modeOption} optionLabel="name" placeholder="Select a Filter" className="w-full md:w-14rem" />
                            <InputText onChange={ handleFilterChange } name="keyword" className="w-full md:w-15rem" placeholder="Enter a keyword.." />
                            <Button raised label='Show' className='border-round-md' severity="info" icon="pi pi-search" onClick={ (e) => { btnLoad(e) } } />
                        </div>
                    </div>
            
                    <div className="flex justify-content-end row gap-1 mb-4">
                        <Button raised label='Process' onClick={(e) => action(e)} data-label='Process' className='border-round-md' severity="pending" disabled={ disabled } icon='pi pi-book'/>
                        {/* <Button raised label='View' onClick={(e) => action(e)} data-label='View' className='border-round-md' severity="secondary" icon='pi pi-eye' disabled={ disabled } /> */}
                    </div>

                    <div style={ { minHeight: '500px'  } }>
                        
                    <DataTable value={data} lazy loading={loading} selectionMode="single" selection={selectedData} onSelectionChange={(e) => setSelectedData(e.value)} dataKey="id"
                        onRowSelect={onRowSelect} onRowUnselect={onRowUnselect} metaKeySelection={false} tableStyle={{ minWidth: '50rem' }}>
                        <Column field="client" sortable header="Client"/>
                        <Column field="parish" sortable header="Parish"/>
                        <Column field="uniq_key" sortable header="Control ID"/>
                        <Column field="collection_key" sortable header="Collection ID"/>
                        <Column field="total_amount" sortable header="Total Amount" body={amountBodyTemplate}/>
                        <Column field="status" sortable header="Status" body={statusBodyTemplate}/>
                        <Column field="remarks" sortable header="Remarks"/>
                        <Column field="created_by" sortable header="Created By"/>
                        <Column field="created_at" sortable header="Created At"/>
                    </DataTable>
                    
                    </div>
                </div>

                <div className={ visible === true ? `show` : `hidden`}> 
                    <div className="flex flex-column p-3">
                        
                        <div className="flex  gap-1">
                            <div className='flex flex-column gap-3 w-5'>
                                
                            <Panel headerTemplate={paymentsTemplates}>
                                <div className="flex flex-column h-auto "> 

                                    <div className="flex flex-row-column justify-content-between">
                                        <div className="flex col-12 flex-column gap-1">
                                            <label className='font-base' htmlFor="total_amount">Control ID</label>
                                            <InputText name="total_amount" value={selected.uniq_key} disabled={true} variant='filled' className='w-full' aria-describedby="total_amount-help"  />
                                        </div>
                                    </div>
                                    <div className="flex flex-row-column justify-content-between">

                                        <div className="flex col-6 flex-column gap-1">
                                            <label className='font-base' htmlFor="total_amount">Client</label>
                                            <InputText name="total_amount" value={selected.client_id?.name} disabled={true} variant='filled' className='w-full' aria-describedby="total_amount-help"  />
                                        </div>

                                        <div className="flex col-6 flex-column gap-1">
                                            <label className='font-base' htmlFor="total_amount">parish</label>
                                            <InputText name="total_amount" value={selected.parish_id?.name} disabled={true} variant='filled' className='w-full' aria-describedby="total_amount-help"  />
                                        </div>
                                    </div>
                                    <Divider/>
                                    <div className="flex flex-row-column justify-content-center gap-5 mb-4 mt-3">
                                        <div className="flex align-items-center">
                                            <RadioButton inputId="cash" name="mop" value="Cash" onChange={e => fieldChangeHandle(e)}  checked={fields.mop === 'Cash'} />
                                            <label htmlFor="cash" className="ml-2"><img htmlFor="cash" className="w-9 sm:w-16rem xl:w-5rem shadow-2 block xl:block p-2 border-round" src={ Cash } /></label>
                                        </div>
                                        <div className="flex align-items-center">
                                            <RadioButton inputId="bank" name="mop" value="Bank" onChange={e => fieldChangeHandle(e)}  checked={fields.mop === 'Bank'} />
                                            <label htmlFor="bank" className="ml-2"><img htmlFor="bank" className="w-9 sm:w-16rem xl:w-5rem shadow-2 block xl:block p-3 border-round" src={ Bank } /></label>
                                        </div>
                                        <div className="flex align-items-center">
                                            <RadioButton inputId="e_payment" name="mop" value="E-Payment" onChange={e => fieldChangeHandle(e)}  checked={fields.mop === 'E-Payment'} />
                                            <label htmlFor="e_payment" className="ml-2"><img htmlFor="e_payment" className="w-9 sm:w-16rem xl:w-5rem shadow-2 block xl:block p-4 border-round" src={ PayPal } /></label>
                                        </div>
                                    </div>

                                    <div className="flex flex-row gap-1">
                                        <div className="flex col-6 flex-column gap-1">
                                            <label className='font-base' htmlFor="title">Title <RequiredIndicator/></label>
                                            <InputText name="title" value={fields.title} onChange={e => fieldChangeHandle(e)} className='w-full' aria-describedby="title-help"  />
                                            <small className='text-danger'>
                                                { invalid.title}
                                            </small>
                                        </div>

                                        <div className="flex col-6 flex-column gap-1">
                                            <label className='font-base' htmlFor="paid_by_whom">Paid by whom <RequiredIndicator/></label>
                                            <InputText name="paid_by_whom" value={fields.paid_by_whom} onChange={e => fieldChangeHandle(e)} className='w-full' aria-describedby="paid_by_whom-help"  />
                                            <small className='text-danger'>
                                                { invalid.paid_by_whom}
                                            </small>
                                        </div>
                                    </div>

                                

                                    <div className={` ${ fields.mop != `Bank` ? ` hidden flex-row gap-1 ` : `flex flex-row gap-1 ` }`}>
                                        <div className="flex col-6 flex-column gap-1 ">
                                            <label className='font-base' htmlFor="bank_name">Bank Name <RequiredIndicator/></label>
                                            <InputText name="bank_name" value={fields.bank_name} onChange={e => fieldChangeHandle(e)} className='w-full' aria-describedby="bank_name-help"  />
                                            <small className='text-danger'>
                                                { invalid.bank_name}
                                            </small>
                                        </div>
                                        <div className="flex col-6 flex-column gap-1">
                                            <label className='font-base' htmlFor="card_number">Card Number <RequiredIndicator/></label>
                                            <InputText name="card_number" value={fields.card_number} onChange={e => fieldChangeHandle(e)} className='w-full' aria-describedby="card_number-help"  />
                                            <small className='text-danger'>
                                                { invalid.card_number}
                                            </small>
                                        </div>
                                    </div>

                                    <div className={` ${ fields.mop == `Bank` ? ` hidden flex-row gap-1 ` : `flex flex-row gap-1 ` }`}>
                                        <div className="flex col-6 flex-column gap-1">
                                            <label className='font-base' htmlFor="amount">Amount <RequiredIndicator/></label>
                                            <InputText name="amount" value={fields.amount} onChange={e => fieldChangeHandle(e)} className='w-full' aria-describedby="amount-help"  />
                                            <small className='text-danger'>
                                                { invalid.amount}
                                            </small>
                                        </div>

                                        <div className="flex col-6 flex-column gap-1">
                                            <label className='font-base' htmlFor="total_amount">Total Amount <RequiredIndicator/></label>
                                            <InputText name="total_amount" value={fields.total_amount ?? paymentTotal} disabled={true} variant='filled' className='w-full' aria-describedby="total_amount-help"  />
                                            <small className='text-danger'>
                                                { invalid.total_amount}
                                            </small>
                                        </div>
                                    </div>

                                    <div className="flex flex-row gap-1">
                                        <div className="flex col-6 flex-column gap-1">
                                            <label className='font-base' htmlFor="transaction_date">Transaction Date <RequiredIndicator/></label>
                                            <Calendar className='w-full' showIcon id="calendar-12h" name="transaction_date" value={ new Date(fields.transaction_date) } onChange={(e) => fieldChangeHandle(e)}/>
                                                <small className='text-danger'>
                                                { invalid.transaction_date}
                                            </small>
                                        </div>

                                        <div className="flex col-6 flex-column gap-1">
                                            <label className='font-base' htmlFor="remarks">Remarks <RequiredIndicator/></label>
                                            <InputText name="remarks" value={fields.remarks} onChange={e => fieldChangeHandle(e)} className='w-full' aria-describedby="remarks-help"  />

                                            <small className='text-danger'>
                                                { invalid.remarks}
                                            </small>
                                        </div>
                                    </div>

                                    <div className="flex flex-row gap-1 mt-3">
                                        <div className="flex col-12 flex-column gap-1">
                                            <Button raised label="Confirm" severity="primary" onClick={handleSubmit}/>
                                        </div>
                                    </div>
                                </div>
                            </Panel>

                               
                            </div>


                            <div className='flex flex-column w-8 gap-5 px-4'>
                                <Panel headerTemplate={orderSummary} footerTemplate={footerTemplate}>
                                    <DataScroller rows={5} inline scrollHeight="500px" value={receivableItem} itemTemplate={itemTemplate} /> 
                                </Panel>
                            </div>
                            
                            
                        </div>
                    </div>
                </div>
            </div> 
        </>
    )
}

export default Receivables
