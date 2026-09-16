const swaggerJsdoc = require("swagger-jsdoc");

// =====================================================
// OpenAPI Configuration
// =====================================================

const openApiDefinition = {
  openapi: "3.0.3",

  info: {
    title: "Application API",
    version: "0.1.0",
    description:
      "Generic production-ready REST API documentation.",
  },

  servers: [
    {
      url:
        process.env.API_BASE_URL ||
        "http://localhost:5000",
      description:
        process.env.NODE_ENV === "production"
          ? "Production server"
          : "Development server",
    },
  ],

  tags: [],

  paths: {},

  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
};

const openApiOptions = {
  definition: openApiDefinition,

  apis: [
    "./src/routes/**/*.js",
    "./src/controllers/**/*.js",
  ],
};

const openApiSpec =
  swaggerJsdoc(openApiOptions);

module.exports = {
  openApiSpec,
};