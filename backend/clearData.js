const mongoose = require('mongoose');
require('dotenv').config();

const clearData = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL || process.env.MONGO_URI);
    console.log('Connected to MongoDB...');

    // Clear all collections
    await mongoose.connection.collection('users').deleteMany({});
    await mongoose.connection.collection('courses').deleteMany({});
    await mongoose.connection.collection('quizzes').deleteMany({});
    await mongoose.connection.collection('progresses').deleteMany({});

    console.log('✅ All data cleared successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error clearing data:', err);
    process.exit(1);
  }
};

clearData();
