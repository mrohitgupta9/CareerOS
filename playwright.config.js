const { defineConfig } = require("@playwright/test");

module.exports = defineConfig({
  // =====================================================
  // TEST DIRECTORY
  // =====================================================

  testDir: "./tests/e2e",

  testMatch: "**/*.spec.js",

  // =====================================================
  // TEST OPTIONS
  // =====================================================

  use: {
    baseURL: "http://127.0.0.1:5173",

    trace: "on-first-retry",

    screenshot: "only-on-failure",

    video: "retain-on-failure",
  },

  // =====================================================
  // FRONTEND DEVELOPMENT SERVER
  // =====================================================

  webServer: {
    command:
      "npm --prefix ./frontend run dev -- --host 127.0.0.1",

    url: "http://127.0.0.1:5173",

    reuseExistingServer: !process.env.CI,

    timeout: 120000,
  },

  // =====================================================
  // REPORTER
  // =====================================================

  reporter: "html",
});