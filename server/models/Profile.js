/**
 * Language: JavaScript (Node.js/Mongoose)
 * Purpose of this file:
 * This file establishes the structural blueprint (Schema) for the main portfolio data.
 * Mongoose uses this to enforce data integrity and structure for all your skills,
 * projects, experience, and personal information before it gets saved to MongoDB.
 */

// Import the mongoose library to define schemas and interact with MongoDB
const mongoose = require('mongoose');

/**
 * [ExperienceSchema]
 * Models professional work history with nested arrays for task descriptions.
 */
// Define the sub-schema structure for a single job/experience entry
const ExperienceSchema = new mongoose.Schema({
  // The job title
  role: String,
  // The company name
  company: String,
  // The company's website
  companyUrl: String,
  // The time duration worked there
  period: String,
  // An array of text strings representing bullet points of what was done
  description: [String],
});

/**
 * [ProjectSchema]
 * Models individual engineering projects, including technical stacks and real-time stats.
 */
// Define the sub-schema structure for a single portfolio project
const ProjectSchema = new mongoose.Schema({
  // Name of the project
  name: String,
  // Type of project (e.g., Full Stack, Frontend)
  type: String,
  // Array of technologies used
  technologies: [String],
  // URL or path to the project's thumbnail image
  image: String,
  // URL to the live deployment
  link: String,
  // URL to the GitHub repository
  github: String,
  // Array of text strings describing the project
  description: [String],
  // Array of key features or highlights
  highlights: [String],
  // A dynamic key-value map for custom statistics (e.g., "Performance": "99%")
  stats: { type: Map, of: String },
});

/**
 * [ProfileSchema] (Master Aggregate)
 * The root document that brings together all biography data, skills, and sub-schemas.
 */
// Define the main schema structure for the entire portfolio profile
const ProfileSchema = new mongoose.Schema({
  // Full name, which is strictly required
  name: { type: String, required: true },
  // Professional title
  title: String,
  // Contact email
  email: String,
  // Contact phone number
  phone: String,
  // Current location
  location: String,
  // Short professional summary
  summary: String,

  // Categorized Skills Storage object containing arrays of strings
  technicalSkills: {
    frontend: [String],
    backend: [String],
    database: [String],
    tools: [String],
    aiTools: [String],
    other: [String],
  },

  // Embed the previously defined sub-schemas as arrays
  experience: [ExperienceSchema],
  projects: [ProjectSchema],

  // Inline sub-schema for education history
  education: [
    {
      degree: String,
      institution: String,
      institutionUrl: String,
      year: String,
    },
  ],

  // Array of certifications
  certifications: [String],
  // Array of soft skills
  softSkills: [String],

  // Grouped additional info
  additionalInfo: {
    availability: String,
    workPreference: String,
    languages: [String],
  },

  // Grouped social media links
  socials: {
    linkedin: String,
    github: String,
    twitter: String,
    instagram: String,
    facebook: String,
  },

  // Raw markdown support for the /architecture or readme page
  readme: String,
  // Detailed explanation of projects
  projectExplanation: String,
});

// Compile and export the main schema as a usable Mongoose model named 'Profile'
module.exports = mongoose.model('Profile', ProfileSchema);
