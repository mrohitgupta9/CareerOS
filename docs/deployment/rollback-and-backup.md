# Rollback and Backup Strategy

## 1. Purpose

This document defines the production rollback and backup strategy
for ProductionSetup.

---

## 2. Release Strategy

Production releases are versioned using Git tags.

Example:

- v0.2.2
- v0.2.3
- v0.2.4

Existing release tags must not be deleted or overwritten.

---

## 3. Docker Image Strategy

Production images are published to GHCR.

Image format:

ghcr.io/mrohitgupta9/productionsetup-backend:<version>

ghcr.io/mrohitgupta9/productionsetup-frontend:<version>

Versioned images must remain immutable.

---

## 4. Rollback Strategy

If a production release causes an incident:

1. Identify the last known-good release.
2. Verify its Git tag.
3. Verify the corresponding GHCR image.
4. Roll back the Render deployment to the known-good version.
5. Verify the application health endpoint.
6. Verify the frontend.
7. Verify CORS and critical API functionality.
8. Investigate the failed release separately.

Do not delete the failed release tag.

---

## 5. MongoDB Backup

MongoDB Atlas is the persistent data source.

Production database backups must be enabled in MongoDB Atlas.

Application data must never rely on Redis as the primary data store.

Backup and restore procedures must be tested periodically.

---

## 6. Redis Recovery

Redis is treated as cache / temporary infrastructure.

MongoDB remains the persistent source of truth.

If Redis data is lost:

1. Restart or restore Redis infrastructure.
2. Allow the application to reconnect.
3. Rebuild cache entries naturally.
4. Verify application health.

Redis loss must not cause permanent loss of primary application data.

---

## 7. Production Health Verification

After every rollback:

GET /health

Expected:

{
  "success": true,
  "status": "ok"
}

Also verify:

- frontend availability
- backend availability
- database connectivity
- Redis connectivity
- CORS
- HTTPS
- request ID generation

---

## 8. Emergency Checklist

- [ ] Identify failed release
- [ ] Identify last known-good release
- [ ] Verify Git tag
- [ ] Verify GHCR image
- [ ] Roll back deployment
- [ ] Verify `/health`
- [ ] Verify frontend
- [ ] Verify database
- [ ] Verify Redis
- [ ] Verify CORS
- [ ] Check application logs
- [ ] Document incident