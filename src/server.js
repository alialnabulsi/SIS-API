'use strict';

require('dotenv').config({ quiet: true });

const app = require('./app');
const {
  closePool,
  formatDatabaseError,
  testConnection,
} = require('./config/database');

let server;
let isShuttingDown = false;

function getPort() {
  const port = Number(process.env.PORT || 5000);

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('PORT must be an integer between 1 and 65535.');
  }

  return port;
}

function listen(port) {
  return new Promise((resolve, reject) => {
    const httpServer = app.listen(port);

    httpServer.once('error', reject);
    httpServer.once('listening', () => {
      httpServer.removeListener('error', reject);
      resolve(httpServer);
    });
  });
}

function closeHttpServer() {
  if (!server) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    server.close((error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });
}

async function shutDown(signal) {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;
  console.log(`${signal} received; shutting down.`);

  try {
    await closeHttpServer();
    await closePool();
  } catch (error) {
    console.error(`Shutdown failed: ${formatDatabaseError(error)}`);
    process.exitCode = 1;
  }
}

async function start() {
  try {
    const port = getPort();

    await testConnection();
    server = await listen(port);

    console.log(`SIS API listening on port ${port}; PostgreSQL connected.`);
  } catch (error) {
    console.error(`SIS API startup failed: ${formatDatabaseError(error)}`);

    try {
      await closePool();
    } catch (closeError) {
      console.error(
        `Failed to close the database pool: ${formatDatabaseError(closeError)}`
      );
    }

    process.exitCode = 1;
  }
}

function handleFatalError(error) {
  console.error(`SIS API terminated: ${formatDatabaseError(error)}`);
  process.exit(1);
}

process.once('SIGINT', () => {
  void shutDown('SIGINT');
});

process.once('SIGTERM', () => {
  void shutDown('SIGTERM');
});

process.once('uncaughtException', handleFatalError);
process.once('unhandledRejection', handleFatalError);

void start();
