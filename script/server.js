require('dotenv').config();
const express = require('express');
const app = express();
const port = 3000;
const admin = require('firebase-admin');
const Vonage = require('@vonage/server-sdk');
const { v4: uuidv4 } = require('uuid');

const serviceAccount = require('../serviceAccountKey.json');

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