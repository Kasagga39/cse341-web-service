const database = require('../../data/database');

const ensureDb = () => new Promise((resolve, reject) => {
    try {
        const db = database.getDb();
        return resolve(db);
    } catch (e) {
        database.initDb((err, db) => {
            if (err) {
                return reject(err);
            }
            resolve(db);
        });
    }
});

const getDb = () => database.getDb();

module.exports = {
    initDb: database.initDb,
    getDb,
    ensureDb,
};