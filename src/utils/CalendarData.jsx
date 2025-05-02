import Dexie from 'dexie';
import { user_table, client_table, parish_table, priest_table, baptism_table, wfb_table, manage_baptism_table, payment_table, receivable_table, collection_table } from "./Fields";

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

export const formatDate = (dateString, format = 'YYYY-MM-DD hh:mm:ss A') => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours() % 12 || 12).padStart(2, '0'); // 12-hour format
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const ampm = date.getHours() >= 12 ? 'PM' : 'AM';
  
    return format.replace('YYYY', year)
      .replace('MM', month)
      .replace('DD', day)
      .replace('hh', hours)
      .replace('mm', minutes)
      .replace('ss', seconds)
      .replace('A', ampm);
};

export const moveDate = async function(fields,loadData){
    console.log('fields',fields);
    try {
        await db.wfb_table.update(fields.id, fields);
        return loadData();

    } catch (err) {
        console.error('Error:', err);
    }
}



