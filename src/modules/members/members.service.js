'use strict';

const membersRepository = require('./members.repository');
const AppError = require('../../shared/errors/AppError');

function mapFaculty(row) {
  return {
    id: row.faculty_id,
    code: row.faculty_code,
    name: row.faculty_name,
  };
}

function mapDepartment(row) {
  return {
    id: row.department_id,
    code: row.department_code,
    name: row.department_name,
    faculty: mapFaculty(row),
  };
}

function createMembersService(repository = membersRepository) {
  return {
    async getByUserId(userId, options = {}) {
      const user = await repository.findUserById(userId);

      if (!user) {
        throw new AppError(404, 'MEMBER_NOT_FOUND', 'University member not found.');
      }

      const [roles, student, programs, instructor, advisor] = await Promise.all([
        repository.findRoles(userId),
        repository.findStudent(userId),
        repository.findStudentPrograms(userId),
        repository.findInstructor(userId),
        repository.findAdvisor(userId),
      ]);

      const member = {
        userId: user.user_id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        roles: roles.map(({ role_code: roleCode }) => roleCode),
        student: student
          ? {
              academicStatus: student.academic_status,
              admissionYear: student.admission_year,
              primaryCampus: {
                id: student.campus_id,
                code: student.campus_code,
                name: student.campus_name,
              },
              programs: programs.map((program) => ({
                id: program.program_id,
                code: program.program_code,
                name: program.program_name,
                degreeLevel: program.degree_level,
                status: program.program_status,
                declaredOn: program.declared_on,
                department: mapDepartment(program),
              })),
            }
          : null,
        instructor: instructor
          ? {
              hireDate: instructor.hire_date,
              department: mapDepartment(instructor),
            }
          : null,
        advisor: advisor
          ? {
              department: mapDepartment(advisor),
            }
          : null,
      };

      if (options.includeAccountStatus) {
        member.accountStatus = user.account_status;
      }

      return member;
    },
  };
}

module.exports = createMembersService();
module.exports.createMembersService = createMembersService;
