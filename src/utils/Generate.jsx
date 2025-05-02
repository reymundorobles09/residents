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
});

function getRandomName() {
    const randomNames = [
        "Ethan", "Oliver", "Benjamin", "Lucas", "Henry",
        "Alexander", "Samuel", "Daniel", "Matthew", "Nathan",
        "Christopher", "Ryan", "Jack", "Dylan", "Caleb",
        "Olivia", "Emma", "Charlotte", "Amelia", "Sophia",
        "Ava", "Isabella", "Mia", "Harper", "Evelyn",
        "Abigail", "Emily", "Scarlett", "Lily", "Zoe"
    ];

    return randomNames[Math.floor(Math.random() * randomNames.length)];
}

function getRandomRate() {
    const randomRates = [5000,6000,7000,8000];
    return randomRates[Math.floor(Math.random() * randomRates.length)];
}

function getRandomFee() {
    const randomFees = [2000,3000,4000,5000];
    return randomFees[Math.floor(Math.random() * randomFees.length)];
}

function getRandomSurname() {
    const randomSurnames = [
        "Smith", "Johnson", "Williams", "Brown", "Jones",
        "Miller", "Davis", "Garcia", "Rodriguez", "Wilson",
        "Martinez", "Anderson", "Taylor", "Thomas", "Hernandez",
        "Moore", "Martin", "Jackson", "Thompson", "White",
        "Lopez", "Lee", "Gonzalez", "Harris", "Clark",
        "Lewis", "Robinson", "Walker", "Perez", "Hall"
    ];

    return randomSurnames[Math.floor(Math.random() * randomSurnames.length)];
}

function getRandomMobileNumber() {
    const mobileNumbers = [
        '09171234567', '09161234568', '09151234569', '09181234560', '09191234561',
        '09271234562', '09261234563', '09251234564', '09281234565', '09291234566',
        '09301234567', '09311234568', '09321234569', '09351234560', '09361234561',
        '09451234562', '09461234563', '09471234564', '09501234565', '09511234566',
        '09651234567', '09661234568', '09671234569', '09751234560', '09761234561',
        '09771234562', '09891234563', '09951234564', '09991234565', '09971234566'
      ];

    return mobileNumbers[Math.floor(Math.random() * mobileNumbers.length)];
}

function getRandomCity() {
    const cities = [
        { city: "Manila", abbr: "MNL" },
        { city: "Quezon City", abbr: "QC" },
        { city: "Cebu City", abbr: "CEB" },
        { city: "Davao City", abbr: "DVO" },
        { city: "Makati", abbr: "MKT" },
        { city: "Baguio", abbr: "BAG" },
        { city: "Iloilo City", abbr: "ILO" },
        { city: "Taguig", abbr: "TAG" },
        { city: "Pasig", abbr: "PSG" },
        { city: "Caloocan", abbr: "CAL" },
        { city: "Bacolod", abbr: "BCD" },
        { city: "Antipolo", abbr: "ANT" },
        { city: "Zamboanga City", abbr: "ZAM" },
        { city: "Cagayan de Oro", abbr: "CGY" },
        { city: "Las Piñas", abbr: "LPI" },
        { city: "Mandaluyong", abbr: "MND" },
        { city: "Marikina", abbr: "MRK" },
        { city: "Muntinlupa", abbr: "MNT" },
        { city: "Parañaque", abbr: "PAR" },
        { city: "Valenzuela", abbr: "VAL" },
        { city: "Batangas City", abbr: "BTG" },
        { city: "Santa Rosa", abbr: "SRO" },
        { city: "Biñan", abbr: "BNN" },
        { city: "General Santos", abbr: "GES" },
        { city: "San Fernando (Pampanga)", abbr: "SFP" },
        { city: "Puerto Princesa", abbr: "PPS" },
        { city: "Angeles", abbr: "ANG" },
        { city: "Bacoor", abbr: "BAC" },
        { city: "Naga", abbr: "NGA" },
        { city: "Lapu-Lapu", abbr: "LLC" }
      ];

    return cities[Math.floor(Math.random() * cities.length)];
}

function getRandomParish() {
    const parishNames = [
        "San Pedro Bautista Parish", 
        "Our Lady of EDSA Shrine",
        "Santo Niño de Tondo Parish",
        "San Isidro Labrador Parish",
        "Immaculate Conception Cathedral",
        "San Sebastian Basilica",
        "Our Lady of Peñafrancia Parish",
        "San Agustin Church",
        "Christ the King Parish",
        "Our Lady of Lourdes Parish",
        "San Miguel Archangel Parish",
        "Sacred Heart of Jesus Parish",
        "Our Lady of Fatima Parish",
        "St. Joseph the Worker Parish",
        "San Juan Bautista Parish",
        "Our Lady of the Abandoned Parish",
        "St. Jude Thaddeus Parish",
        "San Roque Cathedral",
        "Divine Mercy Shrine",
        "Our Lady of Perpetual Help Parish",
        "St. Francis of Assisi Parish",
        "San Pablo Apostol Parish",
        "Our Lady of Mount Carmel Parish",
        "St. Anthony of Padua Parish",
        "San Lorenzo Ruiz Parish",
        "Holy Family Parish",
        "Our Lady of Guadalupe Parish",
        "St. Therese of the Child Jesus Parish",
        "San Vicente Ferrer Parish",
        "Mary Help of Christians Parish"
      ];

    return parishNames[Math.floor(Math.random() * parishNames.length)];
}

