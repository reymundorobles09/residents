// import React, { useRef } from 'react';
// import html2canvas from 'html2canvas';
// import jsPDF from 'jspdf';

// const TestPrintPDF = () => {
//   const contentRef = useRef(null);

//   const handlePrint = () => {
//     const input = contentRef.current;
//     html2canvas(input).then((canvas) => {
//       const imgData = canvas.toDataURL('image/png');
//       const pdf = new jsPDF();
//       pdf.addImage(imgData, 'PNG', 0, 0);
//       pdf.save('download.pdf');
//     });
//   };

//   return (
//     <div>
//       <button onClick={handlePrint}>Print PDF</button>
//       <div ref={contentRef}>
//         <h1>Hello, this is a PDF document!</h1>
//         <p>This content will be converted to a PDF.</p>
//       </div>
//     </div>
//   );
// };

// export default TestPrintPDF;

import React, { useState } from "react";
import { MultiSelect } from 'primereact/multiselect';

export default function ChipsDemo() {
    const [selectedCities, setSelectedCities] = useState(null);
    const cities = [
        { name: 'New York', code: 'NY' },
        { name: 'Rome', code: 'RM' },
        { name: 'London', code: 'LDN' },
        { name: 'Istanbul', code: 'IST' },
        { name: 'Paris', code: 'PRS' }
    ];

    return (
        <div className="card flex justify-content-center">
            <MultiSelect value={selectedCities} onChange={(e) => setSelectedCities(e.value)} options={cities} optionLabel="name" display="chip" 
                placeholder="Select Cities" maxSelectedLabels={3} className="w-full md:w-20rem" />
        </div>
    );
}