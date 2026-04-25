const fs = require('fs');
const path = require('path');

const getLocalData = () => {
  try {
    const dataDir = 'c:\\Users\\HP\\Documents\\Mern Stack Developer\\server\\data';

    const fragments = [
      'basic_info.json',
      'skills.json',
      'experience.json',
      'projects.json',
      'education.json',
      'socials.json',
      'additional.json',
      'documentation.json',
      'navigation.json',
      'analytics.json',
    ];

    let aggregatedData = {};

    fragments.forEach((file) => {
      const filePath = path.join(dataDir, file);
      if (fs.existsSync(filePath)) {
        const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        if (Array.isArray(content)) {
          const key = file.split('.')[0];
          aggregatedData[key] = content;
        } else {
          aggregatedData = { ...aggregatedData, ...content };
        }
      }
    });

    console.log(JSON.stringify(aggregatedData, null, 2));
  } catch (error) {
    console.error('CRITICAL_AGGREGATION_FAILURE:', error.message);
  }
};

getLocalData();
