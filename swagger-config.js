module.exports = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'CSE341 Project 2 API',
            version: '1.0.0',
            description: 'API for managing contacts and user profiles with full CRUD operations.',
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
                        _id: { type: 'string', description: 'MongoDB ObjectId', example: '507f1f77bcf86cd799439011' },
                        firstName: { type: 'string', description: 'Contact first name', example: 'John' },
                        lastName: { type: 'string', description: 'Contact last name', example: 'Doe' },
                        email: { type: 'string', format: 'email', description: 'Contact email address', example: 'john.doe@example.com' },
                        favoriteColor: { type: 'string', description: 'Contact favorite color', example: 'Blue' },
                        birthday: { type: 'string', description: 'Contact birthday', example: '1990-01-15' }
                    }
                },
                ContactInput: {
                    type: 'object',
                    required: ['firstName', 'lastName', 'email', 'favoriteColor', 'birthday'],
                    properties: {
                        firstName: { type: 'string', example: 'John' },
                        lastName: { type: 'string', example: 'Doe' },
                        email: { type: 'string', format: 'email', example: 'john.doe@example.com' },
                        favoriteColor: { type: 'string', example: 'Blue' },
                        birthday: { type: 'string', example: '1990-01-15' }
                    }
                },
                Profile: {
                    type: 'object',
                    required: ['name', 'email', 'phone', 'bio', 'skills', 'experience', 'education', 'location'],
                    properties: {
                        _id: { type: 'string', description: 'MongoDB ObjectId', example: '507f1f77bcf86cd799439011' },
                        name: { type: 'string', description: 'Full name', example: 'Jane Smith' },
                        email: { type: 'string', format: 'email', description: 'Email address', example: 'jane.smith@example.com' },
                        phone: { type: 'string', description: 'Phone number', example: '555-123-4567' },
                        bio: { type: 'string', description: 'Short biography', example: 'Software developer with 5 years of experience' },
                        skills: { type: 'array', items: { type: 'string' }, description: 'List of skills', example: ['JavaScript', 'Node.js', 'MongoDB'] },
                        experience: { type: 'string', description: 'Work experience summary', example: '3 years at Acme Corp as a developer' },
                        education: { type: 'string', description: 'Education background', example: 'BS in Computer Science, BYU-Idaho' },
                        location: { type: 'string', description: 'Current location', example: 'Rexburg, ID' },
                        createdAt: { type: 'string', format: 'date-time', description: 'Creation timestamp' }
                    }
                },
                ProfileInput: {
                    type: 'object',
                    required: ['name', 'email', 'phone', 'bio', 'skills', 'experience', 'education', 'location'],
                    properties: {
                        name: { type: 'string', example: 'Jane Smith' },
                        email: { type: 'string', format: 'email', example: 'jane.smith@example.com' },
                        phone: { type: 'string', example: '555-123-4567' },
                        bio: { type: 'string', example: 'Software developer with 5 years of experience' },
                        skills: { type: 'array', items: { type: 'string' }, example: ['JavaScript', 'Node.js', 'MongoDB'] },
                        experience: { type: 'string', example: '3 years at Acme Corp as a developer' },
                        education: { type: 'string', example: 'BS in Computer Science, BYU-Idaho' },
                        location: { type: 'string', example: 'Rexburg, ID' }
                    }
                },
                Error: {
                    type: 'object',
                    properties: {
                        message: { type: 'string' },
                        error: { type: 'string' }
                    }
                },
                ValidationError: {
                    type: 'object',
                    properties: {
                        message: { type: 'string', example: 'Validation failed' },
                        errors: { type: 'array', items: { type: 'string' } }
                    }
                }
            }
        },
        tags: [
            { name: 'Contacts', description: 'Contact management endpoints' },
            { name: 'Profiles', description: 'User profile management endpoints' }
        ]
    },
    apis: []
};
