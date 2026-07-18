const { ObjectId } = require('mongodb');
const mongodb = require('../db/connect');

const normalizeProfile = (profile = {}) => ({
    _id: profile._id,
    name: profile.name || '',
    email: profile.email || '',
    phone: profile.phone || '',
    bio: profile.bio || '',
    skills: profile.skills || [],
    experience: profile.experience || '',
    education: profile.education || '',
    location: profile.location || '',
    createdAt: profile.createdAt || null
});

const getCollection = async () => {
    const db = await mongodb.ensureDb();
    return db.collection('profiles');
};

const validateEmail = (email) => {
    if (!email || typeof email !== 'string') return false;
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.trim());
};

const validateProfile = (body, isUpdate = false) => {
    const errors = [];
    if (!isUpdate) {
        if (!body.name || typeof body.name !== 'string' || !body.name.trim()) {
            errors.push('name is required and must be a non-empty string');
        }
        if (!body.email || !validateEmail(body.email)) {
            errors.push('A valid email is required');
        }
        if (!body.phone || typeof body.phone !== 'string' || !body.phone.trim()) {
            errors.push('phone is required and must be a non-empty string');
        }
        if (!body.bio || typeof body.bio !== 'string' || !body.bio.trim()) {
            errors.push('bio is required and must be a non-empty string');
        }
        if (!body.skills || !Array.isArray(body.skills) || body.skills.length === 0) {
            errors.push('skills is required and must be a non-empty array');
        }
        if (!body.experience || typeof body.experience !== 'string' || !body.experience.trim()) {
            errors.push('experience is required and must be a non-empty string');
        }
        if (!body.education || typeof body.education !== 'string' || !body.education.trim()) {
            errors.push('education is required and must be a non-empty string');
        }
        if (!body.location || typeof body.location !== 'string' || !body.location.trim()) {
            errors.push('location is required and must be a non-empty string');
        }
    } else {
        if (body.name !== undefined && (typeof body.name !== 'string' || !body.name.trim())) {
            errors.push('name must be a non-empty string');
        }
        if (body.email !== undefined && !validateEmail(body.email)) {
            errors.push('A valid email is required');
        }
        if (body.phone !== undefined && (typeof body.phone !== 'string' || !body.phone.trim())) {
            errors.push('phone must be a non-empty string');
        }
        if (body.bio !== undefined && (typeof body.bio !== 'string' || !body.bio.trim())) {
            errors.push('bio must be a non-empty string');
        }
        if (body.skills !== undefined) {
            if (!Array.isArray(body.skills) || body.skills.length === 0) {
                errors.push('skills must be a non-empty array');
            }
        }
        if (body.experience !== undefined && (typeof body.experience !== 'string' || !body.experience.trim())) {
            errors.push('experience must be a non-empty string');
        }
        if (body.education !== undefined && (typeof body.education !== 'string' || !body.education.trim())) {
            errors.push('education must be a non-empty string');
        }
        if (body.location !== undefined && (typeof body.location !== 'string' || !body.location.trim())) {
            errors.push('location must be a non-empty string');
        }
        if (Object.keys(body).length === 0) {
            errors.push('At least one field must be provided for update');
        }
    }
    return errors;
};

const getAllProfiles = async (req, res) => {
    try {
        const collection = await getCollection();
        const result = await collection.find().toArray();
        res.status(200).json(result.map(normalizeProfile));
    } catch (err) {
        res.status(500).json({ message: 'Unable to fetch profiles', error: err.message });
    }
};

const getProfileById = async (req, res) => {
    try {
        const collection = await getCollection();
        const profileId = new ObjectId(req.params.id);
        const result = await collection.findOne({ _id: profileId });

        if (!result) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        res.status(200).json(normalizeProfile(result));
    } catch (err) {
        if (err.name === 'BSONTypeError' || err.name === 'InvalidId') {
            return res.status(400).json({ message: 'Invalid profile ID format' });
        }
        res.status(500).json({ message: 'Unable to fetch profile', error: err.message });
    }
};

const createProfile = async (req, res) => {
    try {
        const errors = validateProfile(req.body);
        if (errors.length > 0) {
            return res.status(400).json({ message: 'Validation failed', errors });
        }

        const profile = {
            name: req.body.name.trim(),
            email: req.body.email.trim().toLowerCase(),
            phone: req.body.phone.trim(),
            bio: req.body.bio.trim(),
            skills: req.body.skills.map(s => typeof s === 'string' ? s.trim() : s),
            experience: req.body.experience.trim(),
            education: req.body.education.trim(),
            location: req.body.location.trim(),
            createdAt: new Date().toISOString()
        };

        const collection = await getCollection();
        const result = await collection.insertOne(profile);
        res.status(201).json(normalizeProfile({ ...profile, _id: result.insertedId }));
    } catch (err) {
        res.status(500).json({ message: 'Unable to create profile', error: err.message });
    }
};

const updateProfile = async (req, res) => {
    try {
        const errors = validateProfile(req.body, true);
        if (errors.length > 0) {
            return res.status(400).json({ message: 'Validation failed', errors });
        }

        const profileId = new ObjectId(req.params.id);
        const updateFields = {};
        if (req.body.name) updateFields.name = req.body.name.trim();
        if (req.body.email) updateFields.email = req.body.email.trim().toLowerCase();
        if (req.body.phone) updateFields.phone = req.body.phone.trim();
        if (req.body.bio) updateFields.bio = req.body.bio.trim();
        if (req.body.skills) updateFields.skills = req.body.skills.map(s => typeof s === 'string' ? s.trim() : s);
        if (req.body.experience) updateFields.experience = req.body.experience.trim();
        if (req.body.education) updateFields.education = req.body.education.trim();
        if (req.body.location) updateFields.location = req.body.location.trim();

        const collection = await getCollection();
        const result = await collection.findOneAndUpdate(
            { _id: profileId },
            { $set: updateFields },
            { returnDocument: 'after' }
        );

        if (!result) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        res.status(200).json(normalizeProfile(result));
    } catch (err) {
        if (err.name === 'BSONTypeError' || err.name === 'InvalidId') {
            return res.status(400).json({ message: 'Invalid profile ID format' });
        }
        res.status(500).json({ message: 'Unable to update profile', error: err.message });
    }
};

const deleteProfile = async (req, res) => {
    try {
        const collection = await getCollection();
        const profileId = new ObjectId(req.params.id);
        const result = await collection.deleteOne({ _id: profileId });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        res.status(200).json({ message: 'Profile deleted' });
    } catch (err) {
        if (err.name === 'BSONTypeError' || err.name === 'InvalidId') {
            return res.status(400).json({ message: 'Invalid profile ID format' });
        }
        res.status(500).json({ message: 'Unable to delete profile', error: err.message });
    }
};

module.exports = {
    getAllProfiles,
    getProfileById,
    createProfile,
    updateProfile,
    deleteProfile
};
