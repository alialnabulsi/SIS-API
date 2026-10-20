'use strict';

require('dotenv').config({ quiet: true });

const bcrypt = require('bcrypt');

const {
  closePool,
  formatDatabaseError,
  getPool,
} = require('../src/config/database');

const DATABASE_NAME = 'sis_db';
const LOCAL_HOSTS = new Set(['127.0.0.1', 'localhost', '::1']);
const BCRYPT_ROUNDS = 12;

const seedUsers = [
  {
    userId: 'DEVSTU001',
    email: 'dev.student@example.invalid',
    firstName: 'Dev',
    lastName: 'Student',
    roles: ['student'],
  },
  {
    userId: 'DEVINS001',
    email: 'dev.instructor@example.invalid',
    firstName: 'Dev',
    lastName: 'Instructor',
    roles: ['instructor'],
  },
  {
    userId: 'DEVADM001',
    email: 'dev.multirole@example.invalid',
    firstName: 'Dev',
    lastName: 'MultiRole',
    roles: ['instructor', 'advisor', 'academic_admin'],
  },
];

function validateSeedEnvironment() {
  if (process.env.NODE_ENV !== 'development') {
    throw new Error('Development seed requires NODE_ENV=development.');
  }

  if (process.env.DEV_SEED_CONFIRM !== DATABASE_NAME) {
    throw new Error(`Development seed requires DEV_SEED_CONFIRM=${DATABASE_NAME}.`);
  }

  if (process.env.DATABASE_URL || !LOCAL_HOSTS.has(process.env.DB_HOST)) {
    throw new Error('Development seed is restricted to an explicitly local DB_HOST.');
  }

  const password = process.env.DEV_SEED_PASSWORD;

  if (typeof password !== 'string' || password.length < 12) {
    throw new Error('DEV_SEED_PASSWORD must contain at least 12 characters.');
  }

  return password;
}

function assertMatchingRecord(record, expected, label) {
  if (!record) {
    throw new Error(`${label} could not be created or verified.`);
  }

  const matches = Object.entries(expected).every(
    ([key, value]) => record[key] === value
  );

  if (!matches) {
    throw new Error(`${label} conflicts with an existing database record.`);
  }
}

async function ensureReferences(client) {
  const campusValues = {
    campus_code: 'DEVTEST',
    name: 'Development Test Campus',
    city: 'Fictional City',
  };
  let campus = (
    await client.query(
      `SELECT campus_id, campus_code, name, city
       FROM campus
       WHERE campus_code = $1`,
      [campusValues.campus_code]
    )
  ).rows[0];

  if (campus) {
    assertMatchingRecord(campus, campusValues, 'Development campus');
  } else {
    campus = (
      await client.query(
        `INSERT INTO campus (campus_code, name, city)
         VALUES ($1, $2, $3)
         RETURNING campus_id, campus_code, name, city`,
        [campusValues.campus_code, campusValues.name, campusValues.city]
      )
    ).rows[0];
  }

  const facultyValues = {
    faculty_code: 'DEVTEST',
    name: 'Development Test Faculty',
  };
  let faculty = (
    await client.query(
      `SELECT faculty_id, faculty_code, name
       FROM faculty
       WHERE faculty_code = $1 OR name = $2`,
      [facultyValues.faculty_code, facultyValues.name]
    )
  ).rows[0];

  if (faculty) {
    assertMatchingRecord(faculty, facultyValues, 'Development faculty');
  } else {
    faculty = (
      await client.query(
        `INSERT INTO faculty (faculty_code, name)
         VALUES ($1, $2)
         RETURNING faculty_id, faculty_code, name`,
        [facultyValues.faculty_code, facultyValues.name]
      )
    ).rows[0];
  }

  const departmentValues = {
    faculty_id: faculty.faculty_id,
    department_code: 'DEVTEST',
    name: 'Development Test Department',
  };
  let department = (
    await client.query(
      `SELECT department_id, faculty_id, department_code, name
       FROM department
       WHERE faculty_id = $1
         AND (department_code = $2 OR name = $3)`,
      [
        departmentValues.faculty_id,
        departmentValues.department_code,
        departmentValues.name,
      ]
    )
  ).rows[0];

  if (department) {
    assertMatchingRecord(department, departmentValues, 'Development department');
  } else {
    department = (
      await client.query(
        `INSERT INTO department (faculty_id, department_code, name)
         VALUES ($1, $2, $3)
         RETURNING department_id, faculty_id, department_code, name`,
        [
          departmentValues.faculty_id,
          departmentValues.department_code,
          departmentValues.name,
        ]
      )
    ).rows[0];
  }

  const programValues = {
    program_code: 'DEV-BS',
    department_id: department.department_id,
    name: 'Development Test Bachelor Program',
    degree_level: 'bachelor',
  };
  let program = (
    await client.query(
      `SELECT program_id, program_code, department_id, name, degree_level
       FROM program
       WHERE program_code = $1`,
      [programValues.program_code]
    )
  ).rows[0];

  if (program) {
    assertMatchingRecord(program, programValues, 'Development program');
  } else {
    program = (
      await client.query(
        `INSERT INTO program (program_code, department_id, name, degree_level)
         VALUES ($1, $2, $3, $4)
         RETURNING program_id, program_code, department_id, name, degree_level`,
        [
          programValues.program_code,
          programValues.department_id,
          programValues.name,
          programValues.degree_level,
        ]
      )
    ).rows[0];
  }

  return {
    campusId: campus.campus_id,
    departmentId: department.department_id,
    programId: program.program_id,
  };
}

