const {
  healthCheck,
  readinessCheck,
} = require("../../src/controllers/healthController");

const {
  getDatabaseStatus,
} = require("../../src/config/database");

const {
  getRedisStatus,
} = require("../../src/config/redis");

jest.mock("../../src/config/database", () => ({
  getDatabaseStatus: jest.fn(),
}));

jest.mock("../../src/config/redis", () => ({
  getRedisStatus: jest.fn(),
}));

jest.mock("mongoose", () => ({
  connection: {
    readyState: 1,
  },
}));

describe("Health Controller", () => {
  const createResponse = () => ({
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  });

  beforeEach(() => {
    jest.clearAllMocks();

    getDatabaseStatus.mockReturnValue({
      status: "connected",
      name: "test",
      host: "localhost",
      port: 27017,
    });

    getRedisStatus.mockReturnValue({
      status: "connected",
      ready: true,
      open: true,
    });
  });

  it("should return healthy application status", () => {
    const req = {
      requestId: "test-request-id",
    };

    const res = createResponse();

    healthCheck(req, res);

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        status: "ok",
        service: "application",
        requestId: "test-request-id",
      })
    );
  });

  it("should return ready when dependencies are available", () => {
    const req = {
      requestId: "test-request-id",
    };

    const res = createResponse();

    readinessCheck(req, res);

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        status: "ready",
      })
    );
  });

  it("should return not ready when Redis is unavailable", () => {
    getRedisStatus.mockReturnValue({
      status: "disconnected",
      ready: false,
      open: false,
    });

    const req = {
      requestId: "test-request-id",
    };

    const res = createResponse();

    readinessCheck(req, res);

    expect(res.status).toHaveBeenCalledWith(503);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        status: "not_ready",
      })
    );
  });
});