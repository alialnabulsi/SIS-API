'use strict';

require('dotenv').config({ quiet: true });

const {
  closePool,
  formatDatabaseError,
  getPool,
} = require('../src/config/database');

const EXPECTED_TABLE_COUNT = 25;
const ESSENTIAL_TABLES = ['sis_user', 'sis_role', 'sis_user_role', 'campus'];

async function checkDatabase() {
  let client;
  let transactionStarted = false;

  try {
    client = await getPool().connect();
    await client.query('BEGIN READ ONLY');
    transactionStarted = true;

    await client.query('SELECT 1 AS connection_test');

    const metadataResult = await client.query(
      'SELECT current_database() AS database_name, current_schema() AS schema_name'
    );
    const tableResult = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = current_schema()
        AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);

    await client.query('COMMIT');
    transactionStarted = false;

    const { database_name: databaseName, schema_name: schemaName } =
      metadataResult.rows[0];
    const tableNames = tableResult.rows.map(({ table_name: tableName }) => tableName);
    const missingEssentialTables = ESSENTIAL_TABLES.filter(
      (tableName) => !tableNames.includes(tableName)
    );
    const hasExpectedCount = tableNames.length === EXPECTED_TABLE_COUNT;

    console.log(`Connected database: ${databaseName}`);
    console.log(`Checked schema: ${schemaName}`);
    console.log(`Base tables found: ${tableNames.length}/${EXPECTED_TABLE_COUNT}`);

    if (!hasExpectedCount || missingEssentialTables.length > 0) {
      if (!hasExpectedCount) {
        console.error(
          `Schema mismatch: expected ${EXPECTED_TABLE_COUNT} base tables, found ${tableNames.length}.`
        );
      }

      if (missingEssentialTables.length > 0) {
        console.error(
          `Missing essential tables: ${missingEssentialTables.join(', ')}`
        );
      }

      console.error(`Tables found: ${tableNames.join(', ') || '(none)'}`);
      process.exitCode = 1;
      return;
    }

    console.log('Database connection and SIS schema verification succeeded.');
  } catch (error) {
    if (client && transactionStarted) {
      try {
        await client.query('ROLLBACK');
      } catch {
        // The original connection error is more useful than a rollback failure.
      }
    }

    console.error(`Database verification failed: ${formatDatabaseError(error)}`);
    process.exitCode = 1;
  } finally {
    client?.release();

    try {
      await closePool();
    } catch (error) {
      console.error(`Failed to close the database pool: ${formatDatabaseError(error)}`);
      process.exitCode = 1;
    }
  }
}

function handleFatalError(error) {
  console.error(`Database verification terminated: ${formatDatabaseError(error)}`);
  process.exit(1);
}

process.once('uncaughtException', handleFatalError);
process.once('unhandledRejection', handleFatalError);

void checkDatabase();
