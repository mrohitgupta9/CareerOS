# Production Monitoring & Observability

## 1. Purpose

This document defines the observability and monitoring strategy
for ProductionSetup.

The monitoring strategy covers:

- structured logging
- request correlation
- health monitoring
- readiness monitoring
- error monitoring
- uptime monitoring
- production alerting

---

## 2. Structured Logging

ProductionSetup uses structured JSON logging.

Each log entry contains:

- timestamp
- level
- event
- message
- requestId
- metadata
- error

Example:

{
  "timestamp": "2026-01-01T00:00:00.000Z",
  "level": "info",
  "event": "http_request_completed",
  "message": "Request completed",
  "requestId": "request-id",
  "metadata": {
    "method": "GET",
    "path": "/health",
    "statusCode": 200,
    "durationMs": 5
  },
  "error": null
}

---

## 3. Request Correlation

Every HTTP request receives an X-Request-ID.

If the client provides an X-Request-ID,
the application preserves it.

Otherwise the application generates a UUID.

The request ID is:

- stored on req.requestId
- returned through the X-Request-ID response header
- included in API responses where applicable
- included in structured logs

This allows a request to be traced across logs and API responses.

---

## 4. Health Monitoring

The application exposes:

GET /health

Expected successful response:

{
  "success": true,
  "status": "ok"
}

The endpoint is used by:

- Render health checks
- container health checks
- uptime monitoring
- operational verification

---

## 5. Service Status

The application exposes:

GET /api/status

The endpoint reports:

- API status
- database status
- Redis status
- request ID

Example:

{
  "success": true,
  "services": {
    "api": "running",
    "database": "connected",
    "redis": "connected"
  },
  "requestId": "request-id"
}

---

## 6. Error Monitoring

Errors are centralized through the global error middleware.

Errors are normalized into stable API error codes.

Production responses do not expose:

- stack traces
- internal implementation details
- secrets
- database credentials
- infrastructure credentials

Internal errors are recorded through structured logging.

---

## 7. Uptime Monitoring

Production uptime monitoring should target:

https://productionsetup.onrender.com/health

Monitoring configuration:

Method:
GET

Expected HTTP status:
200

Expected application state:
success=true

The uptime provider should check the endpoint periodically.

---

## 8. Alert Conditions

The following conditions should generate operational alerts.

### Critical

- Production health endpoint unavailable
- Application completely unavailable
- Repeated container crashes

### High

- Repeated HTTP 5xx responses
- Database connection failure
- Redis connection failure

### Warning

- High API latency
- Increasing error rate
- Repeated failed health checks

### Info

- Successful deployment
- Successful rollback
- Infrastructure recovery

---

## 9. Incident Investigation

When an incident occurs:

1. Check the production health endpoint.
2. Check /api/status.
3. Capture the request ID.
4. Search structured logs using the request ID.
5. Check application logs.
6. Check database connectivity.
7. Check Redis connectivity.
8. Check the current deployment version.
9. Roll back if required.
10. Document the incident.

---

## 10. Deployment Verification

After every production deployment verify:

- frontend availability
- backend availability
- /health
- /api/status
- HTTPS
- CORS
- request ID generation
- structured logs

---

## 11. Monitoring Philosophy

ProductionSetup intentionally keeps monitoring infrastructure
provider-agnostic.

The template provides:

- structured application logs
- request correlation
- health checks
- service status
- error normalization
- operational alert definitions

A specific monitoring vendor can be selected later by the
actual application using this template.

---

## 12. Current Production Monitoring

Frontend:

Vercel

Backend:

Render

Database:

MongoDB Atlas

Redis:

Upstash

Health endpoint:

https://productionsetup.onrender.com/health

---

## 13. Verification Status

36.1 Structured Logging: PASS

36.2 Request Correlation: PASS

36.3 Health & Readiness Monitoring: PASS

36.4 Error Monitoring Strategy: PASS

36.5 Uptime Monitoring: PASS

36.6 Production Alerting: PASS

36.7 Monitoring Documentation: PASS