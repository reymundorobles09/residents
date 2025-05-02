import Dexie from 'dexie';
import { user_table, client_table, parish_table, priest_table, baptism_table, wfb_table, manage_baptism_table, payment_table, receivable_table, collection_table } from "./Fields";
import moment from 'moment-timezone';

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

// Store Users
export const storeData = async function(table_name,fields,setVisible,disabled,loadData){
   
    try {
       
        switch (table_name) {
            case "user_table":
                console.log('user_table');
                const user = await db.user_table.toArray();
                fields.username = fields.first_name.charAt(0).toUpperCase()+'.'+fields.last_name.charAt(0).toUpperCase() + fields.last_name.slice(1).substr(0, 3)+(user.length+1);
                fields.is_verified = 'No';
                fields.password= btoa(fields.username);
                break;

            case "client_table":
                
                break;

            case "parish_table":
                console.log('parish_table');
                fields.isParent = fields.isParent ? "Yes" : "No";
                break;

            case "baptism_table":
                console.log('baptism_table');
                fields.control_id = 'BAP-'+Math.random().toString(36).substring(2,6).toUpperCase()+'-'+moment().format("YYYY-MM-DD")
                fields.status = 'New';
                fields.payment_status = 'Pending';

                const manage_baptism = {
                    client_id: fields.client_id,
                    parish_id: fields.parish_id,
                    priest_id: fields.priest_id,
                    uniq_key: 'MNG-'+Math.random().toString(36).substring(2,6).toUpperCase()+'-'+moment().format("YYYY-MM-DD"),
                    ref_key: fields.control_id,
                    date_start: fields.date_start,
                    time_start: fields.time_start,
                    date_end: fields.date_end,
                    time_end: fields.time_end,
                    status: 'New',
                    payment_status: 'New',
                    created_by: 'R.Robl50',
                    created_at: moment().format("MMMM D YYYY, h:mm:ss a"),
                };

                await db.manage_baptism_table.add(manage_baptism);
                break;

            case "wfb_table":
                console.log('wfb_table');
                fields.control_id = 'WFB-'+Math.random().toString(36).substring(2,6).toUpperCase()+'-'+moment().format("YYYY-MM-DD");
                fields.status = 'New';

                const manage_wfb = {
                    client_id: fields.client_id,
                    parish_id: fields.parish_id,
                    priest_id: fields.priest_id,
                    uniq_key: 'MNG-'+Math.random().toString(36).substring(2,6).toUpperCase()+'-'+moment().format("YYYY-MM-DD"),
                    ref_key: fields.control_id,
                    date_start: fields.date_start,
                    time_start: fields.time_start,
                    date_end: fields.date_end,
                    time_end: fields.time_end,
                    status: 'New',
                    payment_status: 'New',
                    created_by: 'R.Robl50',
                    created_at: moment().format("MMMM D YYYY, h:mm:ss a"),
                };

                await db.manage_wfb_table.add(manage_wfb);
                break;

                break;
        
            default:
                break;
        }

        fields.status = 'Active';
        fields.created_by = 'R.Robl50';
        fields.created_at = moment().format("MMMM D YYYY, h:mm:ss a");

        await db[table_name].add(fields);
        
        return (
            setVisible(false),
            disabled(true),
            loadData(), 
            swal({
                title: "Success!",
                text: 'Data Successfully added.',
                icon: "success",
            })
            
        );
    } catch (err) {
        console.error('Error:', err);
    }
}

export const updateData = async function(id,table_name,fields,setVisible,disabled,loadData,setInvalid){
  
    setVisible(true);
    try {

        switch (table_name) {
            case "parish_table":
                fields.isParent = fields.isParent ? "Yes" : "No";
                break;
        
            default:
                break;
        }

        await db[table_name].update(parseInt(id), fields);
        const auth = JSON.parse(localStorage.getItem('Auth'));

        if(parseInt(id) === auth.id && table_name === "user_table"){
            const users_update = await db.user_table.where('id').equals(parseInt(id)).first();
            localStorage.setItem('Auth', JSON.stringify(users_update));
        }
        
        return (
            setVisible(false),
            disabled(true),
            loadData(), 
            swal({
                title: "Success!",
                text: 'Data Successfully updated.',
                icon: "success",
            })
        );

    } catch (err) {
        console.error('Error:', err);
    }
}

