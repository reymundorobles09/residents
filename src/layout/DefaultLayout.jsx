import { Accordion, AccordionTab } from 'primereact/accordion';
import { Avatar } from "primereact/avatar";
import { Badge } from "primereact/badge";
import { BreadCrumb } from "primereact/breadcrumb";
import { Button } from "primereact/button";
import { CartItem, formatCurrency, getStatusSeverity } from "../utils/Function";
import { classNames } from "primereact/utils";
import { ConfirmDialog } from "primereact/confirmdialog";
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import { DataScroller } from "primereact/DataScroller";
import { categories, GenerateRecord } from "../utils/Generate";
import { Menubar } from "primereact/menubar";
import { Navigate, Outlet, useNavigate } from "react-router-dom"
import { Sidebar } from "primereact/sidebar";
import { Tag } from "primereact/tag";
import { Toast } from "primereact/toast";
import { Tooltip } from "primereact/tooltip";
import { useEffect, useRef, useState } from "react";
import { useStateContext } from "../context/ContextProvider"
import Logo from '../assets/images/logo.png';
import Baptism from '../assets/images/baptism.png';
import Funeral from '../assets/images/funeral.png';
import Profile from '../assets/images/profile.jpg';
import { Timeline } from 'primereact/timeline';
import { Panel } from 'primereact/panel';

import { submitCart } from '../utils/Data';

