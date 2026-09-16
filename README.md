# ProductionSetup

Reusable production-level full-stack project foundation.

ProductionSetup is a reusable foundation for building secure, scalable,
and production-ready full-stack web applications.

It provides a standardized architecture, development workflow,
security foundation, testing setup, containerization, CI/CD,
and local production simulation.

This repository is intentionally generic.

Feature-specific business logic, models, controllers, pages,
and other application-specific components are added later
according to the requirements of the actual project.

---

## Development Approach

The project follows this development lifecycle:

Foundation
→ Core Product
→ Advanced Features
→ Production
→ Scale

The current repository is focused on building a strong,
secure, and reusable Foundation layer.

---

## Architecture

````text
ProductionSetup/
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/
│       │   ├── common/
│       │   ├── layout/
│       │   ├── forms/
│       │   └── feedback/
│       ├── hooks/
│       ├── layouts/
│       ├── pages/
│       ├── routes/
│       ├── services/
│       ├── stores/
│       ├── utils/
│       ├── constants/
│       ├── config/
│       └── styles/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── validators/
│   │   ├── utils/
│   │   ├── constants/
│   │   ├── jobs/
│   │   └── events/
│   │
│   └── tests/
│       ├── unit/
│       ├── integration/
│       └── e2e/
│
├── infrastructure/
│   ├── docker/
│   ├── nginx/
│   ├── scripts/
│   └── monitoring/
│
├── docs/
│   ├── architecture/
│   ├── api/
│   ├── database/
│   └── deployment/
│
├── tests/
│   ├── e2e/
│   ├── performance/
│   └── security/
│
├── .github/
│   └── workflows/
│
├── docker-compose.yml
├── docker-compose.prod.yml
├── Dockerfile
├── .gitignore
├── .dockerignore
├── README.md
└── LICENSE



# Technology Stack

## Frontend

- React
- Vite
- Tailwind CSS
- React Router
- Zustand
- Axios
- React Hook Form
- React Icons
- React Hot Toast
- Day.js
- Framer Motion

## Backend

- Node.js
- Express
- MongoDB
- Mongoose
- Redis
- JWT
- bcrypt
- Helmet
- CORS
- Cookie Parser
- Express Rate Limit

## Testing

- Vitest
- React Testing Library
- jsdom
- Jest
- Supertest
- Playwright

## Infrastructure

- Docker
- Docker Compose
- Nginx
- GitHub Actions
- GitHub Container Registry

---

# Foundation Progress

## Project Architecture

- Standardized full-stack folder structure
- Separate frontend and backend architecture
- Infrastructure structure
- Testing structure
- Documentation structure
- GitHub Actions structure

## Frontend Foundation

- React + Vite setup
- Tailwind CSS setup
- React Router setup
- Axios API client
- Zustand state management foundation
- Reusable component structure
- Frontend production build

## Backend Foundation

- Express server
- Environment configuration
- MongoDB connection
- Redis connection
- CORS configuration
- Helmet security middleware
- Cookie support
- JSON request limits
- Centralized error handling
- 404 handling
- Graceful shutdown
- Health endpoint
- API status endpoint

---

# Docker & Containerization

The project includes:

- Production frontend Docker image
- Production backend Docker image
- Nginx reverse proxy
- Docker Compose development environment
- Docker Compose production simulation
- Non-root backend container
- Container health checks
- Persistent Redis storage

The backend production container runs as a non-root user
for improved container security.

---

# Testing Foundation

## Frontend Testing

- Vitest
- React Testing Library
- jsdom
- User interaction testing
- Production build verification

## Backend Testing

- Jest
- Supertest
- Unit testing
- Integration testing

## End-to-End Testing

- Playwright
- Browser-based application testing
- Application availability testing

---

# CI/CD

GitHub Actions provides automated:

## Continuous Integration

- Frontend dependency installation
- Frontend tests
- Frontend production build
- Backend tests
- End-to-end tests

## Continuous Delivery

- Docker image builds
- Docker image publishing
- GitHub Container Registry integration
- Versioned Docker images
- Latest image tagging

## Deployment Validation

- Docker image pulling
- Docker image verification
- Release validation
- Production image availability checks

---

# Security Foundation

Security is treated as a core part of the foundation.

## Rate Limiting

- Global API rate limiting
- Authentication rate limiting foundation
- Standard rate-limit headers
- Protection against excessive requests

## Password Security

