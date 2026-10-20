'use strict';

const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');

const seedSource = readFileSync(
  path.join(__dirname, '..', 'scripts', 'seed-development.js'),
  'utf8'
);

test('seed verification returns PostgreSQL DATE fields as date-only strings', () => {
  assert.match(seedSource, /declared_on::text AS declared_on/);
  assert.match(seedSource, /hire_date::text AS hire_date/);
});
