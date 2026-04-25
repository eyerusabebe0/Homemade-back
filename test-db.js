const mongoose = require('mongoose');
require('dotenv').config();

const testConnection = async () => {
  try {
    console.log('Attempting to connect to:', process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected successfully!');
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.log('\nPossible issues:');
    console.log('1. Wrong username/password');
    console.log('2. Cluster name is incorrect');
    console.log('3. Network issues');
  }
};

testConnection();