- bcrypt password hashing
- Configurable salt rounds
- Secure password comparison
- Plaintext password storage is avoided

## JWT Security

- Short-lived access tokens
- JWT verification utility
- Bearer token authentication middleware
- Invalid and expired token handling

## Refresh Token Security

- Cryptographically secure refresh tokens
- SHA-256 refresh token hashing
- Refresh token expiration
- Refresh token rotation
- Token family tracking
- Token family revocation
- Refresh token reuse detection

## Session Security

- User session registry
- Session metadata
- Device tracking
- User-agent tracking
- IP tracking
- Individual session revocation
- Session-family revocation
- Logout current session
- Logout all devices
- Stale session cleanup

## Cookie Security

Refresh tokens are designed to use:

- HttpOnly cookies
- Secure cookies in production
- SameSite protection
- Restricted cookie path
- Cookie expiration

## Security Audit Events

The foundation includes structured security events for:

- Login success
- Login failure
- Logout
- Logout all devices
- Session creation
- Session revocation
- Token refresh
- Token refresh failure
- Token reuse detection
- Token family revocation
- Password changes
- Account locking
- Suspicious activity

Sensitive information such as passwords, access tokens,
refresh tokens, JWT secrets, authorization headers,
and cookies is excluded from security logs.

---

# Production Simulation

The project supports a local production-like environment.

```text
                 Nginx
                   │
          ┌────────┴────────┐
          │                 │
      Frontend           Backend
                              │
                       ┌──────┴──────┐
                       │             │
                    MongoDB        Redis

This allows production architecture and container behavior
to be tested locally before deploying to a real server.

---

# Current Release

Current foundation release:

```text
v0.1.1


The current release includes:

Production container hardening
Nginx reverse proxy
Docker health checks
GitHub Container Registry images
Deployment validation
Backend rate limiting
Password security
JWT authentication foundation
Refresh token security
Session management
Token rotation
Token reuse detection
Session cleanup
Security audit/event logging



Future Foundation Roadmap

The following foundation improvements are planned
but intentionally postponed for later:

Step 16  Request Correlation ID + Centralized Logging
Step 17  Input Validation + Sanitization
Step 18  Security Headers + CORS Hardening
Step 19  API Error Handling + Error Codes
Step 20  Database Indexing + Query Optimization
Step 21  Redis Caching Strategy
Step 22  Background Jobs / Job Queue
Step 23  API Documentation / OpenAPI
Step 24  Monitoring + Readiness Checks
Step 25  Final Production Security Audit

## Step 16 — Request Correlation ID + Centralized Logging

Implemented request correlation and centralized application logging.

### Features

- Unique `X-Request-ID` generated for requests.
- Existing request IDs are preserved when provided.
- Request IDs are returned in API responses.
- Request IDs are exposed through CORS.
- Centralized request logging implemented.
- Request method, path, status code and duration are tracked.
- Request IDs help trace requests across application logs.

### Result

Request correlation and centralized logging implemented successfully.

---

## Step 17 — Input Validation + Sanitization

Implemented request input validation and sanitization foundation.

### Features

- Request validation support using `express-validator`.
- Validation layer prepared for API endpoints.
- Invalid request data can be rejected before controller execution.
- Input sanitization support added.
- Validation architecture separated from controllers.

### Result

Input validation and sanitization foundation completed.

---

## Step 18 — Security Headers + CORS Hardening

Implemented production security headers and hardened CORS configuration.

### Security Headers

Configured using Helmet:

- Content-Security-Policy
- Strict-Transport-Security
- X-Content-Type-Options
- X-Frame-Options
- Referrer-Policy
- Cross-Origin-Opener-Policy
- Cross-Origin-Resource-Policy
- X-DNS-Prefetch-Control
- X-Download-Options
- X-Permitted-Cross-Domain-Policies

Step 19 — API Error Handling + Error Codes

Implemented centralized API error handling.

Features
Centralized error middleware.
Standardized JSON error responses.
HTTP status codes are handled consistently.
Application-level error codes supported.
Production stack traces are not exposed.
Request IDs are included in error responses.
Unknown routes return structured 404 responses.


Step 20 — Database Indexing + Query Optimization

Database configuration prepared for production workloads.

Features
MongoDB connection pooling configured.
Minimum and maximum pool sizes configured.
Query timeout configured.
Database connection status monitoring implemented.
Indexing strategy prepared for feature-specific models.
Database remains the persistent source of truth.
Result

