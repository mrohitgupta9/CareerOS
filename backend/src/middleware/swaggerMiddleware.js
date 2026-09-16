const swaggerUi = require("swagger-ui-express");

const {
  openApiSpec,
} = require("../config/openapi");

// =====================================================
// Swagger Middleware
// =====================================================

const setupSwagger = (app) => {
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(
      openApiSpec,
      {
        explorer: true,
        customSiteTitle:
          "Application API Documentation",
      }
    )
  );
};

// =====================================================
// Export
// =====================================================

module.exports = {
  setupSwagger,
};