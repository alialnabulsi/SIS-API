# SIS API

A standalone, modular Student Information System REST API backend for the Balamandian senior project.

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Configure the server port using `.env.example` as a reference.

3. Start the server:

   ```bash
   npm start
   ```

For development with automatic restarts:

```bash
npm run dev
```

## Current status

Phase 1 provides only the minimal Express application and modular folder structure. No API endpoints, business logic, authentication, or database integration have been implemented. PostgreSQL is planned for a future phase but is not configured or connected yet.
