# CSE341 Web Service

This project is a Node.js/Express API for managing contacts and serving a simple frontend profile page.

## Features
- Connects to MongoDB using the configured connection string
- Supports contact CRUD routes:
  - GET /contacts
  - POST /contacts
  - GET /contacts/:id
  - PUT /contacts/:id
  - DELETE /contacts/:id
- Includes Swagger documentation at /api-docs
- Serves a frontend page from the root route

## Run locally
1. Install dependencies with npm install
2. Start the server with npm start
3. Open http://localhost:3000

## API docs
Open http://localhost:3000/api-docs for interactive Swagger documentation.

## Render deployment
For Render, set the following environment variable:
- PORT: automatically provided by Render
- MONGODB_URL: your MongoDB connection string

Use the start command:
- npm start
