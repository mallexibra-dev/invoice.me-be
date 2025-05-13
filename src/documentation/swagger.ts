import swaggerJSDoc from 'swagger-jsdoc';

const port = process.env.PORT;
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'INVOICE.ME',
      version: '1.0.0',
      description: 'API documentation for invoice.me app',
    },
    servers: [
      {
        url: `http://localhost:${port}/api`,
      },
    ],
  },
  apis: ['./src/routes/*.ts'],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
