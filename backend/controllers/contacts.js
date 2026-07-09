const { ObjectId } = require('mongodb');
const mongodb = require('../db/connect');

const fallbackContacts = [
    {
        _id: 'fallback-1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        favoriteColor: 'Blue',
        birthday: '1990-01-15T00:00:00.000Z'
    }
];

const normalizeContact = (contact = {}) => ({
    _id: contact._id,
    firstName: contact.firstName || contact.fastname || contact.first_name || '',
    lastName: contact.lastName || contact.lastname || contact.last_name || '',
    email: contact.email || '',
    favoriteColor: contact.favoriteColor || contact['fav colour'] || contact.fav_color || contact.favoritecolor || '',
    birthday: contact.birthday || contact['date of birth'] || contact.birthdate || ''
});

const getCollection = async () => {
    const db = await mongodb.ensureDb();
    return db.collection('contacts');
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
        const contact = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            favoriteColor: req.body.favoriteColor,
            birthday: req.body.birthday
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
        const contactId = new ObjectId(req.params.id);
        const update = {
            $set: {
                ...(req.body.firstName ? { firstName: req.body.firstName } : {}),
                ...(req.body.lastName ? { lastName: req.body.lastName } : {}),
                ...(req.body.email ? { email: req.body.email } : {}),
                ...(req.body.favoriteColor ? { favoriteColor: req.body.favoriteColor } : {}),
                ...(req.body.birthday ? { birthday: req.body.birthday } : {})
            }
        };

        const collection = await getCollection();
        const result = await collection.findOneAndUpdate(
            { _id: contactId },
            update,
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
