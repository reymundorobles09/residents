import Dexie from 'dexie';
import { user_table, client_table, parish_table, priest_table, baptism_table, wfb_table, manage_baptism_table, payment_table, receivable_table, collection_table } from "./Fields";
import moment from 'moment-timezone';
import { formatDate } from './CalendarData';
import { Auth } from './Auth';

const db = new Dexie('Mond');
db.version(1).stores({
    user_table: user_table,
    client_table: client_table,
    parish_table: parish_table,
    priest_table: priest_table,
    baptism_table: baptism_table,
    wfb_table: wfb_table,
    manage_baptism_table: manage_baptism_table,
    payment_table: payment_table,
    receivable_table: receivable_table,
    collection_table: collection_table,
});

export const getUsersData = async function(filter){

    const keyword = filter?.keyword?.toLowerCase();
    const mode = filter?.mode;
    const fields = filter?.fields || [];
    const client = filter?.client;
    const parish = filter?.parish;

    try {
        let data = await db.user_table.toArray();
      
        // Apply filters
        if (keyword) {
            if (mode) {
                data = data.filter(item => item[mode].toString().toLowerCase().includes(keyword));
            } else {
                // Search across multiple fields
                data = data.filter(item => 
                    fields.some(field => {
                        const fieldValue = item[field.value]?.toString().toLowerCase() || '';
                        return fieldValue.includes(keyword);
                    })
                );
            }
        }

        data.forEach(field => {
            field.fullname = field.last_name+', '+field.first_name+' '+field.middle_name;
            field.client = field.client_id?.name || '',
            field.parish = field.parish_id?.name || '',
            field.others = [{ 
                address_line_1: field.address_line_1, 
                address_line_2: field.address_line_2, 
                city: field.city, 
                country: field.country.name, 
                created_by: field.created_by, 
                created_at: field.created_at 
            }]
        });

        // Filter by client if specified
        if (client?.name) {
            data = data.filter(item => item.client === client.name);
        }

        if (parish?.name) {
            data = data.filter(item => item.parish === parish.name);
        }

        return data;
    } catch (err) {
        console.error('Error:', err);
        throw err;
    }
}

export const getClientData = async function(filter){
    const keyword = filter?.keyword?.toLowerCase();
    const mode = filter?.mode;
    const fields = filter?.fields || [];

    try {
        let data = await db.client_table.toArray();

        if (keyword) {
            if (mode) {
                data = data.filter(item => item[mode].toString().toLowerCase().includes(keyword));
            } else {
                // Search across multiple fields
                data = data.filter(item => 
                    fields.some(field => {
                        const fieldValue = item[field.value]?.toString().toLowerCase() || '';
                        return fieldValue.includes(keyword);
                    })
                );
            }
        }

        return data;

    } catch (err) {
        console.error('Error:', err);
        throw err;
    }
    
}


  export const getParishData = async function(filter) {
    const keyword = filter?.keyword?.toLowerCase();
    const mode = filter?.mode;
    const fields = filter?.fields || [];
    const client = filter?.client;
    
    try {
        let data = await db.parish_table.toArray();

        // Process client and parent names first
        data.forEach(field => {
            field.client = field.client_id.name;
            field.parent = field.isParent === "Yes" ? field.parent_id.name : '';
        });

        // Apply filters
        if (keyword) {
            if (mode) {
                data = data.filter(item => item[mode].toString().toLowerCase().includes(keyword));
            } else {
                // Search across multiple fields
                data = data.filter(item => 
                    fields.some(field => {
                        const fieldValue = item[field.value]?.toString().toLowerCase() || '';
                        return fieldValue.includes(keyword);
                    })
                );
            }
        }

        // Filter by client if specified
        if (client?.name) {
            data = data.filter(item => item.client === client.name);
        }

        return data;
    } catch (err) {
        console.error('Error:', err);
        throw err;
    }
}

