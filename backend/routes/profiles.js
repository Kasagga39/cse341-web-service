const express = require('express');
const router = express.Router();
const profilesController = require('../controllers/profiles');

/**
 * @openapi
 * /api/profiles:
 *   get:
 *     summary: Retrieve all profiles
 *     description: Fetches a list of all user profiles in the database
 *     tags:
 *       - Profiles
 *     responses:
 *       200:
 *         description: A list of profiles retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Profile'
 *       500:
 *         description: Server error retrieving profiles
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   post:
 *     summary: Create a new profile
 *     description: Creates a new user profile with all required fields. Returns the created profile with its ID.
 *     tags:
 *       - Profiles
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProfileInput'
 *     responses:
 *       201:
 *         description: Profile created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Profile'
 *       400:
 *         description: Validation error - missing or invalid fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       500:
 *         description: Server error creating profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', profilesController.getAllProfiles);
router.post('/', profilesController.createProfile);

/**
 * @openapi
 * /api/profiles/{id}:
 *   get:
 *     summary: Retrieve a profile by ID
 *     description: Fetches a single user profile by its MongoDB _id
 *     tags:
 *       - Profiles
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The MongoDB _id of the profile
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Profile found and returned
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Profile'
 *       400:
 *         description: Invalid profile ID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Profile not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error retrieving profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   put:
 *     summary: Update a profile by ID
 *     description: Updates one or more fields of an existing profile. Only provided fields will be updated.
 *     tags:
 *       - Profiles
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The MongoDB _id of the profile to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               bio:
 *                 type: string
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *               experience:
 *                 type: string
 *               education:
 *                 type: string
 *               location:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Profile'
 *       400:
 *         description: Validation error or invalid ID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Profile not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error updating profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     summary: Delete a profile by ID
 *     description: Permanently removes a profile from the database
 *     tags:
 *       - Profiles
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The MongoDB _id of the profile to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Profile deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Invalid profile ID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Profile not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error deleting profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', profilesController.getProfileById);
router.put('/:id', profilesController.updateProfile);
router.delete('/:id', profilesController.deleteProfile);

module.exports = router;
