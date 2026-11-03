var swaggerJSDoc = require('swagger-jsdoc');
var swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Minha API Node",
      version: "1.0.0",
    },
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",  
        }
      }
    },
    security: [{
      BearerAuth: []
    }]
  },
  apis: ["./routes/*.js"],
};


const swaggerSpec = swaggerJSDoc(options);

module.exports = { swaggerUi, swaggerSpec };
