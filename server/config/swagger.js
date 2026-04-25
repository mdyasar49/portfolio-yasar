const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MERN Portfolio Engineering API',
      version: '1.0.0',
      description:
        'Production-grade API documentation for the A. Mohamed Yasar Portfolio Ecosystem. This API handles professional data delivery, system health monitoring, and administrative terminal orchestration.',
      contact: {
        name: 'A. Mohamed Yasar',
        url: 'https://github.com/mdyasar49',
        email: 'mohamedyasar081786@gmail.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:5001',
        description: 'Development Server',
      },
      {
        url: 'https://mern-portfolio-yasar-1.onrender.com',
        description: 'Production Server',
      },
    ],
  },
  apis: ['./routes/*.js'], // Path to the API docs
};

const specs = swaggerJsdoc(options);

module.exports = specs;