Database performance foundation completed.


Step 21 — Redis Caching Strategy

Redis caching infrastructure implemented.

Features
Redis connection management.
Redis reconnect handling.
Redis health/status monitoring.
Configurable cache prefix.
Production Redis URL support.
Cache layer separated from persistent database storage.


Step 22 — Background Jobs / Job Queue

Background job infrastructure prepared using BullMQ.

Features
BullMQ dependency added.
Redis-backed job queue architecture prepared.
Job processing can be added under:
backend/src/jobs/
Feature-specific workers can be added when required.
Background processing remains separated from HTTP request handling.
Result :- Background job infrastructure foundation completed.


Step 23 — API Documentation / OpenAPI

API documentation foundation implemented using Swagger/OpenAPI.

Features
Swagger/OpenAPI configuration.
Swagger UI available during development.
API documentation route configured.
API schemas can be added as application features are developed.

Development documentation:
Result:- OpenAPI documentation foundation completed.


Step 24 — Monitoring + Readiness Checks

Application health and readiness foundation implemented.
Monitoring

Application status includes:

Application health
MongoDB connection status
Redis connection status
Environment information
Application version
Request correlation ID
Result

Health and readiness monitoring foundation completed.


Step 25 — Final Production Security Audit

Final production security baseline reviewed.

Security Areas
Git secret protection
Environment variable protection
Production configuration
Docker security
Non-root containers
Security headers
CORS
Rate limiting
Error handling
Dependency security
HTTPS
Request correlation
Result

Production security baseline verified successfully.


Step 26 — Production Environment Configuration

Production environment configuration implemented.

Backend Production Configuration

Production environment variables include:

NODE_ENV=production
PORT=5000
API_BASE_URL=https://productionsetup.onrender.com
APP_VERSION=0.1.0

MONGO_URI=<production-mongodb-uri>
REDIS_URL=<production-redis-url>
REDIS_CACHE_PREFIX=app:cache

CORS_ORIGIN=https://production-setup-omega.vercel.app

JWT_SECRET=<production-secret>
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
REFRESH_TOKEN_COOKIE_NAME=refreshToken
Environment Security
Production secrets are stored in deployment environment variables.
Real .env files are not committed to Git.
.env.example contains safe placeholders only.
Production JWT secret is separate from development secrets.
Required environment variables are validated during startup.
Production non-local origins require HTTPS.
Result

Production environment configuration completed successfully.

Step 27 — Production Docker Images

Production Docker images implemented for frontend and backend.

Backend Docker Image
ghcr.io/mrohitgupta9/productionsetup-backend
Backend Features
Node.js Alpine base image
Production dependencies only
npm ci --omit=dev
Non-root node user
Healthcheck enabled
Port 5000
Production startup command
Frontend Docker Image
ghcr.io/mrohitgupta9/productionsetup-frontend
Frontend Features
Multi-stage Docker build
Node.js Alpine builder
Nginx Alpine runtime
Production static build
Non-root nginx user
Healthcheck enabled
Port 8080
Result

Production Docker images successfully built and published to GHCR.

Step 28 — Frontend Production Build

Frontend production build configured using Vite.

Production API Configuration
VITE_API_URL=https://productionsetup.onrender.com
Build Command
npm run build
Deployment

Frontend is deployed to Vercel.

Production URL:

https://production-setup-omega.vercel.app
Result

Frontend production build and deployment verified successfully.

Step 29 — Backend Production Deployment

Backend deployed as a Docker Web Service on Render.

Configuration
Repository: mrohitgupta9/ProductionSetup
Branch: main
Root Directory: backend
Dockerfile: ./Dockerfile
Port: 5000
Health Check: /health
Auto Deploy: enabled
Region: Singapore
Production URL
https://productionsetup.onrender.com
Health Verification
GET /health

Expected:

{
  "success": true,
  "status": "ok",
  "service": "application",
  "version": "0.1.0"
}
Result

Backend production deployment is live and healthy.

Step 30 — MongoDB + Redis Production Setup

Production database and cache infrastructure configured.

MongoDB

MongoDB Atlas is used as the production persistent database.

Features
Managed MongoDB cluster
Secure connection URI
Connection pooling
Query timeout configuration
Database health/status monitoring

MongoDB remains the primary persistent data source.

Redis

Redis is used for caching and temporary infrastructure state.

