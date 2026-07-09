const mongodb = require('../db/connect');
const fallbackProfile = require('../users');

const getData = async (req, res) => {
    try {
        const collections = ['user', 'users'];
        let profile = null;

        for (const collectionName of collections) {
            const result = await mongodb.getDb().collection(collectionName).findOne({});
            if (result) {
                profile = result;
                break;
            }
        }

        if (!profile) {
            profile = Array.isArray(fallbackProfile) ? fallbackProfile[0] : fallbackProfile;
        }

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(profile);
    } catch (err) {
        const profile = Array.isArray(fallbackProfile) ? fallbackProfile[0] : fallbackProfile;
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(profile);
    }
};

module.exports = { getData };