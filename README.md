# SIS API

A standalone Node.js, Express 5, and PostgreSQL backend for the Balamandian senior project. It exposes protected SIS credential-verification and member-information APIs; it does not create Balamandian accounts, sessions, OTPs, or application roles.

## Local setup

1. Install Node.js and PostgreSQL and apply the approved schema in `database/migrations/001_initial_schema.sql` to a local `sis_db` database if it is not already present.
2. Run `npm install`.
3. Configure `.env` from `.env.example`. Never commit `.env`.
4. Generate a service key with:

   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
   ```

5. Set the generated value as `SIS_SERVICE_API_KEY` in `.env`.
6. Run `npm run db:check`, then start with `npm start` or `npm run dev`.

`DATABASE_URL` takes precedence over individual `DB_*` values. Hosted TLS can be enabled with `DB_SSL=true`; certificate verification is enabled by default.

## API authentication

Every business request must include the backend service key:

```http
Authorization: Bearer <SIS_SERVICE_API_KEY>
```

This authenticates the calling Balamandian backend. The identifier and password sent to the verification endpoint separately authenticate the university member. The API key is not a user session or JWT.

### Verify SIS credentials

`POST /api/v1/auth/verify`

```json
{
  "identifier": "DEVSTU001",
  "password": "member-sis-password"
}
```

The identifier may be an official SIS ID or email; email matching is case-insensitive. Successful verification checks a bcrypt hash, requires an active account, loads roles and basic member data, and then updates `last_login_at`. All credential failures use the same response to avoid account discovery.

```json
{
  "data": {
    "userId": "DEVSTU001",
    "email": "dev.student@example.invalid",
    "firstName": "Dev",
    "lastName": "Student",
    "roles": ["student"],
    "student": {
      "academicStatus": "active",
      "admissionYear": 2026,
      "primaryCampus": { "id": 1, "code": "DEVTEST", "name": "Development Test Campus" },
      "programs": []
    },
    "instructor": null,
    "advisor": null
  }
}
```

### Retrieve member information

`GET /api/v1/members/:userId`

Returns identity, account status, all institutional roles, and applicable student, instructor, or advisor profiles. Student programs include their department and faculty. Collections are empty when absent, and inapplicable profiles are `null`. Password hashes, grades, holds, and service credentials are never returned.

Errors use a consistent structure:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Safe error message."
  }
}
```

## Development accounts

The optional seed is manual, idempotent, and restricted to the local `sis_db`. It creates three fictional accounts plus isolated development campus/program records. Existing conflicting records abort the transaction and are never overwritten.

Set these values only for the seed command:

```env
NODE_ENV=development
DEV_SEED_CONFIRM=sis_db
DEV_SEED_PASSWORD=<temporary-development-password-of-at-least-12-characters>
```

Then run `npm run seed:dev`. The password is bcrypt-hashed and is never logged. Remove the seed-only values afterward. The seed must never run against production or Railway.

## Testing and security

- `npm test` runs isolated unit and HTTP integration tests without changing the development database.
- `npm run db:check` performs read-only connectivity and schema checks.
- Credential verification has an in-memory rate limiter. It is suitable only for local/single-instance use; production needs shared or edge-based enforcement.
- Railway deployment must use HTTPS, protected secrets, a least-privilege database user, certificate validation, and appropriate network controls.
- The application does not enable proxy trust implicitly. Configure it only after reviewing the deployment proxy topology.