function DefaultLayout() {
    const [ addedItems, setAddedItems] = useState([]);
    const [ cart, setCart ] = useState('');
    const [ paymentTotal, setPaymentTotal] = useState(0);
    const [ pendingPaymentVisible, setPendingPaymentVisible ] = useState(false);
    const [ rightSideBar,setRightSideBar ] = useState(null); 
    const { user, token, subtitle, setUser, setToken,  setSubtitle } = useStateContext();
    const navigate = useNavigate();
    const toast = useRef(null);

    if(!token){
        return <Navigate to='/login'/> 
    }

    

    const onLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem("Auth");
        localStorage.removeItem("ACCESS_TOKEN");
        localStorage.removeItem("Subtittle");
        window.location.reload();
    }

    const menuClick = (e) => {
        localStorage.setItem('Subtitle',e.item.label)
        setSubtitle([{ label: e.item.label }])
        navigate(e.item.geturl)
    }

    const loadCart = async () => {
        try {
            const data = await CartItem();
            setCart(data)
        } catch (err) {
            console.error('Failed to load data:', err);
        }
    };

    const items = [
        {
            label: 'Users',
            icon: 'pi pi-objects-column',
            items: [
                
                {
                    label: 'Users',
                    icon: 'pi pi-users',
                    geturl: '/user',
                    command: (e )=> {menuClick(e)}
                },
            ]
        },
        {
            label: 'Master Setup',
            icon: 'pi pi-th-large',
            items: [
                {
                    label: 'Client',
                    icon: 'pi pi-building',
                    geturl: '/client',
                    command: (e )=> {menuClick(e)}
                },{ separator: true },
                {
                    label: 'Parish',
                    icon: 'pi pi-building-columns',
                    geturl: '/parish',
                    command: (e )=> {menuClick(e)}
                },{ separator: true },
                {
                    label: 'Priest',
                    icon: 'pi pi-venus',
                    geturl: '/priest',
                    command: (e )=> {menuClick(e)}
                },
            ]
        },
        {
            label: 'Requests',
            icon: 'pi pi-briefcase',
            items: [
                {
                    label: 'Baptismal Request',
                    icon: 'pi pi-users',
                    geturl: '/baptismal-request',
                    command: (e )=> {menuClick(e)}
                },{ separator: true },
                {
                    label: 'WFB Request',
                    icon: 'pi pi-building',
                    geturl: '/wfb-request',
                    command: (e )=> {menuClick(e)}
                },
            ]
        },
        {
            label: 'Manage Corner',
            icon: 'pi pi-th-large',
            items: [
                {
                    label: 'Manage Baptism',
                    icon: 'pi pi-users',
                    geturl: '/manage-baptism',
                    command: (e )=> {menuClick(e)}
                }
                ,{ separator: true },
                {
                    label: 'Manage WFB',
                    icon: 'pi pi-building',
                    geturl: '/manage-wfb',
                    command: (e )=> {menuClick(e)}
                },
            ]
        },
        {
            label: 'Collections',
            icon: 'pi pi-credit-card',
            items: [
                {
                    label: 'Payments Receivables',
                    icon: 'pi pi-money-bill',
                    geturl: '/receivables',
                    command: (e )=> {menuClick(e)}
                },{ separator: true },
                {
                    label: 'Payments Collection',
                    icon: 'pi pi-money-bill',
                    geturl: '/collection',
                    command: (e )=> {menuClick(e)}
                },
            ]
        },
        {
            label: 'Dashboard',
            icon: 'pi pi-chart-line',
            geturl: '/dashboard',
            command: (e )=> {menuClick(e)}
        }
        
    ];

    const start = <img alt="logo" src={ Logo } height="50" className="mr-2" onClick={(e) => { setSubtitle([{ label: "Home" }]); navigate("/home") }}></img>;

    const cartHandle = (id,amount) => (e) => {
        e.preventDefault();
        if (!addedItems.includes(id)) {
            // Add the item to the cart
            setAddedItems((prev) => [...prev, id]);
            setPaymentTotal(paymentTotal+amount);
            
        } else {
            // Remove the item from the cart
            setAddedItems((prev) => prev.filter((num) => num !== id));
            setPaymentTotal(paymentTotal-amount);
        }
    };

    const itemTemplate = (category, index) => {
       
        return (
            <div className="col-12" key={category.id}>
                <div className={classNames('flex flex-column xl:flex-row xl:align-items-start p-4 gap-4', { 'border-top-1 surface-border': 0 })}>
                    <img className="w-9 sm:w-16rem xl:w-8rem shadow-2 block xl:block mx-auto p-4 border-round" src={category.module === "Baptism" ? Baptism : Funeral } alt={2} />
                    <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
                        <div className="flex flex-column align-items-center sm:align-items-start gap-2">
                            <div className="flex flex-column gap-1 mb-3"><span className='text-xl font-bold'>{category.uniq_key}</span> <span className='text-sm'>{category.ref_key}</span></div>
                            <div className="flex align-items-center gap-3">
                                <span className="flex align-items-center gap-2">
                                    <i className="pi pi-tag"></i>
                                    <span className="text-sm font-semibold">{category.module}</span>
                                </span>
                                <Tag value={category.status} severity={getStatusSeverity(category.status)} ></Tag>
                            </div>
                        </div>
                        <div className="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
                            <span className="text-xl mb-2 amount font-semibold">{formatCurrency(category.total_amount)}</span>
                            <Button rounded
                                key={category.id}
                                size='small'
                                icon={addedItems.includes(category.id) ? 'pi pi-check' : 'pi pi-plus'}
                                data-key={category.id}
                                value={category.total_amount}
                                severity={addedItems.includes(category.id) ? 'success' : 'primary'}
                                className="mt-2"
                                label={addedItems.includes(category.id) ? 'Added' : 'Add to Cart'}
                                onClick={cartHandle(category.id,category.total_amount)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const end = (
        <div className="flex align-items-center gap-2">
          
            <i className="pi pi-shopping-cart p-overlay-badge m-3" onClick={(e) => { setPendingPaymentVisible(true); setAddedItems([]); setPaymentTotal(0) } } style={{ fontSize: '1.3rem' }} >
                <Badge className="ms-2" value={ cart.length } ></Badge>
            </i>
            <Avatar label={ user?.username?.slice(0, 1)+''+user?.username?.slice(2, 3) }  shape="circle" onClick={()=>{setRightSideBar(true)}}/>
           
            <Tooltip target=".custom-tooltip-btn" className="bg-theme">
                <img alt="logo" src={Profile} data-pr-tooltip="PrimeReact-Logo" height="150px" />
            </Tooltip>
            
        </div>
    );

    const headerTemplate = (options) => {
        const className = `${options.className} justify-content-space-between py-3`;

        return (
            <div className={className}>
                <div className="flex align-items-center gap-2">
                    <span className="text-xl font-bold">Cart</span>
                </div>
                <div>
                    <button className="p-panel-header-icon p-link mr-2" onClick={(e) => { setPendingPaymentVisible(false)}}>
                        <span className="pi pi-times"></span>
                    </button>
                   
                </div>
            </div>
        );
    };

    const footerTemplate = (options) => {
        const className = `${options.className} flex flex-wrap align-items-center justify-content-end gap-3`;

        return (
            <div className={className}>
                <div className="flex align-items-center py-2">
                    <Button severity="info" className='text-lg' text label={`Total Amount: ${formatCurrency(paymentTotal)}`} onClick={ (e) => { submitCart(addedItems,paymentTotal,loadCart,setPendingPaymentVisible); navigate('/receivables'); setSubtitle([{ label: "Payments Receivables" }])  }} />
                </div>
             
            </div>
        );
    };

    useEffect(() => {
        const auth = JSON.parse(localStorage.getItem('Auth'));
        setUser(auth);
        loadCart();
    },[]);

    return (
        <>

            <Sidebar visible={rightSideBar} position="right" onHide={() => setRightSideBar(false)}>
               
                <div className="flex flex-column mx-auto md:mx-0">
                    <span className="mb-2 font-bold">{ user ? user.username : '' }</span>
                    <span className="text-color-secondary font-medium mb-5">{ user ? user.role : '' }</span>

                    <ul className="list-none m-0 p-0">
                        <li>
                            <a className="cursor-pointer flex mb-3 p-3 align-items-center  sidebar-link">
                                <span><i className="pi pi-user text-xl text-primary"></i></span>
                                <div className="ml-3"><span className="mb-2 font-semibold">Profile</span>
                                    <p className="text-color-secondary m-0">Lorem ipsum date visale</p>
                                </div>
                            </a>
                        </li>

                        <li>
                            <a className="cursor-pointer flex mb-3 p-3 align-items-center  sidebar-link">
                                <span><i className="pi pi-money-bill text-xl text-primary"></i></span>
                                <div className="ml-3"><span className="mb-2 font-semibold">Billing</span>
                                    <p className="text-color-secondary m-0">State your all billing.</p>
                                </div>
                            </a>
                        </li>
                        
                        <li>
                            <a className="cursor-pointer flex mb-3 p-3 align-items-center  sidebar-link">
                                <span><i className="pi pi-cog text-xl text-primary"></i></span>
                                <div className="ml-3"><span className="mb-2 font-semibold">Settings</span>
                                    <p className="text-color-secondary m-0">Other Setting</p>
                                </div>
                            </a>
                        </li>

                        <li>
                            <Accordion>
                                <AccordionTab header="Generate Records">
                                    <div>
                                        <Timeline value={categories} content={(category) => <Button label={category.name} value={category.action} onClick={GenerateRecord}/>} className='pr-8' />
                                    </div>
                                    
                                </AccordionTab>
                            </Accordion>
                           
                        </li>
                        
                        <li>
                            <a className="cursor-pointer flex mt-3 mb-3 p-3 align-items-center  sidebar-link" onClick={(e) => { onLogout(e) }}>
                                <span><i className="pi pi-power-off text-xl text-primary"></i></span>
                                <div className="ml-3"><span className="mb-2 font-semibold">Logout</span>
                                    <p className="text-color-secondary m-0">Log off your Credential</p>
                                </div>
                            </a>
                        </li>
                    </ul>

                    <Toast ref={toast} />
                    <ConfirmPopup />
                    
                </div>

            </Sidebar>


           
            {/* Menubar */}
            { user.email === '' ? '' : <Menubar model={items} start={start} end={end} style={ {padding: '15px'} } />}
            {/* Breadcrumbs */}
            { user.email === '' ? '' : <BreadCrumb home={ { label: 'Home', url: '/home' } } model={ subtitle } className="p-4 border-none bg-color line-height-1 text-2xl font-medium" style={ { backgroundColor: '#f6f6f9'} } /> }
            
            <Outlet/>

            <Toast ref={toast} />
            <ConfirmDialog
                className='mt-5'
                group="declarative"
                position='top'
                visible={pendingPaymentVisible}
                content={({ hide }) => (
                    <Panel headerTemplate={headerTemplate} footerTemplate={footerTemplate}>
                       
                            <DataScroller rows={5} inline scrollHeight="500px" className='py-2' value={cart} itemTemplate={itemTemplate} />
                       
                    </Panel>
                )}
                style={{ width: '35vw' }} />

        </>
    )
}

export default DefaultLayout