function getRandomChapel() {
    const chapelNames = [
        "Ermita Chapel",
        "Betis Chapel",
        "Chapel of the Holy Sacrifice",
        "St. Joseph the Worker Chapel",
        "St. Clare Monastery Chapel",
        "Chapel of San Miguel",
        "Mary Immaculate Chapel",
        "Our Lady of Montserrat Chapel",
        "St. Alphonsus Mary de Liguori Chapel",
        "Sto. Niño de Paz Chapel",
        "Chapel of the Pink Sisters",
        "Our Lady of Sorrows Chapel",
        "Chapel on the Hill",
        "Carmelite Monastery Chapel",
        "Our Lady of Lourdes Chapel",
        "St. Therese Chapel",
        "Divine Mercy Chapel",
        "Chapel of the Resurrection",
        "San Pedro Calungsod Chapel",
        "Our Lady of the Miraculous Medal Chapel",
        "St. Francis Chapel",
        "Chapel of the Blessed Sacrament",
        "Our Lady of the Abandoned Chapel",
        "St. Joseph Chapel",
        "Chapel of the Holy Cross",
        "Our Lady of Fatima Chapel",
        "St. Jude Chapel",
        "Chapel of the Transfiguration",
        "San Isidro Labrador Chapel",
        "Our Lady of Peace Chapel)"
      ];

    return chapelNames[Math.floor(Math.random() * chapelNames.length)];
}

const GenerateClient = async function(){
   
    try {
        const random = getRandomCity();
        const client = {
            code: random.abbr,
            name: random.city,
            description: 'Generated ' + random.city,
            contact_no: getRandomMobileNumber(),
            status: 'Active',
            created_by: 'Admin',
            created_at: moment().format("MMMM D YYYY, h:mm:ss a")
        };

        await db.client_table.add(client);

    } catch (err) {
        console.error('Error:', err);
    }

}

const GenerateParish = async function() {
   
    try {

        const parish = await db.client_table.toArray();
        const parishes = [];
        parish.forEach((element, index) => {
            parishes[index] = { 
                "client_id": { id: element.id, name: element.name },
                "contact_no": element.contact_no,
                "created_at": moment().format("MMMM D YYYY, h:mm:ss a"),
                "created_by": "Superadmin",
                "isParent": "No",
                "name": getRandomParish(),
                "address": "Generated address",
                "chapel_rate": 0,
                "parish_rate": getRandomRate(),
                "remarks": "Generated remarks",
                "status": "Active"
            }
        });
        
        await db.parish_table.bulkAdd(parishes);

    } catch (error) {
        
    }
}

const GenerateUser = async function() {
   
    try {
        const users = (await db.parish_table.toArray()).filter(item => item.isParent === "No");
    
        const user = [];
        users.forEach((element,index) => {
            const first_name = getRandomName();
            const city = getRandomCity().city;
            user[index] = {
                    "address_line_1": city,
                    "address_line_2": "",
                    "birthday": new Date(),
                    "city": city,
                    'client_id': element.client_id,
                    // 'parish_id': element.parent_id,
                    'parish_id': {id: element.id, name: element.name, parish_rate: element.parish_rate, chapel_rate: element.chapel_rate},
                    "civil_status": "Single",
                    "contact_no": getRandomMobileNumber(),
                    "country": { name: 'Philippines' },
                    "created_at": moment().format("MMMM D YYYY, h:mm:ss a"),
                    "created_by": "Superadmin",
                    "email": first_name+"@gmail.com",
                    "first_name": first_name,
                    "gender": "Male",
                    "is_verified": "No",
                    "last_name": getRandomSurname(),
                    "middle_name": "D",
                    "remarks": "This Data is generated",
                    "role": "Support",
                    "status": "unverifed",
                    "suffix": "",
                    "username": first_name,
                    "password": btoa(first_name)
                }
            
        });

        await db.user_table.bulkAdd(user);

    } catch (error) {
        
    }
}

