import Dexie from 'dexie';
import { user_table, client_table, parish_table, priest_table, baptism_table, wfb_table, manage_baptism_table, payment_table, receivable_table, collection_table } from "./Fields";
import Users from '../assets/images/users.png';
import Client from '../assets/images/client.png';
import Parish from '../assets/images/parish.png';
import Chapel from '../assets/images/chapel.png';
import Priest from '../assets/images/priest.png';

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

export const getClient = async function(){
    try {
        const data = await db.client_table.toArray();
        const simplifiedData = data.map(client => ({
            id: client.id,
            name: client.name
          }));

        return simplifiedData; 
    } catch (err) {
        console.error('Error:', err);
        throw err;
    }
    
}

export const getParish = async function(target){
    try {
        return (await db.parish_table.toArray())
        .filter(item => item.client_id.id === target && item.isParent === "No") // Combine conditions
        .map(parish => ({
            id: parish.id,
            name: parish.name,
            parish_rate: parish.parish_rate,
            chapel_rate: parish.chapel_rate,
        }));
    } catch (err) {
        console.error('Error:', err);
        throw err;
    }
}

export const getChapel = async function(target){
    try {
        return (await db.parish_table.toArray())
        // .filter(item => item.client_id.id === target.client_id && item.parish_id.id === target.parish_id &&  item.isParent === true) // Combine conditions
        .filter(item => 
            item.client_id?.id === target.client_id && 
            item.parent_id?.id === target.parish_id &&
            item.isParent === "Yes"
        ) // Combine conditions
        .map(parish => ({
            id: parish.id,
            name: parish.name,
            parish_rate: parish.parish_rate,
            chapel_rate: parish.chapel_rate,
        }));

    } catch (err) {
        console.error('Error:', err);
        throw err;
    }
}

export const getPriest = async function(target){
    try {
        return (await db.priest_table.toArray())
        .filter(item => 
            item.client_id?.id === target.client_id && 
            item.parish_id?.id === target.parish_id
        )
        .map(priest => ({
            id: priest.id,
            name: priest.name,
            priest_rate: priest.priest_rate,
        }));
    } catch (err) {
        console.error('Error:', err);
        throw err;
    }
}

export const CartItem = async function(){
    try {
        const data = await db.payment_table.where('status').equals('New').toArray();
        return data;

    } catch (err) {
        console.error('Error:', err);
        throw err;
    }
}

export const ReceivableItem = async function(target){
    console.log('target',target);
    try {
        const data = await db.payment_table
        .where('rcvbl_key').equals(target)
        .and(item => item.status === "Pending")
        .toArray();
        return data;

    } catch (err) {
        console.error('Error:', err);
        throw err;
    }
}

export const formatCurrency = (value) => {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'PHP' });
};

export const getStatusSeverity = (status) => {
    switch (status) {
        case 'New':
            return 'info';

        case 'Approved':
            return 'primary';

        case 'Denied':
            return 'danger';

        case 'For Payment':
            return 'payment';

        case 'Completed':
            return 'success';
        
        case 'Closed':
            return 'closed';

        case 'Pending':
            return 'help';

        case 'Paid':
            return 'success';

        case 'Cancelled':
            return 'danger';

        default:
            return null;
    }
};

export const getImage = (img) => {
    switch (img) {
        case 'Users':
            return (<img className="xl:w-8rem shadow-0 block xl:block mx-auto p-4 " src={Users} alt={2} />);

        case 'Client':
            return (<img className="xl:w-8rem shadow-0 block xl:block mx-auto p-4 " src={Client} alt={2} />);

        case 'Parish':
            return (<img className="xl:w-8rem shadow-0 block xl:block mx-auto p-4 " src={Parish} alt={2} />);

        case 'Chapel':
            return (<img className="xl:w-8rem shadow-0 block xl:block mx-auto p-4 " src={Chapel} alt={2} />);

        case 'Priest':
            return (<img className="xl:w-8rem shadow-0 block xl:block mx-auto p-4 " src={Priest} alt={2} />);
       
        default:
            return null;
    }
};

export const countries = [
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
