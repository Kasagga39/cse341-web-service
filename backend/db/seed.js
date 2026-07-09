const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

const uri = process.env.MONGODB_URI || process.env.MONGODB_URL;
const dbName = process.env.MONGODB_DB || 'project1';

const seedContacts = async () => {
  if (!uri) {
    console.error('MongoDB connection string is not defined in environment variables');
    process.exitCode = 1;
    return;
  }

  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 10000,
  });

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('contacts');

    const existing = await collection.countDocuments();

    if (existing > 0) {
      await collection.deleteMany({});
      console.log('Cleared existing contacts.');
    }

    const sampleContacts = [
      {
        firstName: 'Emma',
        lastName: 'Wilson',
        email: 'emma.wilson@example.com',
        favoriteColor: 'Yellow',
        birthday: '1993-03-18'
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        favoriteColor: 'Green',
        birthday: '1995-04-22'
      },
      {
        firstName: 'Alice',
        lastName: 'Johnson',
        email: 'alice.johnson@example.com',
        favoriteColor: 'Purple',
        birthday: '1988-09-10'
      },
      {
        firstName: 'Bob',
        lastName: 'Williams',
        email: 'bob.williams@example.com',
        favoriteColor: 'Red',
        birthday: '1992-12-05'
      },
      {
        firstName: 'Charlie',
        lastName: 'Brown',
        email: 'charlie.brown@example.com',
        favoriteColor: 'Orange',
        birthday: '1985-07-30'
      }
    ];

    await collection.insertMany(sampleContacts);
    console.log('Seeded sample contacts into database.');
  } catch (err) {
    console.error('Seed error:', err.message);
    process.exitCode = 1;
  } finally {
    await client.close();
  }
};

seedContacts();
