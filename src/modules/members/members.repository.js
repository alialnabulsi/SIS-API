'use strict';

const { query } = require('../../config/database');

function createMembersRepository(databaseQuery = query) {
  return {
    async findUserById(userId) {
      const result = await databaseQuery(
        `SELECT user_id, email, first_name, last_name, account_status
         FROM sis_user
         WHERE user_id = $1`,
        [userId]
      );

      return result.rows[0] || null;
    },

    async findRoles(userId) {
      const result = await databaseQuery(
        `SELECT role_code
         FROM sis_user_role
         WHERE user_id = $1
         ORDER BY role_code`,
        [userId]
      );

      return result.rows;
    },

    async findStudent(userId) {
      const result = await databaseQuery(
        `SELECT s.academic_status, s.admission_year,
                c.campus_id, c.campus_code, c.name AS campus_name
         FROM student s
         JOIN campus c ON c.campus_id = s.campus_id
         WHERE s.user_id = $1`,
        [userId]
      );

      return result.rows[0] || null;
    },

    async findStudentPrograms(userId) {
      const result = await databaseQuery(
        `SELECT p.program_id, p.program_code, p.name AS program_name,
                p.degree_level, sp.program_status, sp.declared_on,
                d.department_id, d.department_code, d.name AS department_name,
                f.faculty_id, f.faculty_code, f.name AS faculty_name
         FROM student_program sp
         JOIN program p ON p.program_id = sp.program_id
         JOIN department d ON d.department_id = p.department_id
         JOIN faculty f ON f.faculty_id = d.faculty_id
         WHERE sp.student_user_id = $1
         ORDER BY p.program_code`,
        [userId]
      );

      return result.rows;
    },

    async findInstructor(userId) {
      const result = await databaseQuery(
        `SELECT i.hire_date,
                d.department_id, d.department_code, d.name AS department_name,
                f.faculty_id, f.faculty_code, f.name AS faculty_name
         FROM instructor i
         JOIN department d ON d.department_id = i.department_id
         JOIN faculty f ON f.faculty_id = d.faculty_id
         WHERE i.user_id = $1`,
        [userId]
      );

      return result.rows[0] || null;
    },

    async findAdvisor(userId) {
      const result = await databaseQuery(
        `SELECT d.department_id, d.department_code, d.name AS department_name,
                f.faculty_id, f.faculty_code, f.name AS faculty_name
         FROM advisor a
         JOIN department d ON d.department_id = a.department_id
         JOIN faculty f ON f.faculty_id = d.faculty_id
         WHERE a.user_id = $1`,
        [userId]
      );

      return result.rows[0] || null;
    },
  };
}

module.exports = createMembersRepository();
module.exports.createMembersRepository = createMembersRepository;
