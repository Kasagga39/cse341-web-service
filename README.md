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

# Swagger API Documentation Setup

## Overview
This project uses **Swagger/OpenAPI 3.0** to document and provide interactive testing for the Contact API.

## Files

### 1. **swagger-config.js**
- Central configuration file for the API specification
- Defines OpenAPI metadata (title, version, description, servers)
- Defines reusable component schemas (Contact, ContactInput, Error)
- Used by both the Swagger UI and the generate-swagger.js script

### 2. **swagger.json**
- Static JSON file containing the complete OpenAPI specification
- Generated from swagger-config.js + route annotations
- Can be used with external tools (e.g., Postman, external Swagger viewers)
- Automatically updated when server restarts

### 3. **backend/routes/contacts.js**
- Contains `@openapi` JSDoc comments for each endpoint
- Documents request/response schemas for Swagger UI
- Includes path definitions, parameters, and examples

### 4. **backend/app.js**
- Imports swagger-config.js
- Sets up Swagger UI at `/api-docs` route
- Dynamically updates server URLs based on environment

### 5. **generate-swagger.js**
- Node.js script to manually generate swagger.json
- Usage: `npm run generate:swagger` or `node generate-swagger.js`

---

## Accessing the Documentation

### Interactive Swagger UI
- **URL**: `http://localhost:3000/api-docs`
- **Features**:
  - View all endpoints
  - Read detailed descriptions and examples
  - Test endpoints directly ("Try it out" button)
  - See request/response schemas

### Static Swagger JSON
- **URL**: `http://localhost:3000/swagger.json` (if served)
- **Usage**: Import into Postman, ReDoc, or other tools

### REST Client Testing
- **File**: `test.rest`
- **Tool**: VS Code REST Client extension
- **Usage**: Run individual or batch requests

---

## Endpoints Documented

### 1. GET /api/contacts
**Description**: Retrieve all contacts  
**Response**: Array of contact objects with all fields

### 2. POST /api/contacts
**Description**: Create a new contact  
**Request**: All 5 fields required (firstName, lastName, email, favoriteColor, birthday)  
**Response**: Created contact with MongoDB _id

### 3. GET /api/contacts/{id}
**Description**: Retrieve a specific contact by ID  
**Parameters**: MongoDB ObjectId  
**Response**: Single contact object

### 4. PUT /api/contacts/{id}
**Description**: Update a contact  
**Parameters**: MongoDB ObjectId  
**Request**: One or more fields to update  
**Response**: Updated contact object

### 5. DELETE /api/contacts/{id}
**Description**: Delete a contact  
**Parameters**: MongoDB ObjectId  
**Response**: Confirmation message

---

## Contact Schema

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "favoriteColor": "Blue",
  "birthday": "1990-01-15T00:00:00.000Z"
}
```

### Required Fields (for POST/PUT):
- `firstName` (string)
- `lastName` (string)
- `email` (string, format: email)
- `favoriteColor` (string)
- `birthday` (string, format: ISO 8601 date-time)

---

## Deployment Notes

### Environment Variables
- `RENDER_EXTERNAL_URL`: Set on Render.com deployment
- Swagger UI automatically uses the correct server URL
- Development: `http://localhost:3000`
- Production: `https://your-app.onrender.com`

### Generating Swagger JSON
```bash
npm run generate:swagger
```

### Starting the Server
```bash
npm start          # Production server
npm run dev        # Development with nodemon
```

---

## Testing Workflow

### Option 1: Swagger UI (Recommended)
1. Start server: `npm start`
2. Open: `http://localhost:3000/api-docs`
3. Click "Try it out" on any endpoint
4. Fill in required parameters/body
5. Click "Execute"
6. View response

### Option 2: REST Client
1. Open `test.rest` in VS Code
2. Install REST Client extension
3. Click "Send Request" above each request
4. View response in side panel

### Option 3: cURL/Postman
```bash
# GET all contacts
curl http://localhost:3000/api/contacts

# POST new contact
curl -X POST http://localhost:3000/api/contacts \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "favoriteColor": "Blue",
    "birthday": "1990-01-15T00:00:00.000Z"
  }'
```

---

## Troubleshooting

### Swagger UI not showing endpoints?
1. Verify `@openapi` comments in routes/contacts.js
2. Check console for swagger-jsdoc errors
3. Restart server and refresh browser

### Can't test endpoints in Swagger UI?
1. Ensure server is running on correct port
2. Check CORS settings in app.js
3. Verify MongoDB connection in console

### swagger.json not generating?
1. Run: `node generate-swagger.js`
2. Check for error messages
3. Verify swagger-config.js syntax

---

## Resources

- **OpenAPI 3.0 Spec**: https://swagger.io/specification/
- **Swagger UI Docs**: https://swagger.io/tools/swagger-ui/
- **swagger-jsdoc Docs**: https://github.com/Surnet/swagger-jsdoc

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
