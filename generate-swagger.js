#!/usr/bin/env node
/**
 * Swagger JSON Generator Script
 * Generates a static swagger.json file from the swagger-config.js
 * Usage: node generate-swagger.js
 */

const fs = require('fs');
const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerConfig = require('./swagger-config');

// Update server URL based on environment
const serverUrl = process.env.RENDER_EXTERNAL_URL || 'http://localhost:3000';
swaggerConfig.definition.servers = [
    {
        url: serverUrl,
        description: process.env.RENDER_EXTERNAL_URL ? 'Production Server' : 'Development Server'
    }
];

// Ensure APIs are scanned from the routes file
swaggerConfig.apis = [
    path.resolve(__dirname, 'backend/routes/contacts.js')
];

try {
    // Generate the swagger spec
    const swaggerSpec = swaggerJsdoc(swaggerConfig);
    
    // Write to swagger.json
    const swaggerJsonPath = path.resolve(__dirname, 'swagger.json');
    fs.writeFileSync(swaggerJsonPath, JSON.stringify(swaggerSpec, null, 2));
    
    console.log(`✓ Swagger JSON generated successfully at ${swaggerJsonPath}`);
    console.log(`✓ API Documentation: http://localhost:3000/api-docs`);
    process.exit(0);
} catch (error) {
    console.error('✗ Error generating Swagger JSON:');
    console.error(error.message);
    process.exit(1);
}
