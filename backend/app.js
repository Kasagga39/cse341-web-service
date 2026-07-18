require('dotenv').config();

const path = require('path');
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const contactsRoutes = require('./routes/contacts');
const profilesRoutes = require('./routes/profiles');
const professionalRoutes = require('./routes/professional');
const swaggerConfig = require('../swagger-config');

const app = express();

const serverUrl = process.env.RENDER_EXTERNAL_URL || 'http://localhost:3000';

swaggerConfig.definition.servers = [
    {
        url: serverUrl,
        description: process.env.RENDER_EXTERNAL_URL ? 'Production Server' : 'Development Server'
    }
];

const swaggerOptions = {
    ...swaggerConfig,
    apis: [
        path.resolve(__dirname, 'routes/contacts.js'),
        path.resolve(__dirname, 'routes/profiles.js')
    ]
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app
    .use(express.json())
    .use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
        if (req.method === 'OPTIONS') {
            return res.sendStatus(204);
        }
        next();
    })
    .use(express.static(path.join(__dirname, '..', 'frontend')))
    .use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
    .use('/contacts', contactsRoutes)
    .use('/api/contacts', contactsRoutes)
    .use('/api/profiles', profilesRoutes)
    .use('/professional', professionalRoutes)
    .get('/', (req, res) => {
        res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
    })
    .get('/profiles.html', (req, res) => {
        res.sendFile(path.join(__dirname, '..', 'frontend', 'profiles.html'));
    });

module.exports = app;