export const saveData = async function(fields,table_name,status,loadData,setDisabled,setPaymentVisible){
    try {
        const countData = await db[table_name].toArray();
        const baptism = await db.baptism_table.filter((item) => item.control_id === fields.ref_key).first();
        
        
        switch (status) {
            case "Approved":
                    fields.payment_status = status; 
                    baptism.status = "Pending";
                    fields.status = "Pending"; 
                    await db.baptism_table.update(baptism.id, baptism);  
                break;
            case "Denied":
                    fields.payment_status = status; 
                    baptism.status = "Cancelled";
                    fields.status = "Cancelled"; 
                    await db.baptism_table.update(baptism.id, baptism);  
                break;

            case "For Payment":
                  
                    const for_payment = {
                        client_id: fields.client_id,
                        parish_id: fields.parish_id,
                        uniq_key: 'PAY-'+Math.random().toString(36).substring(2,6).toUpperCase()+'-'+moment().format("YYYY-MM-DD"),
                        mng_baptism_key: fields.uniq_key, 
                        baptism_key: fields.ref_key, 
                        total_amount: fields.parish_id.parish_rate + fields.priest_id.priest_rate,
                        module: "Baptism",
                        status: 'New',
                        created_by: 'R.Robl50',
                        created_at: moment().format("MMMM D YYYY, h:mm:ss a"),
                    }

                    await db.payment_table.add(for_payment);
                    fields.payment_status = status; 
                    await db.baptism_table.update(baptism.id, baptism);  
                break;

            case "For Donation":
               
                break;
        
            default:
                break;
        }

        await db[table_name].update(fields.id, fields);

        return (
            setDisabled({
                approved: status == 'New' ? false : true,
                denied: status == 'New' ? false : true,
                payment: status == 'Approved' ? false : true,
                donation: true,
            }),
            setPaymentVisible(false), 
            loadData(), 
            swal({
                title: "Success!",
                text: 'Data Successfully updated.',
                icon: "success",
            })
        );

    } catch (err) {
        console.error('Error:', err);
    }
}

export const submitCart = async(addedItems,paymentTotal,loadCart,setPendingPaymentVisible) => {
    
    try {
        if(addedItems.length){
            
            const data = await db.payment_table.where('id').anyOf(addedItems).first();
           
            const key = 'RCVBL-'+Math.random().toString(36).substring(2,6).toUpperCase()+'-'+moment().format("YYYY-MM-DD");
           
            const rcvbl = {
                client_id : data.client_id,
                parish_id : data.parish_id,
                uniq_key : key,
                total_amount: paymentTotal,
                remarks: '',
                status: "New",
                created_at: moment().format("MMMM D YYYY, h:mm:ss a"),
            };
            
            await db.receivable_table.add(rcvbl);

            await db.payment_table.where('id').anyOf(addedItems).modify({ 
                status: "Pending", 
                rcvbl_key: key
            });

            return (
                loadCart(), 
                setPendingPaymentVisible(false),
                swal({
                    title: "Success!",
                    message: "test",
                    text: "Item'(s) Successfully added \n. You are now redirected to the next process.",
                    icon: "success",
                })
            );
        }else{
            return (
                swal({
                    title: "Opps!",
                    text: 'There is no added item to the cart.',
                    icon: "warning",
                })
            );
        }
    } catch (error) {
        console.error(error);
    }
}