Features
Production Redis URL
Cache prefix
Reconnection handling
Redis health/status monitoring

Redis is not treated as the primary persistent data store.

Result

Production MongoDB and Redis infrastructure configured successfully.

Step 31 — CI/CD Deployment Pipeline

GitHub Actions CI/CD pipeline implemented.

CI

CI verifies:

Backend tests
Frontend build
Application configuration
Security-related checks
Docker-related validation
CD

CD handles:

Release verification
Docker image builds
GHCR publishing
Version tagging
OCI image metadata
SBOM generation
Provenance generation
Container Registry
ghcr.io/mrohitgupta9/productionsetup-backend
ghcr.io/mrohitgupta9/productionsetup-frontend
Release Tags
v0.2.0
v0.2.1
v0.2.2
Image Tags

Production images use versioned and commit-based tags.

Example:

v0.2.2
sha-<commit>
latest
Result

CI/CD pipeline successfully configured and verified.

Step 32 — Domain + HTTPS + CORS

Production HTTPS, reverse proxy and CORS configuration completed.

32.1 — Domain Strategy

Current deployment uses platform-provided HTTPS domains.

Frontend
https://production-setup-omega.vercel.app
Backend
https://productionsetup.onrender.com

Custom domains can be added later.

32.2 — Backend HTTPS

Render terminates HTTPS before forwarding requests to Express.

Production Express configuration:

app.set("trust proxy", 1);

This allows Express to correctly detect the original HTTPS request behind
the trusted reverse proxy.

32.3 — Frontend → Backend API

Production frontend API configuration:

VITE_API_URL=https://productionsetup.onrender.com

Frontend communicates with the backend over HTTPS.

32.4 — CORS Hardening

Production CORS allows the configured frontend origin:

https://production-setup-omega.vercel.app

Allowed methods:

GET
POST
PUT
PATCH
DELETE
OPTIONS

Allowed headers:

Content-Type
Authorization
X-Request-ID

Exposed header:

X-Request-ID

Credentials are enabled where required.

Unauthorized Origin Test

Unauthorized origin request returned:

403 Forbidden
Result

Production CORS configuration verified successfully.

32.5 — HTTPS Verification

Production backend tested through:

https://productionsetup.onrender.com/health

Result:

200 OK

HTTPS verified successfully.

32.6 — Reverse Proxy HTTPS Configuration

Local Nginx reverse proxy tested successfully.

Test:

http://localhost:8080/health

Result:

200 OK
32.7 — Secure Proxy Configuration

Production Express configuration:

app.set("trust proxy", 1);

This prepares the application for HTTPS-aware request handling and secure
cookie behavior behind a trusted reverse proxy.

Actual authentication cookie configuration will be implemented when
authentication is added to a real project.

32.8 — Final CORS + HTTPS Verification

Verified:

HTTPS → PASS
Allowed origin → PASS
Unauthorized origin → Rejected
CORS credentials → PASS
CORS headers → PASS
Preflight request → PASS
Request ID → PASS
Result

Domain, HTTPS, reverse proxy and CORS baseline completed.

Step 33 — Production Smoke Tests

Production smoke testing completed.

Frontend
https://production-setup-omega.vercel.app

Status:

LIVE
Backend
https://productionsetup.onrender.com

Status:

LIVE
Health Check
GET /health

Verified:

HTTP 200
success: true
status: ok
service: application
requestId: present
CORS

Allowed frontend origin:

PASS

Unauthorized origin:

403
HTTPS
PASS
Local Backend
http://localhost:5000/health

Result:

200 OK
Local Nginx Proxy
http://localhost:8080/health

Result:

200 OK
Infrastructure
MongoDB        → PASS
Redis          → PASS
Docker         → PASS
GitHub Actions → PASS
Render         → LIVE
Vercel         → LIVE
Result

Production smoke tests successfully completed.

Step 34 — Rollback + Backup Strategy

Rollback and backup strategy documented.

Documentation:

docs/deployment/rollback-and-backup.md
Release Strategy

Production releases use immutable Git tags.

Current releases include:

v0.2.0
v0.2.1
v0.2.2

Existing release tags must not be deleted or overwritten.

Docker Rollback

Versioned GHCR images are retained.

Example:

ghcr.io/mrohitgupta9/productionsetup-backend:v0.2.2
ghcr.io/mrohitgupta9/productionsetup-frontend:v0.2.2
Rollback Process
Identify the failed release.
Identify the last known-good release.
Verify the Git tag.
Verify the corresponding GHCR image.
Roll back the deployment.
Verify /health.
Verify the frontend.
Verify the database.
Verify Redis.
Verify CORS and HTTPS.
Investigate the failed release separately.
MongoDB Backup

MongoDB Atlas is the persistent source of truth.

Production database backups should be enabled according to the selected
MongoDB Atlas plan.

Restore procedures should be tested periodically.

Redis Recovery

Redis is treated as cache/temporary infrastructure.

If Redis data is lost:

Restore or restart Redis.
Reconnect the application.
Rebuild cache entries.
Verify application health.

Primary application data remains in MongoDB.

Result

Rollback and backup strategy documented successfully.

Step 35 — Final Production Security Audit

Final production security audit performed.

Step 35.1 — Git + Secrets Audit

Verified:

git status

Result:

working tree clean

Tracked environment files:

backend/.env.example

Real .env files are not tracked.

Result

PASS

Step 35.2 — Git History Secret Scan

Git history checked for:

.env
backend/.env
frontend/.env.production

No real environment files were found in Git history.

Safe template/test values found:

redis://localhost:6379
mongodb://localhost/test
JWT_SECRET=

These are development/test placeholders and do not contain production
credentials.

Result

PASS

Step 35.3 — Repository Secret Pattern Scan

Repository scanned for common secret patterns including:

OpenAI API keys
GitHub personal access tokens
GitHub fine-grained tokens
AWS access keys
MongoDB credential URIs
Redis credential URIs

No matching real secrets were found.

Result

PASS

Step 35.4 — Environment Configuration Audit

backend/.env.example contains safe template values only.

Example:

NODE_ENV=development
PORT=5000
API_BASE_URL=http://localhost:5000

MONGO_URI=

REDIS_URL=redis://localhost:6379
REDIS_CACHE_PREFIX=app:cache

CORS_ORIGIN=http://localhost:5173

JWT_SECRET=
JWT_EXPIRES_IN=15m

REFRESH_TOKEN_EXPIRES_IN=7d
REFRESH_TOKEN_COOKIE_NAME=refreshToken

Production secrets are supplied through the deployment environment.

Result

PASS

Step 35.5 — Backend Test Audit

Backend test suite executed successfully.

Command:

npm run test

Result:

PASS
Result

PASS

Step 35.6 — Docker Non-Root Audit

Production Docker images inspected.

Backend:

User: node

Frontend:

User: nginx

Both production containers run as non-root users.

Result

PASS

Step 35.7 — Docker OCI Metadata Audit

Production images contain OCI metadata.

Backend
org.opencontainers.image.version
org.opencontainers.image.source
org.opencontainers.image.revision
org.opencontainers.image.created
Frontend
org.opencontainers.image.version
org.opencontainers.image.source
org.opencontainers.image.revision
org.opencontainers.image.created

Verified release:

v0.2.2

Verified Git revision:

cdb2f734bc71838f8bb543a786966f43ead35bee

Both frontend and backend images were built from the same Git revision.

Result

PASS

Step 35.8 — Production Error Exposure Audit

A non-existent production endpoint was tested:

GET /api/non-existent-test-route

Response:

404 Not Found

Example:

{
  "success": false,
  "code": "ROUTE_NOT_FOUND",
  "message": "Route not found: GET /api/non-existent-test-route",
  "requestId": "..."
}

Verified:

No stack trace exposed
No database credentials exposed
No internal filesystem paths exposed
No secrets exposed
Request ID included
Result

PASS

Step 35.9 — Rate Limiting Audit

Global API rate limiter:

Window: 15 minutes
Limit: 300 requests

Authentication rate limiter:

Window: 15 minutes
Limit: 10 requests

Configuration:

standardHeaders: true
legacyHeaders: false

Global limiter mounted on:

app.use("/api", globalApiLimiter);

Authentication limiter is available for authentication routes when a real
authentication feature is added.

Result

PASS

Step 35.10 — Production Security Headers Audit

Production /health response verified:

Strict-Transport-Security
Content-Security-Policy
X-Content-Type-Options
X-Frame-Options
Referrer-Policy
Cross-Origin-Opener-Policy
Cross-Origin-Resource-Policy
Origin-Agent-Cluster
X-DNS-Prefetch-Control
X-Download-Options
X-Permitted-Cross-Domain-Policies

Request correlation header:

