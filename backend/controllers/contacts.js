const { ObjectId } = require('mongodb');
const mongodb = require('../db/connect');

const normalizeContact = (contact = {}) => ({
    _id: contact._id,
    firstName: contact.firstName || '',
    lastName: contact.lastName || '',
    email: contact.email || '',
    favoriteColor: contact.favoriteColor || '',
    birthday: contact.birthday || ''
});

const getCollection = async () => {
    const db = await mongodb.ensureDb();
    return db.collection('contacts');
};

const validateEmail = (email) => {
    if (!email || typeof email !== 'string') return false;
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.trim());
};

const validateContact = (body, isUpdate = false) => {
    const errors = [];
    if (!isUpdate) {
        if (!body.firstName || typeof body.firstName !== 'string' || !body.firstName.trim()) {
            errors.push('firstName is required and must be a non-empty string');
        }
        if (!body.lastName || typeof body.lastName !== 'string' || !body.lastName.trim()) {
            errors.push('lastName is required and must be a non-empty string');
        }
        if (!body.email || !validateEmail(body.email)) {
            errors.push('A valid email is required');
        }
        if (!body.favoriteColor || typeof body.favoriteColor !== 'string' || !body.favoriteColor.trim()) {
            errors.push('favoriteColor is required and must be a non-empty string');
        }
        if (!body.birthday || typeof body.birthday !== 'string' || !body.birthday.trim()) {
            errors.push('birthday is required and must be a non-empty string');
        }
    } else {
        if (body.firstName !== undefined && (typeof body.firstName !== 'string' || !body.firstName.trim())) {
            errors.push('firstName must be a non-empty string');
        }
        if (body.lastName !== undefined && (typeof body.lastName !== 'string' || !body.lastName.trim())) {
            errors.push('lastName must be a non-empty string');
        }
        if (body.email !== undefined && !validateEmail(body.email)) {
            errors.push('A valid email is required');
        }
        if (body.favoriteColor !== undefined && (typeof body.favoriteColor !== 'string' || !body.favoriteColor.trim())) {
            errors.push('favoriteColor must be a non-empty string');
        }
        if (body.birthday !== undefined && (typeof body.birthday !== 'string' || !body.birthday.trim())) {
            errors.push('birthday must be a non-empty string');
        }
        if (Object.keys(body).length === 0) {
            errors.push('At least one field must be provided for update');
        }
    }
    return errors;
};

const getAllContacts = async (req, res) => {
    try {
        const collection = await getCollection();
        const result = await collection.find().toArray();
        res.status(200).json(result.map(normalizeContact));
    } catch (err) {
        res.status(500).json({ message: 'Unable to fetch contacts', error: err.message });
    }
};

const getContactById = async (req, res) => {
    try {
        const collection = await getCollection();
        const contactId = new ObjectId(req.params.id);
        const result = await collection.findOne({ _id: contactId });

        if (!result) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        res.status(200).json(normalizeContact(result));
    } catch (err) {
        if (err.name === 'BSONTypeError' || err.name === 'InvalidId') {
            return res.status(400).json({ message: 'Invalid contact ID format' });
        }

        res.status(500).json({ message: 'Unable to fetch contact', error: err.message });
    }
};

const createContact = async (req, res) => {
    try {
        const errors = validateContact(req.body);
        if (errors.length > 0) {
            return res.status(400).json({ message: 'Validation failed', errors });
        }

        const contact = {
            firstName: req.body.firstName.trim(),
            lastName: req.body.lastName.trim(),
            email: req.body.email.trim().toLowerCase(),
            favoriteColor: req.body.favoriteColor.trim(),
            birthday: req.body.birthday.trim()
        };

        const collection = await getCollection();
        const result = await collection.insertOne(contact);
        res.status(201).json(normalizeContact({ ...contact, _id: result.insertedId }));
    } catch (err) {
        res.status(500).json({ message: 'Unable to create contact', error: err.message });
    }
};

const updateContact = async (req, res) => {
    try {
        const errors = validateContact(req.body, true);
        if (errors.length > 0) {
            return res.status(400).json({ message: 'Validation failed', errors });
        }

        const contactId = new ObjectId(req.params.id);
        const updateFields = {};
        if (req.body.firstName) updateFields.firstName = req.body.firstName.trim();
        if (req.body.lastName) updateFields.lastName = req.body.lastName.trim();
        if (req.body.email) updateFields.email = req.body.email.trim().toLowerCase();
        if (req.body.favoriteColor) updateFields.favoriteColor = req.body.favoriteColor.trim();
        if (req.body.birthday) updateFields.birthday = req.body.birthday.trim();

        const collection = await getCollection();
        const result = await collection.findOneAndUpdate(
            { _id: contactId },
            { $set: updateFields },
            { returnDocument: 'after' }
        );

        if (!result) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        res.status(200).json(normalizeContact(result));
    } catch (err) {
        if (err.name === 'BSONTypeError' || err.name === 'InvalidId') {
            return res.status(400).json({ message: 'Invalid contact ID format' });
        }
        res.status(500).json({ message: 'Unable to update contact', error: err.message });
    }
};

const deleteContact = async (req, res) => {
    try {
        const collection = await getCollection();
        const contactId = new ObjectId(req.params.id);
        const result = await collection.deleteOne({ _id: contactId });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        res.status(200).json({ message: 'Contact deleted' });
    } catch (err) {
        if (err.name === 'BSONTypeError' || err.name === 'InvalidId') {
            return res.status(400).json({ message: 'Invalid contact ID format' });
        }
        res.status(500).json({ message: 'Unable to delete contact', error: err.message });
    }
};

module.exports = {
    getAllContacts,
    getContactById,
    createContact,
    updateContact,
    deleteContact
};
