import Dexie from 'dexie';
import { user_table, client_table, parish_table, priest_table, baptism_table, wfb_table, manage_baptism_table, payment_table, receivable_table, collection_table } from "./Fields";
import { useState } from 'react';

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
});

export const dataCount = async function(value) {

    try {
        
        const user = await db.user_table.toArray();
        const client = await db.client_table.toArray();
        const parish =  (await db.parish_table.toArray()).filter(item => item.isParent === "No")
        const priest = await db.priest_table.toArray();

        const baptism = await db.baptism_table.toArray();
        const wfb = await db.wfb_table.toArray();

        return {
            'count' : [
                { label: "Users", value: user.length },
                { label: "Client", value: client.length },
                { label: "Parish", value: parish.length },
                { label: "Priest", value: priest.length },
            ],
            'baptism' : [
                {   label: ['New', 'Pending', 'Cancelled', 'Completed'],
                    backgroundColor: ['#0ea5e9', '#a855f7', '#ef4444', '#22c55e', '#64748b'],
                value: [
                    baptism.filter(item => item.status === "New").length,
                    baptism.filter(item => item.status === "Pending").length,
                    baptism.filter(item => item.status === "Cancelled").length,
                    baptism.filter(item => item.status === "Completed").length,
                    baptism.filter(item => item.status === "Closed").length,
                ]  },
            ],

            'wfb' : [
                {   label: ['New', 'Ongoing', 'Cancelled', 'Completed'],
                    backgroundColor: ['#0ea5e9', '#a855f7', '#ef4444', '#22c55e', '#64748b'],
                value: [
                    wfb.filter(item => item.status === "New").length,
                    wfb.filter(item => item.status === "Ongoing").length,
                    wfb.filter(item => item.status === "Cancelled").length,
                    wfb.filter(item => item.status === "Completed").length,
                    wfb.filter(item => item.status === "Closed").length,
                ]  },
            ],
        };

    } catch (error) {
        console.error(error);
    }
}