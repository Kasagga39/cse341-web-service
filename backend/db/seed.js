const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

const uri = process.env.MONGODB_URI || process.env.MONGODB_URL;
const dbName = process.env.MONGODB_DB || 'project1';

const seedDatabase = async () => {
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

    const contactsCollection = db.collection('contacts');
    const existingContacts = await contactsCollection.countDocuments();
    if (existingContacts > 0) {
      await contactsCollection.deleteMany({});
      console.log('Cleared existing contacts.');
    }

    const sampleContacts = [
      { firstName: 'Emma', lastName: 'Wilson', email: 'emma.wilson@example.com', favoriteColor: 'Yellow', birthday: '1993-03-18' },
      { firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com', favoriteColor: 'Green', birthday: '1995-04-22' },
      { firstName: 'Alice', lastName: 'Johnson', email: 'alice.johnson@example.com', favoriteColor: 'Purple', birthday: '1988-09-10' },
      { firstName: 'Bob', lastName: 'Williams', email: 'bob.williams@example.com', favoriteColor: 'Red', birthday: '1992-12-05' },
      { firstName: 'Charlie', lastName: 'Brown', email: 'charlie.brown@example.com', favoriteColor: 'Orange', birthday: '1985-07-30' }
    ];

    await contactsCollection.insertMany(sampleContacts);
    console.log('Seeded ' + sampleContacts.length + ' contacts into database.');

    const profilesCollection = db.collection('profiles');
    const existingProfiles = await profilesCollection.countDocuments();
    if (existingProfiles > 0) {
      await profilesCollection.deleteMany({});
      console.log('Cleared existing profiles.');
    }

    const sampleProfiles = [
      {
        name: 'Alice Johnson',
        email: 'alice.johnson@example.com',
        phone: '555-0101',
        bio: 'Full-stack developer passionate about building scalable web applications.',
        skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Python'],
        experience: '4 years at TechCorp as a senior developer',
        education: 'BS in Computer Science, BYU-Idaho',
        location: 'Rexburg, ID',
        createdAt: new Date().toISOString()
      },
      {
        name: 'Bob Martinez',
        email: 'bob.martinez@example.com',
        phone: '555-0202',
        bio: 'DevOps engineer with a focus on cloud infrastructure and automation.',
        skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'Linux'],
        experience: '6 years in cloud infrastructure roles',
        education: 'MS in Information Technology, Boise State',
        location: 'Boise, ID',
        createdAt: new Date().toISOString()
      },
      {
        name: 'Clara Nguyen',
        email: 'clara.nguyen@example.com',
        phone: '555-0303',
        bio: 'UX designer turned front-end developer with an eye for detail.',
        skills: ['Figma', 'HTML', 'CSS', 'Vue.js', 'TypeScript'],
        experience: '2 years at DesignHub as a front-end developer',
        education: 'BS in Graphic Design, BYU-Idaho',
        location: 'Provo, ID',
        createdAt: new Date().toISOString()
      },
      {
        name: 'David Kim',
        email: 'david.kim@example.com',
        phone: '555-0404',
        bio: 'Data analyst transitioning into machine learning engineering.',
        skills: ['Python', 'SQL', 'TensorFlow', 'Pandas', 'Tableau'],
        experience: '3 years as a data analyst at DataCo',
        education: 'BS in Statistics, University of Utah',
        location: 'Salt Lake City, UT',
        createdAt: new Date().toISOString()
      },
      {
        name: 'Emily Carter',
        email: 'emily.carter@example.com',
        phone: '555-0505',
        bio: 'Mobile app developer specializing in cross-platform solutions.',
        skills: ['React Native', 'Swift', 'Kotlin', 'Firebase', 'GraphQL'],
        experience: '5 years building mobile apps at AppWorks',
        education: 'BS in Software Engineering, BYU-Idaho',
        location: 'Idaho Falls, ID',
        createdAt: new Date().toISOString()
      }
    ];

    await profilesCollection.insertMany(sampleProfiles);
    console.log('Seeded ' + sampleProfiles.length + ' profiles into database.');
    console.log('Database seeding complete.');
  } catch (err) {
    console.error('Seed error:', err.message);
    process.exitCode = 1;
  } finally {
    await client.close();
  }
};

seedDatabase();
