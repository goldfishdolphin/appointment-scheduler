require('dotenv').config();
const express = require('express');
const app = express();
const port = 3000;
const admin = require('firebase-admin');
const Vonage = require('@vonage/server-sdk');
const { v4: uuidv4 } = require('uuid');

const serviceAccount = require('../serviceAccountKey.json');
const getDateTime = (slot) => {
    return slot.split('T');
};

// Initializes firebase
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: `${process.env.FIREBASE_DATABASE_URL}`,
});
//Initialize the Vonage API object
const vonage = new Vonage({
    apiKey: process.env.VONAGE_API_KEY,
    apiSecret: process.env.VONAGE_API_SECRET,
});

// A Reference represents a specific location in your Database and can be 
// used for reading or writing data to that Database location.
ref = admin.database().ref('/myAppointments');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create appointment endpoint
app.post('/appointments', async (request, response) => {
    let phoneNumber = request.body.phonenumber;
    let slot = request.body.slotdate;
    let [date, time] = getDateTime(slot);
    // checks if slot is available
    checkIfAvailable = async (slot) => {
        let snapshot = await ref.orderByChild('date').once('value');
        let available = true;
        snapshot.forEach((data) => {
            // console.log(data);
            let dataval = data.val();
            for (let key in dataval) {
                let datapoint = dataval[key];
                if (slot === datapoint) {
                    available = false;
                }
            }
        });
        console.log(slot);
        return available;
    };
    // Adds to the database
    addToDatabase = () => {
        let code = uuidv4();
        ref.child(code).se({
            date: slot,

            userId: code
        });
        return code;
    };
    // Sends SMS back to the user's phone using the Vonage Message API
    // Sends an SMS back to the user's phone using the Vonage Messages API
    sendSMStoUser = async (code) => {
        const to = phonenumber;
        const text = `Meeting booked at ${time} on date: ${date}. Please save this code: ${code} in case you'd like to cancel your appointment.`;
        const result = await new Promise((resolve, reject) => {
            vonage.messages.send(
                new SMS(text, process.env.VONAGE_TO_NUMBER, "Vonage"),
                (err, data) => {
                    if (err) {
                        console.error(err);
                    } else {
                        console.log(data.message_uuid);
                    }
                }
            );
        });
    };



});