async function ensureUser(client, user, passwordHash) {
  const existing = (
    await client.query(
      `SELECT user_id, email, first_name, last_name, account_status, password_hash
       FROM sis_user
       WHERE user_id = $1 OR lower(email) = lower($2)`,
      [user.userId, user.email]
    )
  ).rows[0];
  const expected = {
    user_id: user.userId,
    email: user.email,
    first_name: user.firstName,
    last_name: user.lastName,
    account_status: 'active',
  };

  if (existing) {
    assertMatchingRecord(existing, expected, `Development user ${user.userId}`);

    if (!/^\$2[aby]\$\d{2}\$.{53}$/.test(existing.password_hash)) {
      throw new Error(
        `Development user ${user.userId} does not contain a bcrypt password hash.`
      );
    }
  } else {
    await client.query(
      `INSERT INTO sis_user
         (user_id, password_hash, email, first_name, last_name, account_status)
       VALUES ($1, $2, $3, $4, $5, 'active')`,
      [user.userId, passwordHash, user.email, user.firstName, user.lastName]
    );
  }

  for (const role of user.roles) {
    await client.query(
      `INSERT INTO sis_user_role (user_id, role_code)
       VALUES ($1, $2)
       ON CONFLICT (user_id, role_code) DO NOTHING`,
      [user.userId, role]
    );
  }
}

async function verifySubtype(client, table, userId, expected) {
  const result = await client.query(
    `SELECT * FROM ${table} WHERE user_id = $1`,
    [userId]
  );

  assertMatchingRecord(result.rows[0], expected, `${table} subtype for ${userId}`);
}

async function seedDevelopmentData() {
  const password = validateSeedEnvironment();
  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  const client = await getPool().connect();

  try {
    await client.query('BEGIN');

    const destination = await client.query(
      'SELECT current_database() AS database_name'
    );

    if (destination.rows[0].database_name !== DATABASE_NAME) {
      throw new Error(`Connected database must be ${DATABASE_NAME}.`);
    }

    const references = await ensureReferences(client);

    for (const user of seedUsers) {
      await ensureUser(client, user, passwordHash);
    }

    await client.query(
      `INSERT INTO student
         (user_id, campus_id, admission_year, academic_status)
       VALUES ($1, $2, $3, 'active')
       ON CONFLICT (user_id) DO NOTHING`,
      ['DEVSTU001', references.campusId, 2026]
    );
    await verifySubtype(client, 'student', 'DEVSTU001', {
      user_id: 'DEVSTU001',
      role_code: 'student',
      campus_id: references.campusId,
      advisor_user_id: null,
      admission_year: 2026,
      academic_status: 'active',
    });

    await client.query(
      `INSERT INTO student_program
         (student_user_id, program_id, program_status, declared_on)
       VALUES ($1, $2, 'active', DATE '2026-09-01')
       ON CONFLICT (student_user_id, program_id) DO NOTHING`,
      ['DEVSTU001', references.programId]
    );
    const studentProgram = (
      await client.query(
        `SELECT student_user_id, program_id, program_status,
                declared_on::text AS declared_on
         FROM student_program
         WHERE student_user_id = $1 AND program_id = $2`,
        ['DEVSTU001', references.programId]
      )
    ).rows[0];
    assertMatchingRecord(studentProgram, {
      student_user_id: 'DEVSTU001',
      program_id: references.programId,
      program_status: 'active',
      declared_on: '2026-09-01',
    }, 'Development student program');

    for (const userId of ['DEVINS001', 'DEVADM001']) {
      await client.query(
        `INSERT INTO instructor (user_id, department_id, hire_date)
         VALUES ($1, $2, DATE '2026-01-15')
         ON CONFLICT (user_id) DO NOTHING`,
        [userId, references.departmentId]
      );
      const instructor = (
        await client.query(
          `SELECT user_id, role_code, department_id,
                  hire_date::text AS hire_date
           FROM instructor
           WHERE user_id = $1`,
          [userId]
        )
      ).rows[0];
      assertMatchingRecord(instructor, {
        user_id: userId,
        role_code: 'instructor',
        department_id: references.departmentId,
        hire_date: '2026-01-15',
      }, `instructor subtype for ${userId}`);
    }

    await client.query(
      `INSERT INTO advisor (user_id, department_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id) DO NOTHING`,
      ['DEVADM001', references.departmentId]
    );
    await verifySubtype(client, 'advisor', 'DEVADM001', {
      user_id: 'DEVADM001',
      role_code: 'advisor',
      department_id: references.departmentId,
    });

    await client.query('COMMIT');
    console.log('Development SIS accounts seeded successfully.');
    console.log(`Seeded identifiers: ${seedUsers.map(({ userId }) => userId).join(', ')}`);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

seedDevelopmentData()
  .catch((error) => {
    console.error(`Development seed failed: ${formatDatabaseError(error)}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await closePool();
  });
