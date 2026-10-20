# SIS API — Student Information System

SIS API is an independent, secure REST API for verifying existing university-member credentials and retrieving permitted institutional identity and academic profile data. It is designed for server-to-server integration with the Balamandian backend; mobile clients do not connect to SIS or its database directly.

The SIS remains the source of truth for university identities, credentials, roles, campuses, programs, departments, and faculties. Balamandian owns its application accounts, first-time email OTP flow, sessions, and application-specific authorization.

## System Architecture

![SIS System Architecture](docs/assets/system-architecture.svg)

The Balamandian backend sends authenticated requests to the SIS REST API. Express validates the service credential and request, the relevant module reads PostgreSQL through parameterized queries, and the API returns a sanitized JSON representation of the member. PostgreSQL is never exposed to the mobile application.

## Tech Stack

| Technology | Version / use |
| --- | --- |
| Node.js | JavaScript runtime |
| JavaScript | CommonJS modules |
| Express | `^5.3.0` HTTP application and routing |
| PostgreSQL | Relational SIS data store; schema targets PostgreSQL 16+ |
| node-postgres (`pg`) | `^8.23.1` connection pooling and queries |
| bcrypt | `^6.0.0` password-hash verification |
| dotenv | `^18.0.8` local environment loading |
| Node test runner | Built-in unit and HTTP integration testing |

## Authentication Flow

![SIS Authentication Flow](docs/assets/authentication-flow.svg)

Every request first requires service authentication through a bearer API key shared only with the trusted Balamandian backend. `POST /auth/verify` then performs a separate member-authentication step using the submitted SIS ID or official email and SIS password.

On success, SIS returns verified identity and permitted member information. Balamandian independently handles first-time email OTP verification, creates its own account, and manages application sessions; the SIS API does not issue a Balamandian session or token.

## API Reference

Base URL: `http://localhost:5000/api/v1`

All endpoints require the server-side header `Authorization: Bearer <SIS_SERVICE_API_KEY>`.

### POST `/auth/verify`

Verifies an active university member's SIS credentials. The `identifier` may be an SIS user ID or official email address; email lookup is case-insensitive. Successful verification also updates the member's `last_login_at` value.

#### Request

```http
POST /api/v1/auth/verify HTTP/1.1
Host: localhost:5000
Authorization: Bearer <SIS_SERVICE_API_KEY>
Content-Type: application/json
```

```json
{
  "identifier": "DEVSTU001",
  "password": "member-sis-password"
}
```

For email login, supply the official email as the identifier, for example `"identifier": "dev.student@example.invalid"`.

#### Successful response — `200 OK`

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
      "primaryCampus": { "id": 2, "code": "DEVTEST", "name": "Development Test Campus" },
      "programs": [
        {
          "id": 2,
          "code": "DEV-BS",
          "name": "Development Test Bachelor Program",
          "degreeLevel": "bachelor",
          "status": "active",
          "declaredOn": "2026-08-31T21:00:00.000Z",
          "department": {
            "id": 2,
            "code": "DEVTEST",
            "name": "Development Test Department",
            "faculty": { "id": 2, "code": "DEVTEST", "name": "Development Test Faculty" }
          }
        }
      ]
    },
    "instructor": null,
    "advisor": null
  }
}
```

The response may contain any assigned institutional roles: `student`, `instructor`, `advisor`, `staff`, `academic_admin`, `registrar_admin`, or `system_admin`. Inapplicable profile objects are `null`; a student with no associated programs receives an empty `programs` array. Account status is deliberately omitted from this authentication response.

Credential failures—including an unknown identifier, wrong password, inactive account, or suspended account—return the same `401 INVALID_CREDENTIALS` response to limit account discovery.

### GET `/members/:userId`

Returns the named member's identity, account status, institutional roles, and applicable student, instructor, or advisor profile. This endpoint does not verify the member's password.

#### Path parameter

`userId` is a 1–20 character SIS user ID containing letters, digits, periods, underscores, or hyphens; its first character must be alphanumeric.

#### Request

```bash
curl --request GET \
  --url http://localhost:5000/api/v1/members/DEVADM001 \
  --header "Authorization: Bearer <SIS_SERVICE_API_KEY>"
