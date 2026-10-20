'use strict';

const { Pool } = require('pg');

const DEFAULT_CONNECTION_TIMEOUT_MS = 5000;
const DEFAULT_IDLE_TIMEOUT_MS = 30000;
const DEFAULT_POOL_SIZE = 10;

let pool;

function readRequiredValue(environment, name) {
  const value = environment[name];

  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`Missing required database configuration: ${name}`);
  }

  return value.trim();
}

function readInteger(environment, name, defaultValue) {
  const rawValue = environment[name];

  if (rawValue === undefined || rawValue === '') {
    return defaultValue;
  }

  const value = Number(rawValue);

  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`${name} must be a positive integer.`);
  }

  return value;
}

function readBoolean(environment, name, defaultValue) {
  const rawValue = environment[name];

  if (rawValue === undefined || rawValue === '') {
    return defaultValue;
  }

  if (rawValue === 'true') {
    return true;
  }

  if (rawValue === 'false') {
    return false;
  }

  throw new Error(`${name} must be either true or false.`);
}

function createPoolConfig(environment = process.env) {
  const databaseUrl = environment.DATABASE_URL?.trim();
  const sslEnabled = readBoolean(environment, 'DB_SSL', false);
  const ssl = sslEnabled
    ? {
        rejectUnauthorized: readBoolean(
          environment,
          'DB_SSL_REJECT_UNAUTHORIZED',
          true
        ),
      }
    : undefined;

  const commonConfig = {
    connectionTimeoutMillis: readInteger(
      environment,
      'DB_CONNECTION_TIMEOUT_MS',
      DEFAULT_CONNECTION_TIMEOUT_MS
    ),
    idleTimeoutMillis: readInteger(
      environment,
      'DB_IDLE_TIMEOUT_MS',
      DEFAULT_IDLE_TIMEOUT_MS
    ),
    max: readInteger(environment, 'DB_POOL_MAX', DEFAULT_POOL_SIZE),
  };

  if (databaseUrl) {
    let parsedUrl;

    try {
      parsedUrl = new URL(databaseUrl);
    } catch {
      throw new Error('DATABASE_URL must be a valid PostgreSQL URL.');
    }

    if (!['postgres:', 'postgresql:'].includes(parsedUrl.protocol)) {
      throw new Error('DATABASE_URL must use the postgres or postgresql protocol.');
    }

    return {
      ...commonConfig,
      connectionString: databaseUrl,
      ...(ssl ? { ssl } : {}),
    };
  }

  if (!Object.prototype.hasOwnProperty.call(environment, 'DB_PASSWORD')) {
    throw new Error('Missing required database configuration: DB_PASSWORD');
  }

  return {
    ...commonConfig,
    host: readRequiredValue(environment, 'DB_HOST'),
    port: readInteger(environment, 'DB_PORT', 5432),
    database: readRequiredValue(environment, 'DB_NAME'),
    user: readRequiredValue(environment, 'DB_USER'),
    password: environment.DB_PASSWORD,
    ...(ssl ? { ssl } : {}),
  };
}

function formatDatabaseError(error) {
  const code = error && error.code ? ` (${error.code})` : '';
  let message = error && error.message ? error.message : 'Unknown database error.';

  const secrets = [process.env.DATABASE_URL, process.env.DB_PASSWORD].filter(Boolean);

  for (const secret of secrets) {
    message = message.replaceAll(secret, '[redacted]');
  }

  message = message.replace(
    /postgres(?:ql)?:\/\/[^\s]+/gi,
    '[redacted database URL]'
  );

  return `${message}${code}`;
}

function getPool() {
  if (!pool) {
    pool = new Pool(createPoolConfig());
    pool.on('error', (error) => {
      console.error(`Unexpected PostgreSQL pool error: ${formatDatabaseError(error)}`);
    });
  }

  return pool;
}

function query(text, parameters = []) {
  return getPool().query(text, parameters);
}

async function testConnection() {
  await query('SELECT 1 AS connection_test');
}

async function closePool() {
  if (pool) {
    const activePool = pool;
    pool = undefined;
    await activePool.end();
  }
}

module.exports = {
  closePool,
  formatDatabaseError,
  getPool,
  query,
  testConnection,
};