export const getPriestData = async function(filter){
    
    const keyword = filter?.keyword?.toLowerCase();
    const mode = filter?.mode;
    const fields = filter?.fields || [];
    const client = filter?.client;
    const parish = filter?.parish;
    const chapel = filter?.chapel;
    
    try {
        
        let data = await db.priest_table.toArray();

        // Apply filters
        if (keyword) {
            if (mode) {
                data = data.filter(item => item[mode].toString().toLowerCase().includes(keyword));
            } else {
                // Search across multiple fields
                data = data.filter(item => 
                    fields.some(field => {
                        const fieldValue = item[field.value]?.toString().toLowerCase() || '';
                        return fieldValue.includes(keyword);
                    })
                );
            }
        }

        data.forEach(field => {
            field.client = field.client_id.name;
            field.parish = field.parish_id.name;
            field.chapel = field.chapel_id.name;
        });

        // Filter by client if specified
        if (client?.name) {
            data = data.filter(item => item.client === client.name);
        }

        if (parish?.name) {
            data = data.filter(item => item.parish === parish.name);
        }

        if (chapel?.name) {
            data = data.filter(item => item.chapel === chapel.name);
        }
      
        return data; 
      
    } catch (err) {
        console.error('Error:', err);
        throw err;
    }
}

export const getBaptismalData = async function(filter){
    
    const keyword = filter?.keyword?.toLowerCase();
    const mode = filter?.mode;
    const fields = filter?.fields || [];
    const client = filter?.client;
    const parish = filter?.parish;
    
    try {

        let data = await db.baptism_table.toArray();
        // Apply filters

        data.forEach(field => {
            field.image = field.image ?? [];
            field.image.forEach(file => {
                file.baseURL = URL.createObjectURL(file.objectURL);
            }),
            field.documents = field.image.length,
            field.client = field.client_id.name,
            field.parish = field.parish_id.name,
            field.start = formatDate(field.date_start, 'YYYY-DD-MM')+' '+formatDate(field.time_start, 'hh:mm A'),
            field.end = formatDate(field.date_end, 'YYYY-DD-MM')+' '+formatDate(field.time_end, 'hh:mm A')
            
            field.others = [ { 
                father: field.father_lastname+', '+field.father_firstname+' '+field.father_middlename, //+' '+field.father_suffix, 
                mother: field.mother_lastname+', '+field.mother_firstname+' '+field.mother_middlename, //+' '+field.mother_suffix,
                no_of_guest: field.no_of_guest, 
                remarks: field.remarks, 
                created_by: field.created_by, 
                created_at: field.created_at, 
            } ]
        });

        if (keyword) {
            if (mode) {
                console.log(mode);
                data = data.filter(item => item[mode].toString().toLowerCase().includes(keyword));
            } else {
                // Search across multiple fields
                data = data.filter(item => 
                    fields.some(field => {
                        const fieldValue = item[field.value]?.toString().toLowerCase() || '';
                        return fieldValue.includes(keyword);
                    })
                );
            }
        }

        // Filter by client if specified
        if (client?.name) {
            data = data.filter(item => item.client === client.name);
        }

        if (parish?.name) {
            data = data.filter(item => item.parish === parish.name);
        }


        return data; 

    } catch (err) {
        console.error('Error:', err);
        throw err;
    }
}

