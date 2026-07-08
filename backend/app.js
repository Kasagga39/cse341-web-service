const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const contactsRoutes = require('./routes/contacts');
const professionalRoutes = require('./routes/professional');

const app = express();

app
    .use(bodyParser.json())
    .use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        next();
    })
    .use(express.static(path.join(__dirname, '..', 'frontend')))
    .use('/contacts', contactsRoutes)
    .use('/professional', professionalRoutes)
    .get('/', (req, res) => {
        res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
    });

module.exports = app;