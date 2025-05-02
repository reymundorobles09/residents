
// import React, { useRef } from 'react';
// import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
// import { Toast } from 'primereact/toast';
// import { Button } from 'primereact/button';

// export default function TemplateDemo() {
//     const toast = useRef(null);

//     const accept = () => {
//         toast.current.show({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted', life: 3000 });
//     };

//     const reject = () => {
//         toast.current.show({ severity: 'warn', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
//     };

//     const showTemplate = () => {
//         confirmDialog({
//             header: 'Files',
//             draggable: false,
//             style: { width: '50vw' },
//             message: (
//                 <div className="flex justify-content-center gap-3 ">
//                     <i className="pi pi-exclamation-circle text-6xl text-primary-500"></i>
//                     <span>Please confirm to proceed moving forward.</span>
//                 </div>
//             ),
//             accept,
//             reject
//         });
//     };

//     return (
//         <>
//             <Toast ref={toast} />
//             <ConfirmDialog  />
//             <div className="card flex justify-content-center">
//                 <Button onClick={() => showTemplate()} icon="pi pi-check" label="Confirm"></Button>
//             </div>
//         </>
//     )
// }


import React from 'react'; 
import { Timeline } from 'primereact/timeline';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
// import './TimelineDemo.css';

export default function TemplateDemo() {
        const events = [
        { status: 'Ordered', date: '15/10/2020 10:30', icon: 'pi pi-shopping-cart', color: '#9C27B0', image: 'game-controller.jpg' },
        { status: 'Processing', date: '15/10/2020 14:00', icon: 'pi pi-cog', color: '#673AB7' },
        { status: 'Shipped', date: '15/10/2020 16:15', icon: 'pi pi-shopping-cart', color: '#FF9800' },
        { status: 'Delivered', date: '16/10/2020 10:00', icon: 'pi pi-check', color: '#607D8B' }
    ];

    const customizedMarker = (item) => {
        return (
            <span className="flex w-2rem h-2rem align-items-center justify-content-center text-white border-circle z-1 shadow-1" style={{ backgroundColor: item.color }}>
                <i className={item.icon}></i>
            </span>
        );
    };

    const customizedContent = (item) => {
        return (
            <Card title={item.status} subTitle={item.date}>
                { item.image && <img src={`https://primefaces.org/cdn/primereact/images/product/${item.image}`} alt={item.name} width={200} className="shadow-1" />}
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam deserunt
                    quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate neque quas!</p>
            </Card>
        );
    };
        
    return (
        <div className="card">
            <Timeline value={events} align="alternate" className="customized-timeline" marker={customizedMarker} content={customizedContent} />
        </div>
    )
}
        