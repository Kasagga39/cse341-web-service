/**
 * Swagger Configuration for CSE341 Contacts API
 * This file contains the OpenAPI/Swagger specification for the API
 */

module.exports = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'CSE341 Contact API',
            version: '1.0.0',
            description: 'Professional API for managing contacts with full CRUD operations. Store and retrieve contact information including firstName, lastName, email, favoriteColor, and birthday.',
            contact: {
                name: 'CSE341 Course',
                url: 'https://www.byupattheway.org'
            },
            license: {
                name: 'ISC'
            }
        },
        servers: [
            {
                url: process.env.RENDER_EXTERNAL_URL || 'http://localhost:3000',
                description: process.env.RENDER_EXTERNAL_URL ? 'Production Server' : 'Development Server'
            }
        ],
        components: {
            schemas: {
                Contact: {
                    type: 'object',
                    required: ['firstName', 'lastName', 'email', 'favoriteColor', 'birthday'],
                    properties: {
                        _id: {
                            type: 'string',
                            description: 'MongoDB ObjectId',
                            example: '507f1f77bcf86cd799439011'
                        },
                        firstName: {
                            type: 'string',
                            description: 'Contact first name',
                            example: 'John'
                        },
                        lastName: {
                            type: 'string',
                            description: 'Contact last name',
                            example: 'Doe'
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            description: 'Contact email address',
                            example: 'john.doe@example.com'
                        },
                        favoriteColor: {
                            type: 'string',
                            description: 'Contact favorite color',
                            example: 'Blue'
                        },
                        birthday: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Contact birthday in ISO 8601 format',
                            example: '1990-01-15T00:00:00.000Z'
                        }
                    }
                },
                ContactInput: {
                    type: 'object',
                    required: ['firstName', 'lastName', 'email', 'favoriteColor', 'birthday'],
                    properties: {
                        firstName: {
                            type: 'string',
                            example: 'John'
                        },
                        lastName: {
                            type: 'string',
                            example: 'Doe'
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            example: 'john.doe@example.com'
                        },
                        favoriteColor: {
                            type: 'string',
                            example: 'Blue'
                        },
                        birthday: {
                            type: 'string',
                            format: 'date-time',
                            example: '1990-01-15T00:00:00.000Z'
                        }
                    }
                },
                Error: {
                    type: 'object',
                    properties: {
                        message: {
                            type: 'string'
                        },
                        error: {
                            type: 'string'
                        }
                    }
                }
            }
        }
    },
    apis: []
};
