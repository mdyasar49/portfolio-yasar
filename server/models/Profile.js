/**
 * [MongoDB Data Model: Profile]
 * This file uses Mongoose to define the schema for your portfolio profile.
 * MongoDB provides the flexible, document-based storage for your resume data.
 */
const mongoose = require('mongoose');

const ExperienceSchema = new mongoose.Schema({
  role: String,
  company: String,
  companyUrl: String,
  period: String,
  description: [String]
});

const ProjectSchema = new mongoose.Schema({
  name: String,
  type: String,
  technologies: [String],
  image: String,
  link: String,
  github: String,
  description: [String]
});

const ProfileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  title: String,
  email: String,
  phone: String,
  location: String,
  summary: String,
  technicalSkills: {
    frontend: [String],
    backend: [String],
    database: [String],
    tools: [String]
  },
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
  }
});

module.exports = mongoose.model('Profile', ProfileSchema);
