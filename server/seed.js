/**
 * [Database Seeding Logic]
 * This script automates the process of populating your MongoDB database
 * with initial portfolio data from data.json.
 */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const Profile = require('./models/Profile');

dotenv.config();

const getSeedData = () => {
  try {
    const data = fs.readFileSync(path.join(__dirname, 'data.json'), 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Could not read data.json for seeding:', err.message);
    process.exit(1);
  }
};

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for Seeding...');

    const fullProfile = getSeedData();

    await Profile.deleteMany({});
    await Profile.create(fullProfile);

    console.log('Database Seeded Successfully! Portfolio is now live with Backend Data.');
    process.exit();
  } catch (err) {
    console.error('Seeding Error:', err);
    process.exit(1);
  }
};

seedDB();
