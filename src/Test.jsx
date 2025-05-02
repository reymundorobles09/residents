// import React, { useRef } from "react";
// import FullCalendar from "@fullcalendar/react";
// import dayGridPlugin from "@fullcalendar/daygrid";
// import interactionPlugin from "@fullcalendar/interaction";

// const MyCalendar = () => {
//   const calendarRef = useRef(null);

//   // Sample events
//   const events = [
//     {
//       title: "WFB-RQST-TB74-2025-02-28",
//       end: "2025-03-02",
//       id: 1,
//       start: "2025-03-01",
//       status: "New",
//       color: '#0ea5e9',
//     },
//     {
//       title: "WFB-RQST-TB74-2025-02-28",
//       end: "2025-03-02",
//       id: 2,
//       start: "2025-03-01",
//       status: "Ongoing",
//       color: '#a855f7',
//     },
//     {
//       title: "WFB-RQST-TB74-2025-02-28",
//       end: "2025-03-02",
//       id: 3,
//       start: "2025-03-01",
//       status: "Completed",
//       color: '#22c55e',
//     },
//     {
//       title: "WFB-RQST-TB74-2025-02-28",
//       end: "2025-03-02",
//       id: 4,
//       start: "2025-03-01",
//       status: "Cancelled",
//       color: '#ef4444',
//     },
//     {
//       title: "WFB-RQST-TB74-2025-02-28",
//       end: "2025-03-02",
//       id: 5,
//       start: "2025-03-01",
//       status: "Closed",
//       color: '#64748b',
//     }
//   ];

//   // Handle legend click
//   const handleLegendClick = () => {
//     if (calendarRef.current) {
//       const calendarApi = calendarRef.current.getApi();
//       const allEvents = calendarApi.getEvents(); // Get all events

//       // Filter events with status "New"
//       const newEvents = allEvents.filter((event) => event.extendedProps.status === "New");

//       // Log or manipulate the events
//       console.log("New Events:", newEvents);

//       // Example: Hide all "New" events
//       newEvents.forEach((event) => event.setProp("display", "none"));
//     }
//   };

//   return (
//     <div>
//       {/* Legend */}
//       <div onClick={handleLegendClick} style={{ cursor: "pointer" }}>
//         <span style={{ color: "blue" }}>Hide New Events</span>
//       </div>

//       {/* FullCalendar */}
//       <FullCalendar
//         plugins={[dayGridPlugin, interactionPlugin]}
//         initialView="dayGridMonth"
//         events={events}
//         ref={calendarRef}
//         eventContent={(arg) => {
//           // Customize event rendering (optional)
//           return <div>{arg.event.title}</div>;
//         }}
//       />
//     </div>
//   );
// };

// export default MyCalendar;


import React, { useState } from 'react';

function Base64Example() {
  const [inputText, setInputText] = useState('');
  const [encodedText, setEncodedText] = useState('');
  const [decodedText, setDecodedText] = useState('');

  const handleEncode = () => {
    const encoded = btoa(inputText); // Base64 encode
    setEncodedText(encoded);
  };

  const handleDecode = () => {
    try {
      const decoded = atob(encodedText); // Base64 decode
      setDecodedText(decoded);
    } catch (error) {
      setDecodedText('Invalid Base64 string');
    }
  };

  return (
    <div>
      <h2>Base64 Encoding/Decoding</h2>
      <div>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter text to encode"
        />
        <button onClick={handleEncode}>Encode</button>
      </div>
      <div>
        <textarea
          value={encodedText}
          onChange={(e) => setEncodedText(e.target.value)}
          placeholder="Encoded text will appear here"
        />
        <button onClick={handleDecode}>Decode</button>
      </div>
      <div>
        <p>Decoded result: {decodedText}</p>
      </div>
    </div>
  );
}

export default Base64Example;