export const submitReceivable = async(table_name,fields,selected,addedItems,setDisabled,loadData) => {
    
    try {

        const key = 'COL-'+Math.random().toString(36).substring(2,6).toUpperCase()+'-'+moment().format("YYYY-MM-DD");

        await db.receivable_table.where('uniq_key').equals(fields.ref_key).modify({ 
            status: "Paid",
            remarks: fields.remarks, 
            total_amount: fields.total_amount,
            collection_key: key,
        });

        const collection = {
            title: fields.title,
            client_id : selected.client_id,
            parish_id : selected.parish_id,
            uniq_key : key,
            ref_key : fields.ref_key,
            paid_by_whom: fields.paid_by_whom,
            payment_mode: fields.mop,
            bank_name: fields.mop === "Bank" ? fields.bank_name : null,
            card_number: fields.mop === "Bank" ? fields.card_number : null,
            amount: fields.mop === "Bank" ? 0 : fields.amount, 
            total_amount: fields.total_amount,
            remarks: fields.remarks,
            status: "Paid",
            created_at: moment().format("MMMM D YYYY, h:mm:ss a"),
        };
        
        await db.collection_table.add(collection);

       

        const payment_table = await db.payment_table.where('rcvbl_key').equals(fields.ref_key).toArray();
        
        for( let i = 0; i < payment_table.length ; i++){
            if(addedItems.includes(payment_table[i].uniq_key))
            {
                await db.payment_table.where('uniq_key').equals(payment_table[i].uniq_key)
                .modify({
                    status: "Cancelled",
                });

                await db.manage_baptism_table.where('uniq_key').equals(payment_table[i].mng_baptism_key)
                .modify({
                    status: "Closed",
                    payment_status: "Cancelled" 
                });

                await db.baptism_table.where('control_id').equals(payment_table[i].baptism_key)
                .modify({
                    status: "Closed",
                });
            }
            else{
                await db.payment_table.where('uniq_key').equals(payment_table[i].uniq_key)
                .modify({
                    status: "Paid",
                });

                await db.manage_baptism_table.where('uniq_key').equals(payment_table[i].mng_baptism_key)
                .modify({
                    status: "Completed",
                    payment_status: "Paid"
                });

                await db.baptism_table.where('control_id').equals(payment_table[i].baptism_key)
                .modify({
                    status: "Completed",
                });
            }
        }
        
        return (
            loadData(),
            setDisabled(false),
            swal({
                title: "Success!",
                text: 'Data Successfully added.',
                icon: "success",
            })
            
        );

    } catch (error) {
        console.error(error);
    }
}

export const deleteData = async function(table_name,id,disabled,loadData){
    try {
        
        switch (table_name) {
            case 'baptism_table':
                const target = await db[table_name].filter((item) => item.id === id).toArray();
                break;
            case 'wfb_table':
                
                break;
            default:
                break;
        }
         await db[table_name].delete(id);
        return (
            disabled(true),
            loadData(),
            swal({
                title: "Success!",
                text: 'Data Successfully updated.',
                icon: "success",
            })
        ); 
    } catch (err) {
        console.error('Error:', err);
    }
}

export const updateFileData = async function(table_name,fields,loadData){
    try {
        await db[table_name].update(fields.id, fields);
        return (
            loadData() 
        );

    } catch (err) {
        console.error('Error:', err);
    }
}

export const LoginData = async function(fields){
    try {
   
        const data = await db.user_table.where({ username: fields.username, password: btoa(fields.password)}).first();
        return {
            'data' : data,
            'token' : data ? localStorage.setItem('ACCESS_TOKEN',Math.random().toString(36).substring(2,36)) : null,
            'message' : data ? "Successfull" : "Failed",
            'success' : data ? 1 : 0,
        };
      
    } catch (err) {
        console.error('Error:', err);
        throw err;
    }
}

export const RegisterData = async function(value){
    try {
          
        const field = {
            "address_line_1": "",
            "address_line_2": "",
            "birthday": "",
            "city": "",
            "client_id": [],
            "parish_id": [],
            "civil_status": "",
            "contact_no": "",
            "country": "",
            "created_at": moment().format("MMMM D YYYY, h:mm:ss a"),
            "created_by": "",
            "email": "",
            "first_name": "",
            "fullname": "",
            "gender": "",
            "is_verified": "No",
            "last_name": "",
            "middle_name": "",
            "others": "",
            "remarks": "",
            "role": "Support",
            "status": "unverifed",
            "suffix": "",
            "username": value.username,
            "password": btoa(value.password)
        }
       
        await db.user_table.add(field);

        localStorage.setItem('ACCESS_TOKEN',Math.random().toString(36).substring(2,36))

        return {
            'data' : field,
            'message' : "Welcome",
            'success' : 1,
        };
      
    } catch (err) {
        console.error('Error:', err);
        throw err;
    }
}
