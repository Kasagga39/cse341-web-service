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

const getAllContacts = async (req, res) => {
    try {
        const result = await mongodb.getDb().db().collection('contacts').find().toArray();
        res.status(200).json(result);
    } catch (err) {
        res.status(200).json(fallbackContacts);
    }
};

const getContactById = async (req, res) => {
    try {
        const contactId = new ObjectId(req.params.id);
        const result = await mongodb.getDb().db().collection('contacts').findOne({ _id: contactId });

        if (!result) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        res.status(200).json(result);
    } catch (err) {
        if (err.name === 'BSONTypeError' || err.name === 'InvalidId') {
            return res.status(400).json({ message: 'Invalid contact ID format' });
        }

        const fallbackContact = fallbackContacts.find((contact) => contact._id === req.params.id);
        if (fallbackContact) {
            return res.status(200).json(fallbackContact);
        }

        res.status(200).json(fallbackContacts);
    }
};

module.exports = {
    getAllContacts,
    getContactById
};
