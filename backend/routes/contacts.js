const express = require('express');
const router = express.Router();
const contactsController = require('../controllers/contacts');

/**
 * @openapi
 * /api/contacts:
 *   get:
 *     summary: Retrieve all contacts
 *     description: Fetches a list of all contacts in the database
 *     tags:
 *       - Contacts
 *     responses:
 *       200:
 *         description: A list of contacts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "507f1f77bcf86cd799439011"
 *                   firstName:
 *                     type: string
 *                     example: "John"
 *                   lastName:
 *                     type: string
 *                     example: "Doe"
 *                   email:
 *                     type: string
 *                     format: email
 *                     example: "john.doe@example.com"
 *                   favoriteColor:
 *                     type: string
 *                     example: "Blue"
 *                   birthday:
 *                     type: string
 *                     format: date-time
 *                     example: "1990-01-15T00:00:00.000Z"
 *       500:
 *         description: Server error retrieving contacts
 *   post:
 *     summary: Create a new contact
 *     description: Creates a new contact with all required fields. Returns the created contact with its ID.
 *     tags:
 *       - Contacts
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [firstName, lastName, email, favoriteColor, birthday]
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: "John"
 *               lastName:
 *                 type: string
 *                 example: "Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john.doe@example.com"
 *               favoriteColor:
 *                 type: string
 *                 example: "Blue"
 *               birthday:
 *                 type: string
 *                 format: date-time
 *                 example: "1990-01-15T00:00:00.000Z"
 *     responses:
 *       201:
 *         description: Contact created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "507f1f77bcf86cd799439011"
 *                 firstName:
 *                   type: string
 *                 lastName:
 *                   type: string
 *                 email:
 *                   type: string
 *                 favoriteColor:
 *                   type: string
 *                 birthday:
 *                   type: string
 *       400:
 *         description: Validation error - missing or invalid fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Validation failed"
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *       500:
 *         description: Server error creating contact
 */
router.get('/', contactsController.getAllContacts);
router.post('/', contactsController.createContact);

/**
 * @openapi
 * /api/contacts/{id}:
 *   get:
 *     summary: Retrieve a contact by ID
 *     description: Fetches a single contact by its MongoDB _id
 *     tags:
 *       - Contacts
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The MongoDB _id of the contact
 *         schema:
 *           type: string
 *           example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Contact found and returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 firstName:
 *                   type: string
 *                 lastName:
 *                   type: string
 *                 email:
 *                   type: string
 *                 favoriteColor:
 *                   type: string
 *                 birthday:
 *                   type: string
 *       400:
 *         description: Invalid contact ID format
 *       404:
 *         description: Contact not found
 *       500:
 *         description: Server error retrieving contact
 *   put:
 *     summary: Update a contact by ID
 *     description: Updates one or more fields of an existing contact. Only provided fields will be updated.
 *     tags:
 *       - Contacts
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The MongoDB _id of the contact to update
 *         schema:
 *           type: string
 *           example: "507f1f77bcf86cd799439011"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               favoriteColor:
 *                 type: string
 *               birthday:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Contact updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 firstName:
 *                   type: string
 *                 lastName:
 *                   type: string
 *                 email:
 *                   type: string
 *                 favoriteColor:
 *                   type: string
 *                 birthday:
 *                   type: string
 *       400:
 *         description: Validation error or invalid ID format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *       404:
 *         description: Contact not found
 *       500:
 *         description: Server error updating contact
 *   delete:
 *     summary: Delete a contact by ID
 *     description: Permanently removes a contact from the database
 *     tags:
 *       - Contacts
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The MongoDB _id of the contact to delete
 *         schema:
 *           type: string
 *           example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Contact deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Contact deleted"
 *       400:
 *         description: Invalid contact ID format
 *       404:
 *         description: Contact not found
 *       500:
 *         description: Server error deleting contact
 */
router.get('/:id', contactsController.getContactById);
router.put('/:id', contactsController.updateContact);
router.delete('/:id', contactsController.deleteContact);

module.exports = router;