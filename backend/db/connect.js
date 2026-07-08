const dotenv = require('dotenv');
dotenv.config();
const MongoClient = require('mongodb').MongoClient;

let _db;

const initDb = (callback) => {
    if (_db) {
        console.log('Db is already initialized!');
        return callback(null, _db);
    }

    const mongoUri = process.env.MONGODB_URI || process.env.MONGODB_URL;

    if (!mongoUri) {
        return callback(new Error('MongoDB connection string is not defined'));
    }

    MongoClient.connect(mongoUri)
        .then((client) => {
            _db = client;
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