const GenerateChapel = async function() {
   
    try {

       

        const chapel = (await db.parish_table.toArray())
                .filter(item => item.isParent === "No");
      
        const chapels = [];
        chapel.forEach((element,index) => {
            chapels[index] = {
                'client_id': element.client_id,
                'contact_no': element.contact_no,
                'created_at': moment().format("MMMM D YYYY, h:mm:ss a"),
                'created_by': "Superadmin",
                'isParent': "Yes",
                'parent_id': { id: element.id, name: element.name, parish_rate: element.parish_rate, chapel_rate: element.chapel_rate },
                'parish_rate': element.parish_rate,
                'parent': element.name,
                'name': getRandomChapel(),
                'address': element.name,
                'chapel_rate': getRandomRate(),
                'remarks': element.name+" Generated Record",
                'status': "Active"
            }
            
        });

        await db.parish_table.bulkAdd(chapels);

    } catch (error) {
        
    }
}

const GeneratePriest = async function() {
   
    try {
        const priest =  (await db.parish_table.toArray()).filter(item => item.isParent === "Yes") // Combine conditions
        const priests = [];
        priest.forEach((element,index) => {
            priests[index] = {
                'chapel_id': {id: element.id, name: element.name, parish_rate: element.parish_rate, chapel_rate: element.chapel_rate},
                'client_id': element.client_id,
                'parish_id': element.parent_id,
                'created_at': moment().format("MMMM D YYYY, h:mm:ss a"),
                'created_by': "Superadmin",
                'description': "Priest in "+element.name,
                'name': "Fr. "+ getRandomName() +" "+getRandomSurname(),
                'priest_rate': getRandomFee(),
                'status': "Active",
            }
            
        });
        await db.priest_table.bulkAdd(priests);

    } catch (error) {
        
    }
}

const GenerateBaptismal = async function() {
   
    try {
        const baptism = await db.priest_table.toArray();
        const baptismal = [];
       
        baptism.forEach((element,index) => {
            baptismal[index] = {
                "address": "This address is generated",
                "childs": [],
                "client_id": element.client_id,
                "contact": getRandomMobileNumber(),
                "control_id": 'BAP-'+Math.random().toString(36).substring(2,6).toUpperCase()+'-'+moment().format("YYYY-MM-DD"),
                'created_at': moment().format("MMMM D YYYY, h:mm:ss a"),
                'created_by': "Superadmin",
                "date_end": new Date(),
                "date_start": new Date(),
                "end": moment().add(1, 'hours').format('YYYY-DD-MM LT'),
                "father_firstname": getRandomName(),
                "father_middlename": "D",
                "father_lastname": getRandomSurname(),
                "no_of_guest": Math.floor(Math.random() * 30),
                "mother_firstname": getRandomName(),
                "mother_middlename": "D",
                "mother_lastname": getRandomSurname(),
                "parents": [],
                "parish_id": element.parish_id,
                "parish_rate": element.parish_id.parish_rate,
                "priest_id": { id: element.id, name : element.name, priest_rate: element.priest_rate},
                "priest_rate": element.priest_rate,
                "remarks": "This remarks is generated.",
                "status": "New",
                "start": moment().format('YYYY-DD-MM LT'),
                "time_start": new Date(),
                "time_end": new Date(),
            }
            
        });

        if(baptismal.length){
            const manage_baptism = [];
            baptismal.forEach((element,indx) => {
                manage_baptism[indx] = {
                    client_id: element.client_id,
                    parish_id: element.parish_id,
                    priest_id: element.priest_id,
                    uniq_key: 'MNG-'+Math.random().toString(36).substring(2,6).toUpperCase()+'-'+moment().format("YYYY-MM-DD"),
                    ref_key: element.control_id,
                    date_start: element.date_start,
                    time_start: element.time_start,
                    date_end: element.date_end,
                    time_end: element.time_end,
                    status: 'New',
                    payment_status: 'New',
                    created_by: 'R.Robl50',
                    created_at: moment().format("MMMM D YYYY, h:mm:ss a"),
                };
            });

            await db.manage_baptism_table.bulkAdd(manage_baptism);

        }
       

       
       await db.baptism_table.bulkAdd(baptismal);

    } catch (error) {
        
    }
}

export const categories = [
    { name: 'Client', action: "GenerateClient", key: 'cli', sort: 1 },
    { name: 'Parish', action: "GenerateParish", key: 'par', sort: 2 },
    { name: 'Chapel', action: "GenerateChapel", key: 'cha', sort: 3 },
    { name: 'Priest', action: "GeneratePriest", key: 'pri', sort: 4 },
    { name: 'Baptism', action: "GenerateBaptismal", key: 'bap', sort: 5 },
    { name: 'User', action: "GenerateUser", key: 'use', sort: 6 },
];

export const GenerateRecord = (e) => {
    e.preventDefault();
    console.log('qwe',e.currentTarget.value);
    switch (e.currentTarget.value) {
        case "GenerateClient":
            GenerateClient();
            break;
        case "GenerateParish":
            GenerateParish();
            break;
        case "GenerateChapel":
            GenerateChapel();
            break;
        case "GeneratePriest":
            GeneratePriest();
            break;
        case "GenerateBaptismal":
            GenerateBaptismal();
            break;
        case "GenerateUser":
            GenerateUser();
            break;
        default:
            break;
    }
}