X-Request-ID

HSTS configuration:

max-age=31536000; includeSubDomains
Result

PASS

Step 35.11 — CORS Preflight Audit

Production CORS preflight request tested:

OPTIONS /health

Production origin:

https://production-setup-omega.vercel.app

Result:

204 No Content

Verified:

Production origin accepted
Preflight successful
Content-Type accepted
Authorization accepted
Credentials configuration active
Result

PASS

Step 35.12 — Production Dependency Audit

Production dependencies audited using:

npm audit --omit=dev

Result:

found 0 vulnerabilities

The current production dependency tree has no known vulnerabilities reported
by npm audit at the time of the audit.

Result

PASS

Step 35 — Final Security Audit Result

All planned security checks completed successfully.

35.1  Git + Secrets                  ✅
35.2  Git History Secret Scan        ✅
35.3  Repository Secret Scan         ✅
35.4  Environment Configuration      ✅
35.5  Backend Tests                  ✅
35.6  Docker Non-Root                ✅
35.7  Docker OCI Metadata            ✅
35.8  Error Exposure                ✅
35.9  Rate Limiting                  ✅
35.10 Security Headers               ✅
35.11 CORS Preflight                 ✅
35.12 Dependency Audit               ✅
Current Production Status
GitHub Repository       → ✅
GitHub Actions          → ✅
GHCR                    → ✅
Docker                  → ✅
MongoDB Atlas           → ✅
Redis                   → ✅
Render Backend          → ✅ LIVE
Vercel Frontend         → ✅ LIVE
HTTPS                   → ✅
CORS                    → ✅
Security Headers        → ✅
Rate Limiting           → ✅
Error Handling          → ✅
Docker Non-Root         → ✅
Dependency Audit        → ✅
Production Smoke Tests  → ✅
Rollback Strategy       → ✅
Backup Strategy         → ✅
Verified Release

Current verified production release:

v0.2.2

Production images:

ghcr.io/mrohitgupta9/productionsetup-backend:v0.2.2
ghcr.io/mrohitgupta9/productionsetup-frontend:v0.2.2

Git revision:

cdb2f734bc71838f8bb543a786966f43ead35bee


Project Philosophy

ProductionSetup is not a finished application.

It is a reusable engineering foundation designed to provide:

Clean architecture
Security by default
Testability
Containerization
CI/CD
Production readiness
Maintainability
Scalability

Actual business features should be implemented
on top of this foundation according to the requirements
of each individual project.

Development Lifecycle
┌──────────────────────┐
│     Foundation       │
│       Steps 1-25     │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│     Core Product     │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  Advanced Features   │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│     Production       │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│        Scale         │
└──────────────────────┘


# ProductionSetup

Production-ready full-stack application foundation.

## Stack

### Frontend

- React
- Vite
- Nginx
- Vercel

### Backend

- Node.js
- Express
- MongoDB
- Redis

### Infrastructure

- Docker
- Docker Compose
- Nginx
- GitHub Actions
- GHCR

### Production

- Vercel
- Render
- MongoDB Atlas
- Upstash Redis

---

## Architecture

```text
Frontend
   |
   v
Vercel
   |
   v
Backend API
   |
   +---- MongoDB Atlas
   |
   +---- Redis / Upstash


   Repository Structure
ProductionSetup/
├── frontend/
├── backend/
├── infrastructure/
├── docs/
├── tests/
├── .github/
├── Dockerfile
├── docker-compose.yml
├── docker-compose.prod.yml
└── README.md
Local Development
Frontend
cd frontend
npm ci
npm run dev
Backend
cd backend
npm ci
npm run dev

Backend:

http://localhost:5000

Frontend:

http://localhost:5173
Testing
cd backend
npm test

Coverage:

npm run test:coverage
Production Health
GET /health
GET /api/status
Docker

Development:

docker compose up -d --build

Production:

docker compose -f docker-compose.prod.yml up -d --build
Production Deployment

Frontend:

Vercel

Backend:

Render

Database:

MongoDB Atlas

Redis:

Upstash

Documentation

Development:

docs/development/

Deployment:

docs/deployment/

Architecture:

docs/architecture/

API:

docs/api/

Database:

docs/database/

Security

ProductionSetup includes:

Helmet security headers
CORS restrictions
API rate limiting
request correlation
centralized error handling
structured logging
environment validation
non-root Docker containers
production secret separation
dependency auditing
health monitoring
Release Strategy

Releases use Git tags.

Example:

v0.2.2
v0.2.3
v1.0.0

Versioned releases are immutable.

Current Status

Production foundation completed.

Latest verified release:

v0.2.2

Final release:

v1.0.0
License

See LICENSE.


---

# 37.2 Project Setup Guide

`docs/development/setup.md`:

```markdown
# Development Setup