export const getWFBData = async function(filter){
    const client = filter?.client;
    const parish = filter?.parish;
  
    try {
        
        const data = await db.wfb_table.toArray();

        

        data.forEach(field => {
            field.target = field.id,

            field.image ? field.image.forEach(file => {
                file.baseURL = URL.createObjectURL(file.objectURL);
            }) : [],
            field.documents = field.image ? field.image.length : 0,
            field.title = field.control_id;
            field.status = field.status;
            field.client = field.client_id.name;
            field.parish = field.parish_id.name;
            field.chapel = field.chapel_id.name;
            field.date_started = formatDate(field.customStart, 'YYYY-DD-MM')+' '+formatDate(field.chapel_schedule[0].time_start, 'hh:mm A');
            field.date_ended = formatDate(field.customEnd, 'YYYY-DD-MM')+' '+formatDate(field.chapel_schedule[0].time_end, 'hh:mm A');
            field.chapel_schedule = [{
                id: field.chapel_schedule[0].id,
                start: field.customStart,
                time_start: field.chapel_schedule[0].time_start,
                end: field.customEnd,
                time_end: field.chapel_schedule[0].time_end,
            }];

            switch (field.status) {
                case 'New':
                    field.color = '#0ea5e9';
                    field.textColor = '#fff';
                    field.classNames = 'New';
                    break;

                case 'Ongoing':
                    field.color = '#a855f7';
                    field.textColor = '#fff';
                    field.classNames = 'Ongoing';
                break;
                
                case 'Completed':
                    field.color = '#22c55e';
                    field.textColor = '#fff';
                    field.classNames = 'Pending';
                    break;

                case 'Cancelled':
                    field.color = '#ef4444';
                    field.textColor = '#fff';
                    field.classNames = 'Cancelled';
                break;

                case 'Closed':
                    field.color = '#64748b';
                    field.textColor = '#fff';
                    field.classNames = 'Closed';
                    break;

                default:
                    break;
            }
            
        });

        if(client){
            return data.filter(item => item.client.includes(client.name));
        }

        if(parish){
            return data.filter(item => item.parish.includes(parish.name));
        }

        return data; 

    } catch (err) {
        console.error('Error:', err);
        throw err;
    }
}

export const getManageBaptismalData = async function(filter){
    
    const keyword = filter?.keyword?.toLowerCase().trim();
    const mode = filter?.mode;
    const fields = filter?.fields || [];
    const client = filter?.client;
    const parish = filter?.parish;
    
    try {

        let data = await db.manage_baptism_table.toArray();
        
        data.forEach(field => {
            field.client = field.client_id.name,
            field.parish = field.parish_id.name,
            field.priest = field.priest_id.name,
            field.total_amount = field.parish_id?.parish_rate + field.priest_id?.priest_rate ,
            field.start = formatDate(field.date_start, 'YYYY-DD-MM')+' '+formatDate(field.time_start, 'hh:mm A'),
            field.end = formatDate(field.date_end, 'YYYY-DD-MM')+' '+formatDate(field.time_end, 'hh:mm A'),
            field.others = [{
                start: formatDate(field.date_start, 'YYYY-DD-MM')+' '+formatDate(field.time_start, 'hh:mm A'),
                end: formatDate(field.date_end, 'YYYY-DD-MM')+' '+formatDate(field.time_end, 'hh:mm A'),
                remarks: field.remarks,
                created_by: field.created_by,
                created_at: field.created_at,
                priest: field.priest_id.name,
            }]
        });


        if (keyword) {
            if (mode) {
                data = data.filter(item => item[mode].toString().toLowerCase().includes(keyword));
            } else {
                // Search across multiple fields
                data = data.filter(item => 
                    fields.some(field => {
                        const fieldValue = item[field.value]?.toString().toLowerCase() || '';
                        return fieldValue.includes(keyword);
                    })
                );
            }
        }

        // Filter by client if specified
        if (client?.name) {
            data = data.filter(item => item.client === client.name);
        }

        if (parish?.name) {
            data = data.filter(item => item.parish === parish.name);
        }
        
        console.log(data);

        return data; 

    } catch (err) {
        console.error('Error:', err);
        throw err;
    }
}

export const getReceivableData = async function(filter){
    const keyword = filter?.keyword?.toLowerCase();
    const mode = filter?.mode;
    const fields = filter?.fields || [];
    const client = filter?.client;
    const parish = filter?.parish;

    try {
        let data = await db.receivable_table.toArray();

        if (keyword) {
            if (mode) {
                data = data.filter(item => item[mode].toString().toLowerCase().includes(keyword));
            } else {
                // Search across multiple fields
                data = data.filter(item => 
                    fields.some(field => {
                        const fieldValue = item[field.value]?.toString().toLowerCase() || '';
                        return fieldValue.includes(keyword);
                    })
                );
            }
        }
       
        data.forEach(element => {
            element.client = element.client_id.name;
            element.parish = element.parish_id.name;
        });

        if(client){
            return data.filter(item => item.client.includes(client.name));
        }

        if(parish){
            return data.filter(item => item.parish.includes(parish.name));
        }

        return  data; 

    } catch (err) {
        console.error('Error:', err);
        throw err;
    }
    
}