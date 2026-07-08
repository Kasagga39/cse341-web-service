const app = require('./backend/app');
const mongodb = require('./backend/db/connect');

const port = process.env.PORT || 3000;

mongodb.initDb((err) => {
    if (err) {
        console.log('MongoDB connection error:', err.message);
    }

    app.listen(port, () => {
        console.log(`Server listening on ${port}`);
        if (!err) {
            console.log('Connected to DB');
        }
    });
});