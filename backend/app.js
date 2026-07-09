require('dotenv').config();

const path = require('path');
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const contactsRoutes = require('./routes/contacts');
const professionalRoutes = require('./routes/professional');

const app = express();

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'CSE341 Contact API',
            version: '1.0.0',
            description: 'API for managing contacts with CRUD operations.'
        },
        servers: [{ url: 'http://localhost:3000' }]
    },
    apis: [path.join(__dirname, 'routes', '*.js')]
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