require('dotenv').config();

const path = require('path');
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const contactsRoutes = require('./routes/contacts');
const professionalRoutes = require('./routes/professional');
const swaggerConfig = require('../swagger-config');

const app = express();

// Determine the server URL based on environment
const serverUrl = process.env.RENDER_EXTERNAL_URL || 'http://localhost:3000';

// Update swagger config with current server URL
swaggerConfig.definition.servers = [
    {
        url: serverUrl,
        description: process.env.RENDER_EXTERNAL_URL ? 'Production Server' : 'Development Server'
    }
];

// Configure swagger options with the external config file
const swaggerOptions = {
    ...swaggerConfig,
    apis: [path.resolve(__dirname, 'routes/contacts.js')]
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
    .use('/professional', professionalRoutes)
    .use('/api/professional', professionalRoutes)
    .get('/', (req, res) => {
        res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
    });

module.exports = app;