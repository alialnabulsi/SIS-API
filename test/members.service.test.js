'use strict';

const assert = require('node:assert/strict');
const { test } = require('node:test');

const { createMembersService } = require('../src/modules/members/members.service');

function repositoryWith(overrides = {}) {
  return {
    findUserById: async () => ({
      user_id: 'DEVSTU001',
      email: 'dev.student@example.invalid',
      first_name: 'Dev',
      last_name: 'Student',
      account_status: 'active',
    }),
    findRoles: async () => [{ role_code: 'student' }],
    findStudent: async () => null,
    findStudentPrograms: async () => [],
    findInstructor: async () => null,
    findAdvisor: async () => null,
    ...overrides,
  };
}

test('maps a student campus, program, department, and faculty', async () => {
  const service = createMembersService(repositoryWith({
    findStudent: async () => ({
      academic_status: 'active',
      admission_year: 2026,
      campus_id: 1,
      campus_code: 'MAIN',
      campus_name: 'Main Campus',
    }),
    findStudentPrograms: async () => [{
      program_id: 10,
      program_code: 'BS-CS',
      program_name: 'Computer Science',
      degree_level: 'bachelor',
      program_status: 'active',
      declared_on: '2026-09-01',
      department_id: 4,
      department_code: 'CS',
      department_name: 'Computer Science',
      faculty_id: 2,
      faculty_code: 'FAS',
      faculty_name: 'Arts and Sciences',
    }],
  }));

  const member = await service.getByUserId('DEVSTU001', {
    includeAccountStatus: true,
  });

  assert.equal(member.accountStatus, 'active');
  assert.deepEqual(member.student.primaryCampus, {
    id: 1,
    code: 'MAIN',
    name: 'Main Campus',
  });
  assert.equal(member.student.programs[0].department.faculty.code, 'FAS');
  assert.equal(member.instructor, null);
  assert.equal(member.advisor, null);
});

test('maps multiple roles and both instructor and advisor profiles', async () => {
  const departmentRow = {
    department_id: 4,
    department_code: 'CS',
    department_name: 'Computer Science',
    faculty_id: 2,
    faculty_code: 'FAS',
    faculty_name: 'Arts and Sciences',
  };
  const service = createMembersService(repositoryWith({
    findRoles: async () => [
      { role_code: 'academic_admin' },
      { role_code: 'advisor' },
      { role_code: 'instructor' },
    ],
    findInstructor: async () => ({ ...departmentRow, hire_date: '2026-01-15' }),
    findAdvisor: async () => departmentRow,
  }));

  const member = await service.getByUserId('DEVADM001');

  assert.deepEqual(member.roles, ['academic_admin', 'advisor', 'instructor']);
  assert.equal(member.student, null);
  assert.equal(member.instructor.department.code, 'CS');
  assert.equal(member.advisor.department.faculty.code, 'FAS');
  assert.equal('accountStatus' in member, false);
});

test('returns null academic profiles and empty roles for a basic member', async () => {
  const service = createMembersService(repositoryWith({ findRoles: async () => [] }));
  const member = await service.getByUserId('DEVSTU001');

  assert.deepEqual(member.roles, []);
  assert.equal(member.student, null);
  assert.equal(member.instructor, null);
  assert.equal(member.advisor, null);
});

test('reports an unknown member without querying subtype data', async () => {
  let subtypeQueried = false;
  const service = createMembersService(repositoryWith({
    findUserById: async () => null,
    findRoles: async () => {
      subtypeQueried = true;
      return [];
    },
  }));

  await assert.rejects(
    service.getByUserId('UNKNOWN001'),
    (error) => error.statusCode === 404 && error.code === 'MEMBER_NOT_FOUND'
  );
  assert.equal(subtypeQueried, false);
});