```

#### Successful response — `200 OK`

```json
{
  "data": {
    "userId": "DEVADM001",
    "email": "dev.multirole@example.invalid",
    "firstName": "Dev",
    "lastName": "MultiRole",
    "roles": ["academic_admin", "advisor", "instructor"],
    "student": null,
    "instructor": {
      "hireDate": "2026-01-14T22:00:00.000Z",
      "department": {
        "id": 2,
        "code": "DEVTEST",
        "name": "Development Test Department",
        "faculty": { "id": 2, "code": "DEVTEST", "name": "Development Test Faculty" }
      }
    },
    "advisor": {
      "department": {
        "id": 2,
        "code": "DEVTEST",
        "name": "Development Test Department",
        "faculty": { "id": 2, "code": "DEVTEST", "name": "Development Test Faculty" }
      }
    },
    "accountStatus": "active"
  }
}
```

Student profiles include the primary campus and zero or more programs. Each program includes its department and faculty. Instructor and advisor profiles include their department and faculty. Members may hold multiple roles simultaneously.

### Error response shape

```json
{
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Invalid SIS credentials."
  }
}
```

Validation errors may also include a `details` array.

## Error Handling

| HTTP status | Error code | When returned |
| --- | --- | --- |
| `400` | `VALIDATION_ERROR` | Invalid request body, unknown request fields, or malformed SIS user ID |
| `400` | `INVALID_JSON` | Request body is not valid JSON |
| `401` | `SERVICE_UNAUTHORIZED` | Missing or invalid bearer service credential |
| `401` | `INVALID_CREDENTIALS` | Unknown member, wrong password, invalid hash, or non-active account during verification |
| `404` | `MEMBER_NOT_FOUND` | No member exists for the requested user ID |
| `404` | `ROUTE_NOT_FOUND` | No route matches the request |
| `413` | `PAYLOAD_TOO_LARGE` | JSON body exceeds the 16 KiB limit |
| `429` | `AUTH_RATE_LIMITED` | Too many verification attempts for the IP and normalized identifier |
| `500` | `INTERNAL_ERROR` | Unexpected server error; internal details are not exposed |

Rate-limited responses include a `Retry-After` header. Successful endpoint responses include `Cache-Control: no-store`.

## Environment Configuration

Create `.env` from `.env.example`. Use placeholders locally and store production values in a protected secret manager.

```env
PORT=5000

DB_HOST=127.0.0.1
DB_PORT=5432
DB_NAME=sis_db
DB_USER=postgres
DB_PASSWORD=<local-database-password>

SIS_SERVICE_API_KEY=<43-to-128-character-base64url-secret>

# Optional rate-limit overrides
# AUTH_RATE_LIMIT_MAX_ATTEMPTS=10
# AUTH_RATE_LIMIT_WINDOW_MS=900000

# Optional URL-based connection; takes precedence over DB_* connection fields
# DATABASE_URL=postgresql://user:password@host:5432/sis_db
# DB_SSL=false
# DB_SSL_REJECT_UNAUTHORIZED=true
```

Generate a suitable service key with `node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"`. Never display or commit a real project secret.

`PORT` defaults to `5000`. When `DATABASE_URL` is absent, `DB_HOST`, `DB_NAME`, `DB_USER`, and `DB_PASSWORD` are required; `DB_PORT` defaults to `5432`.

## Local Setup

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env`; set the local PostgreSQL credentials and a generated `SIS_SERVICE_API_KEY`.
3. Create an empty `sis_db` database, then apply the schema with `psql -U postgres -d sis_db -f database/migrations/001_initial_schema.sql`.
4. Verify connectivity and the expected schema with `npm run db:check`.
5. Start the API with `npm run dev`, or use `npm start` without file watching.

Run the automated test suite with `npm test`.

## Render Deployment

The production service uses Render's Node.js runtime from the `main` branch with `node src/server.js` as its start command. Configure `DATABASE_URL` and `SIS_SERVICE_API_KEY` in the Render environment; optional SSL settings remain available through `DB_SSL` and `DB_SSL_REJECT_UNAUTHORIZED`.

The server reads Render's assigned `PORT` and listens on the platform-accessible default interface. Production does not require a local `.env` file, and the development seed is restricted to an explicitly local PostgreSQL host.

## Project Structure

```text
SIS-API/
├── database/
│   └── migrations/        # PostgreSQL schema
├── docs/assets/           # Architecture and authentication SVGs
├── scripts/               # Database check and guarded development seed
├── src/
│   ├── config/            # PostgreSQL and service-key configuration
│   ├── modules/
│   │   ├── auth/          # Credential verification
│   │   └── members/       # Member profile retrieval
│   └── shared/            # Errors and HTTP middleware
└── test/                  # Unit and HTTP integration tests
```

## Security

- Bearer service credentials are validated with constant-time digest comparison and must be high-entropy base64url values.
- SIS passwords are stored as bcrypt hashes; plaintext hashes are rejected, and unknown-user checks perform a dummy bcrypt comparison.
- Credential failures use one generic response to reduce account enumeration.
- Request validation rejects malformed and unknown fields, and JSON bodies are limited to 16 KiB.
- All database values are supplied through parameterized PostgreSQL queries.
- Credential verification is rate-limited by client IP and normalized identifier; defaults are 10 attempts per 15 minutes and successful requests clear the matching counter.
- Response DTOs exclude password hashes, database credentials, service secrets, and unrelated academic records.
- Successful data responses disable caching, and Express does not expose its `X-Powered-By` header.

The `SIS_SERVICE_API_KEY` is a backend-to-backend secret. Keep it only on trusted Balamandian server infrastructure—never commit it, log it, expose it to browsers, or embed it in the mobile application.
