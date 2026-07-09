const dotenv = require('dotenv');
dotenv.config();
const { MongoClient } = require('mongodb');
const dns = require('dns');
let _db;

const initDb = (callback) => {
    if (_db) {
        return callback(null, _db);
    }

    const mongoUri = process.env.MONGODB_URI || process.env.MONGODB_URL;
    const dbName = process.env.MONGODB_DB || 'project1';

    if (!mongoUri) {
        return callback(new Error('MongoDB connection string is not defined in environment variables'));
    }

    const client = new MongoClient(mongoUri, {
        serverSelectionTimeoutMS: 10000,
    });

    client.connect()
        .then(() => {
            _db = client.db(dbName);
            callback(null, _db);
        })
        .catch((err) => {
            callback(err);
        });
};

const getDb = () => {
    if (!_db) {
        throw Error('Db not initialized');
    }
    return _db;
};

module.exports = {
    initDb,
    getDb,
};