## Requirements

Install:

- Node.js 22+
- npm
- Git
- Docker Desktop

Optional production services:

- MongoDB Atlas
- Upstash Redis

---

## Clone

```powershell
git clone <repository-url>
cd ProductionSetup
Backend
cd backend
npm ci
npm run dev
Frontend

Open another terminal:

cd frontend
npm ci
npm run dev
Environment

Create local environment files from the provided examples.

Never commit real secrets.

Verify

Backend:

http://localhost:5000/health

Frontend:

http://localhost:5173
Tests
cd backend
npm test

---

# 37.3 Environment Configuration

`docs/development/environment.md`:

```markdown
# Environment Configuration

## Backend

Required variables:

- NODE_ENV
- PORT
- API_BASE_URL
- APP_VERSION
- MONGO_URI
- REDIS_URL
- REDIS_CACHE_PREFIX
- CORS_ORIGIN
- JWT_SECRET
- JWT_EXPIRES_IN
- REFRESH_TOKEN_EXPIRES_IN
- REFRESH_TOKEN_COOKIE_NAME

---

## Frontend

Required:

```text
VITE_API_URL
Development

Use localhost services where appropriate.

Production

Production secrets must be configured through the
deployment platform.

Never store production secrets in Git.

Secret Rules

Never commit:

passwords
API keys
JWT secrets
MongoDB credentials
Redis credentials
access tokens

---

# 37.4 API Development Guide

`docs/development/api-development.md`:

```markdown
# API Development Guide

## Backend Structure

```text
src/
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── services/
├── validators/
├── utils/
├── constants/
├── jobs/
└── events/
Adding a New Feature

Recommended flow:

Model
  ↓
Validator
  ↓
Service
  ↓
Controller
  ↓
Route
  ↓
Tests
  ↓
Documentation
Rules

Controllers should remain thin.

Business logic belongs in services.

Validation belongs in validators.

Database models belong in models.

Reusable utilities belong in utils.

Routes should only define HTTP routing.

Error Handling

Use centralized error handling.

Do not expose stack traces or internal errors
to production clients.

Request Correlation

Use:

X-Request-ID

Every request should remain traceable through logs.


---

# 37.5 Testing Guide

`docs/development/testing.md`:

```markdown
# Testing Guide

## Unit Tests

```powershell
npm test -- tests/unit
Integration Tests
npm test -- tests/integration
Full Test Suite
npm test
Coverage
npm run test:coverage
Test Categories
backend/tests/
├── unit/
├── integration/
└── e2e/
Requirements

A feature should include tests for:

successful behavior
validation failures
authorization failures where applicable
error handling
edge cases

---

# 37.6 Docker Development Guide

`docs/development/docker-development.md`:

```markdown
# Docker Development Guide

## Build

```powershell
docker compose build
Start
docker compose up -d
Status
docker compose ps
Logs
docker compose logs -f
Stop
docker compose down
Production Compose
docker compose -f docker-compose.prod.yml up -d --build
Security

Production containers run as non-root users.

Images should be versioned and immutable.

Never place production secrets inside Dockerfiles.


---

# 37.7 Production Deployment Guide

`docs/deployment/production-deployment.md`:

```markdown
# Production Deployment Guide

## Architecture

```text
Users
  |
  v
Vercel
  |
  v
Render
  |
  +---- MongoDB Atlas
  |
  +---- Upstash Redis
Frontend

Deploy frontend through Vercel.

Root directory:

frontend

Build:

npm run build
Backend

Deploy backend through Render.

Root directory:

backend

Health check:

/health

Port:

5000
Production Environment

Configure all production environment variables
through the deployment platform.

Never commit production .env files.

Verification

After deployment:

GET /health
GET /api/status

Verify:

HTTPS
CORS
request ID
security headers
database connectivity
Redis connectivity
frontend availability

---

# 37.8 Troubleshooting

`docs/development/troubleshooting.md`:

```markdown
# Troubleshooting

## Backend Does Not Start

Check:

```powershell
npm test

Then verify environment variables.

MongoDB Connection Error

Verify:

MONGO_URI
Atlas network access
database credentials
Redis Connection Error

Verify:

REDIS_URL
Redis availability
Redis credentials
CORS Error

Verify:

CORS_ORIGIN

matches the frontend origin exactly.

Port Already in Use

Windows:

Get-NetTCPConnection -LocalPort 5000
Docker Problem

Check:

docker ps
docker compose ps
docker compose logs
Production Error

Check:

deployment status
application logs
/health
/api/status
request ID
database
Redis
recent release

Rollback if required.


---

# 37.9 Developer Experience

Ab root-level convenient scripts add karte hain.

`package.json` root mein agar already nahi hai to create karo:

```powershell
notepad ".\package.json"

Content:

{
  "name": "productionsetup",
  "private": true,
  "scripts": {
    "dev:frontend": "npm --prefix frontend run dev",
    "dev:backend": "npm --prefix backend run dev",
    "build:frontend": "npm --prefix frontend run build",
    "test:backend": "npm --prefix backend test",
    "test:coverage": "npm --prefix backend run test:coverage",
    "docker:up": "docker compose up -d --build",
    "docker:down": "docker compose down",
    "docker:logs": "docker compose logs -f",
    "docker:prod": "docker compose -f docker-compose.prod.yml up -d --build"
  }
}

Ab root se:

npm run test:backend

ya:

npm run build:frontend

possible hoga.

37.10 Architecture Documentation

Create:

New-Item `
  -ItemType File `
  -Path "docs\architecture\overview.md" `
  -Force

Content:

# Architecture Overview

## System

```text
                ┌──────────────┐
                │    Users     │
                └──────┬───────┘
                       │
                       v
                ┌──────────────┐
                │   Frontend   │
                │    Vercel    │
                └──────┬───────┘
                       │ HTTPS
                       v
                ┌──────────────┐
                │   Backend    │
                │    Render    │
                └──────┬───────┘
                       │
              ┌────────┴────────┐
              │                 │
              v                 v
       ┌─────────────┐   ┌─────────────┐
       │  MongoDB    │   │    Redis    │
       │    Atlas    │   │   Upstash   │
       └─────────────┘   └─────────────┘
Backend Layers
Routes
  ↓
Controllers
  ↓
Services
  ↓
Models
  ↓
Database

Cross-cutting concerns:

Security
Logging
Request Correlation
Validation
Error Handling
Rate Limiting
Design Principles
security by default
separation of concerns
environment-based configuration
observable services
testable modules
immutable releases
stateless application design where possible
MongoDB as persistent source of truth
Redis for cache / temporary state

---

# 37.11 Contribution Guidelines

Create:

```powershell
notepad ".\CONTRIBUTING.md"
# Contributing

## Development

Create a feature branch:

```text
feature/<name>

Fix branch:

fix/<name>

Security branch:

security/<name>
Before Commit

Run:

npm test

and:

npm run build:frontend
Code Rules
keep modules focused
avoid unnecessary dependencies
validate external input
never commit secrets
write tests for new behavior
update documentation when architecture changes
Pull Requests

A pull request should contain:

clear description
testing information
documentation updates when required
security considerations when applicable

---

# 37.12 Final Documentation Audit

Ab complete audit:

```powershell
cd C:\Users\rohit\OneDrive\Desktop\ProductionSetup

git status

Then:

Get-ChildItem .\docs -Recurse -File |
  Select-Object FullName

Then backend tests:

cd backend
npm test

Frontend build:

cd ..\frontend
npm run build

Root se Git status:

cd ..
git status

Finally:

git add .
git commit -m "docs: finalize developer experience and documentation"
git push origin main
Step 37 completion criteria
37.1 README Finalization             ✅
37.2 Project Setup Guide             ✅
37.3 Environment Configuration       ✅
37.4 API Development Guide           ✅
37.5 Testing Guide                   ✅
37.6 Docker Development Guide        ✅
37.7 Production Deployment Guide     ✅
37.8 Troubleshooting Guide            ✅
37.9 Developer Scripts / DX           ✅
37.10 Architecture Documentation     ✅
37.11 Contribution Guidelines        ✅
37.12 Documentation Audit             ✅
Ab roadmap:
36 — Observability & Monitoring       ✅
37 — Final Documentation + DX         🔵
38 — ProductionSetup v1.0.0 Release   ⏳


License

MIT
````
