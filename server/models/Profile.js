/**
 * [MongoDB & Mongoose - Data Modeling]
 * Technologies: MongoDB (NoSQL Database), Mongoose (ODM), Javascript
 * Purpose: This file establishes the structural blueprint (Schema) for the portfolio data.
 * Mongoose enforces data integrity and provides an elegant API for MongoDB interactions.
 */
const mongoose = require('mongoose');

/**
 * ExperienceSchema
 * Models professional work history with nested arrays for task descriptions.
 */
const ExperienceSchema = new mongoose.Schema({
  role: String,
  company: String,
  companyUrl: String,
  period: String,
  description: [String] // Array of bullet points for the role
});

/**
 * ProjectSchema
 * Models individual engineering projects, including technical stacks and real-time stats.
 */
const ProjectSchema = new mongoose.Schema({
  name: String,
  type: String,
  technologies: [String],
  image: String, // URL/Path to the project thumbnail
  link: String,  // Live deployment URL
  github: String, // Source code repository URL
  description: [String],
  highlights: [String],
  stats: { type: Map, of: String } // Key-Value pair for metrics like "Performance", "Uptime"
});

/**
 * ProfileSchema (Master Aggregate)
 * The root document that brings together all biography data, skills, and sub-schemas.
 */
const ProfileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  title: String,
  email: String,
  phone: String,
  location: String,
  summary: String,
  
  // Categorized Skills Storage
  technicalSkills: {
    frontend: [String],
    backend: [String],
    database: [String],
    tools: [String],
    aiTools: [String],
    other: [String]
  },
  
  // Sub-document implementations
  experience: [ExperienceSchema],
  projects: [ProjectSchema],
  
  education: [
    {
      degree: String,
      institution: String,
      institutionUrl: String,
      year: String
    }
  ],
  
  certifications: [String],
  softSkills: [String],
  
  additionalInfo: {
    availability: String,
    workPreference: String,
    languages: [String]
  },
  
  socials: {
    linkedin: String,
    github: String,
    twitter: String,
    instagram: String,
    facebook: String
  },
  
  readme: String, // Raw markdown support for the /architecture page
  projectExplanation: String
});

// Exporting the model as 'Profile' for availability in the portfolioController
module.exports = mongoose.model('Profile', ProfileSchema);
