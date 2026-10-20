# SIS API

A standalone, modular Student Information System REST API backend for the Balamandian senior project. The current phase provides Express 5 with a reusable PostgreSQL connection pool; it does not include endpoints or business logic.

## Local setup

1. Install Node.js and PostgreSQL, then ensure the approved 25-table SIS schema exists in a local database named `sis_db`.
2. Run `npm install`.
3. Copy the variable names from `.env.example` into your existing `.env` and supply the local PostgreSQL password. Do not commit `.env`.
4. Verify connectivity and the existing schema with `npm run db:check`.
5. Start the API with `npm start`, or use `npm run dev` for automatic restarts.

The server performs `SELECT 1` before listening and exits cleanly if PostgreSQL is unavailable. The verification command uses read-only SQL, expects 25 base tables in the active schema, and checks for `sis_user`, `sis_role`, `sis_user_role`, and `campus`.

## Configuration

Local connections use `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, and `DB_PASSWORD`. `PORT` defaults to `5000`. A non-empty `DATABASE_URL` takes precedence for future hosted deployments. Set `DB_SSL=true` when a provider requires TLS; certificate verification remains enabled unless `DB_SSL_REJECT_UNAUTHORIZED=false` is explicitly configured.

Common failures are an inactive PostgreSQL service, an incorrect port or password, a missing `sis_db` database, or a database user without access. Correct the local `.env` values or PostgreSQL permissions rather than weakening authentication or TLS settings.

## Schema status

The approved PostgreSQL schema has already been applied externally and is not executed by this application. Its SQL file is not currently present in the repository and must be added separately under `database/migrations/` when provided.
