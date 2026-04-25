/**
 * Language: JavaScript (Node.js/Mongoose)
 * Purpose of this file:
 * This file defines the database schema and model for the "Admin" user.
 * It enforces rules for what an admin account looks like (username, password, role),
 * automatically securely hashes the password before saving it to the database,
 * and provides a helper method to verify passwords during login.
 */

// Import the mongoose library to interact with MongoDB
const mongoose = require('mongoose');
// Import bcryptjs to securely hash and compare passwords
const bcrypt = require('bcryptjs');

// Define the structure (Schema) for the Admin document
const AdminSchema = new mongoose.Schema({
  // The admin's username field
  username: {
    // Data type must be a String
    type: String,
    // The field is mandatory, with a custom error message if missing
    required: [true, 'Username is required'],
    // Ensure no two admins can have the same username
    unique: true,
    // Automatically remove extra spaces from the beginning and end
    trim: true,
  },
  // The admin's password field
  password: {
    // Data type must be a String
    type: String,
    // The field is mandatory
    required: [true, 'Password is required'],
    // Ensure the password is at least 6 characters long
    minlength: 6,
    // Security: Do NOT return the password field when querying the DB by default
    select: false,
  },
  // The role field to define authorization level
  role: {
    // Data type must be a String
    type: String,
    // Default role is always 'admin'
    default: 'admin',
  },
  // Timestamp for when the account was created
  createdAt: {
    // Data type must be a Date
    type: Date,
    // Default to the exact moment the document is created
    default: Date.now,
  },
});

/**
 * [Security Hook] — Hash password before saving
 * This function automatically runs BEFORE a document is saved to the database.
 */
AdminSchema.pre('save', async function (next) {
  // If the password hasn't been changed (like during an unrelated update), skip hashing
  if (!this.isModified('password')) return next();
  // Generate a secure random salt with a strength of 10
  const salt = await bcrypt.genSalt(10);
  // Replace the plain text password with the newly securely hashed password
  this.password = await bcrypt.hash(this.password, salt);
  // Proceed to the actual save operation
  next();
});

/**
 * [Auth Logic] — Verify password match
 * This adds a custom method to the Admin model to check if a provided password is correct.
 */
AdminSchema.methods.matchPassword = async function (enteredPassword) {
  // Use bcrypt to securely compare the plain text entered password with the hashed password in the DB
  return await bcrypt.compare(enteredPassword, this.password);
};

// Compile and export the Admin schema as a usable Mongoose model
module.exports = mongoose.model('Admin', AdminSchema);
