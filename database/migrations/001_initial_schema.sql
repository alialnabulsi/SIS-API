-- ============================================================================
-- BALAMANDIAN | MOCK STUDENT INFORMATION SYSTEM (SIS)
-- PostgreSQL 16+ | Initial schema for a NEW, EMPTY database
-- ============================================================================
-- Purpose:
--   SIS is the source of truth for institutional identities, credentials, roles,
--   primary student campus, and academic records. The separate Balamandian
--   backend verifies SIS identity and manages its OWN account, email OTP,
--   sessions, and app-specific admin permissions in its own database.
--
-- Safe rollout:
--   * Run once on a new, empty LOCAL PostgreSQL database.
--   * This is an initial schema, NOT a migration of an existing MariaDB DB.
--   * Maintain future changes as versioned incremental migrations.
--   * No test users or passwords are inserted here; create those using a
--     separate seed script and Argon2id or bcrypt hashes in backend code.
--   * Use a dedicated least-privilege DB account for the SIS backend.
--   * Keep DB credentials server-side. Never connect mobile clients to SIS DB.
--   * Do NOT execute this against production or Railway without review.
--
-- Role model:
--   * One sis_user may have MANY SIS roles, recorded in sis_user_role.
--   * SIS application roles are NOT PostgreSQL database login roles.
--   * Member classifications: student, instructor, advisor, staff.
--   * Elevated SIS-only roles: academic_admin, registrar_admin, system_admin.
--   * Student/instructor/advisor subtype rows require the corresponding role
--     assignment, enforced by a composite foreign key and a fixed role_code.
--   * Assignment of such a role without its subtype must be completed by
--     SIS backend logic in the SAME TRANSACTION when academic data is needed.
--   * These roles do NOT grant Balamandian app administrator privileges.
--
-- Campus model:
--   * student.campus_id is the student's authoritative PRIMARY campus.
--   * section.campus_id is the campus hosting a section.
--   * room_label labels are unique WITHIN a campus, not across all campuses.
--   * Composite FKs prevent meetings/exams using rooms on a different campus.
--   * No building polygons, indoor maps, or GPS data belong in SIS.
--
-- Time handling:
--   * Audit timestamps and scheduled exams are TIMESTAMPTZ (absolute instants).
--   * Weekly meeting TIME values are campus-local wall-clock times.
--   * Set database session timezone to UTC in server config; display meetings
--     in the related campus time_zone.
-- ============================================================================

BEGIN;

-- --------------------------------- CAMPUSES --------------------------------
CREATE TABLE campus (
    campus_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    campus_code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    city VARCHAR(100),
    country_code VARCHAR(2) NOT NULL DEFAULT 'LB',
    time_zone VARCHAR(64) NOT NULL DEFAULT 'Asia/Beirut',
    CONSTRAINT chk_campus_code_not_blank CHECK (length(btrim(campus_code)) > 0),
    CONSTRAINT chk_campus_name_not_blank CHECK (length(btrim(name)) > 0),
    CONSTRAINT chk_campus_country_code CHECK (country_code ~ '^[A-Z]{2}$')
);

-- ------------------------------ USERS & ROLES ------------------------------
CREATE TABLE sis_user (
    user_id VARCHAR(20) PRIMARY KEY, -- Official immutable SIS ID, e.g. A2311608
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(254) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    account_status VARCHAR(16) NOT NULL DEFAULT 'active',
    profile_picture_url VARCHAR(1024),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_login_at TIMESTAMPTZ,
    CONSTRAINT chk_sis_user_status
        CHECK (account_status IN ('active', 'inactive', 'suspended')),
    CONSTRAINT chk_sis_user_id_not_blank CHECK (length(btrim(user_id)) > 0),
    CONSTRAINT chk_sis_user_email_not_blank CHECK (length(btrim(email)) > 0),
    CONSTRAINT chk_sis_user_email_trimmed CHECK (email = btrim(email)),
    CONSTRAINT chk_sis_user_first_name CHECK (length(btrim(first_name)) > 0),
    CONSTRAINT chk_sis_user_last_name CHECK (length(btrim(last_name)) > 0)
);

-- A normal UNIQUE(email) index is case-sensitive in PostgreSQL.
-- The expression index makes identity lookups and uniqueness case-insensitive.
CREATE UNIQUE INDEX uq_sis_user_email_ci ON sis_user (lower(email));

CREATE TABLE sis_role (
    role_code VARCHAR(40) PRIMARY KEY,
    category VARCHAR(10) NOT NULL,
    description VARCHAR(255) NOT NULL,
    CONSTRAINT chk_role_category CHECK (category IN ('member', 'admin'))
);

CREATE TABLE sis_user_role (
    user_id VARCHAR(20) NOT NULL,
    role_code VARCHAR(40) NOT NULL,
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, role_code),
    CONSTRAINT fk_user_role_user FOREIGN KEY (user_id)
        REFERENCES sis_user (user_id) ON DELETE RESTRICT,
    CONSTRAINT fk_user_role_role FOREIGN KEY (role_code)
        REFERENCES sis_role (role_code) ON DELETE RESTRICT
);
CREATE INDEX idx_user_role_role ON sis_user_role (role_code);

-- Automatic timestamps; values are maintained by the DB on update.
CREATE FUNCTION set_sis_updated_at() RETURNS TRIGGER
LANGUAGE plpgsql AS $$
BEGIN
    NEW.updated_at := now();
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_sis_user_updated_at
BEFORE UPDATE ON sis_user
FOR EACH ROW EXECUTE FUNCTION set_sis_updated_at();

-- --------------------------- ACADEMIC ORGANIZATION -------------------------
CREATE TABLE faculty (
    faculty_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    faculty_code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL UNIQUE
);

CREATE TABLE department (
    department_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    faculty_id INTEGER NOT NULL REFERENCES faculty (faculty_id) ON DELETE RESTRICT,
    department_code VARCHAR(20) NOT NULL,
    name VARCHAR(150) NOT NULL,
    contact_email VARCHAR(254),
    CONSTRAINT uq_department_faculty_code UNIQUE (faculty_id, department_code),
    CONSTRAINT uq_department_faculty_name UNIQUE (faculty_id, name)
);
CREATE INDEX idx_department_faculty ON department (faculty_id);

CREATE TABLE major (
    major_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    department_id INTEGER NOT NULL REFERENCES department (department_id) ON DELETE RESTRICT,
    name VARCHAR(150) NOT NULL,
    CONSTRAINT uq_major_department_name UNIQUE (department_id, name),
    -- Supporting composite FK to ensure a program major belongs to its department
    CONSTRAINT uq_major_id_department UNIQUE (major_id, department_id)
);
CREATE INDEX idx_major_department ON major (department_id);

CREATE TABLE minor (
    minor_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    department_id INTEGER NOT NULL REFERENCES department (department_id) ON DELETE RESTRICT,
    name VARCHAR(150) NOT NULL,
    CONSTRAINT uq_minor_department_name UNIQUE (department_id, name)
);
CREATE INDEX idx_minor_department ON minor (department_id);

CREATE TABLE program (
    program_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    program_code VARCHAR(30) NOT NULL UNIQUE,
    department_id INTEGER NOT NULL REFERENCES department (department_id) ON DELETE RESTRICT,
    major_id INTEGER,
    name VARCHAR(150) NOT NULL,
    degree_level VARCHAR(16) NOT NULL,
    requirements TEXT,
    CONSTRAINT chk_program_degree CHECK (
        degree_level IN ('certificate', 'diploma', 'bachelor', 'master', 'doctorate')
    ),
    CONSTRAINT fk_program_major_same_department FOREIGN KEY (major_id, department_id)
        REFERENCES major (major_id, department_id) ON DELETE RESTRICT
);
CREATE INDEX idx_program_department ON program (department_id);
CREATE INDEX idx_program_major_department ON program (major_id, department_id);

-- -------------------------- MEMBER ACADEMIC DATA ---------------------------
-- Fixed role_code + composite FK guarantees a subtype has its required role.
-- Create user -> sis_user_role -> subtype in one backend transaction.
CREATE TABLE instructor (
    user_id VARCHAR(20) PRIMARY KEY,
    role_code VARCHAR(40) NOT NULL DEFAULT 'instructor',
    department_id INTEGER NOT NULL REFERENCES department (department_id) ON DELETE RESTRICT,
    hire_date DATE,
    CONSTRAINT chk_instructor_role CHECK (role_code = 'instructor'),
    CONSTRAINT fk_instructor_role FOREIGN KEY (user_id, role_code)
        REFERENCES sis_user_role (user_id, role_code) ON DELETE RESTRICT
);
CREATE INDEX idx_instructor_department ON instructor (department_id);

CREATE TABLE advisor (
    user_id VARCHAR(20) PRIMARY KEY,
    role_code VARCHAR(40) NOT NULL DEFAULT 'advisor',
    department_id INTEGER NOT NULL REFERENCES department (department_id) ON DELETE RESTRICT,
    CONSTRAINT chk_advisor_role CHECK (role_code = 'advisor'),
    CONSTRAINT fk_advisor_role FOREIGN KEY (user_id, role_code)
        REFERENCES sis_user_role (user_id, role_code) ON DELETE RESTRICT
);
CREATE INDEX idx_advisor_department ON advisor (department_id);

CREATE TABLE student (
    user_id VARCHAR(20) PRIMARY KEY,
    role_code VARCHAR(40) NOT NULL DEFAULT 'student',
    campus_id INTEGER NOT NULL REFERENCES campus (campus_id) ON DELETE RESTRICT,
    advisor_user_id VARCHAR(20) REFERENCES advisor (user_id) ON DELETE SET NULL,
    admission_year SMALLINT NOT NULL,
    academic_status VARCHAR(16) NOT NULL DEFAULT 'active',
    CONSTRAINT chk_student_role CHECK (role_code = 'student'),
    CONSTRAINT chk_student_admission_year CHECK (admission_year BETWEEN 1950 AND 2200),
    CONSTRAINT chk_student_status CHECK (
        academic_status IN ('active', 'on_leave', 'graduated', 'withdrawn')
    ),
    CONSTRAINT fk_student_role FOREIGN KEY (user_id, role_code)
        REFERENCES sis_user_role (user_id, role_code) ON DELETE RESTRICT
);
CREATE INDEX idx_student_campus ON student (campus_id);
CREATE INDEX idx_student_advisor ON student (advisor_user_id);

CREATE TABLE student_program (
    student_user_id VARCHAR(20) NOT NULL REFERENCES student (user_id) ON DELETE RESTRICT,
    program_id INTEGER NOT NULL REFERENCES program (program_id) ON DELETE RESTRICT,
    program_status VARCHAR(16) NOT NULL DEFAULT 'active',
    declared_on DATE,
    PRIMARY KEY (student_user_id, program_id),
    CONSTRAINT chk_student_program_status CHECK (
        program_status IN ('active', 'completed', 'withdrawn')
    )
);
CREATE INDEX idx_student_program_program ON student_program (program_id);

CREATE TABLE student_minor (
    student_user_id VARCHAR(20) NOT NULL REFERENCES student (user_id) ON DELETE RESTRICT,
    minor_id INTEGER NOT NULL REFERENCES minor (minor_id) ON DELETE RESTRICT,
    PRIMARY KEY (student_user_id, minor_id)
);
CREATE INDEX idx_student_minor_minor ON student_minor (minor_id);

-- -------------------------------- CURRICULUM -------------------------------
CREATE TABLE course (
    course_code VARCHAR(20) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    credits NUMERIC(3,1) NOT NULL,
    CONSTRAINT chk_course_credits CHECK (credits BETWEEN 0 AND 10)
);

CREATE TABLE course_prerequisite (
    course_code VARCHAR(20) NOT NULL REFERENCES course (course_code) ON DELETE RESTRICT,
    required_course_code VARCHAR(20) NOT NULL REFERENCES course (course_code) ON DELETE RESTRICT,
    requirement_kind VARCHAR(16) NOT NULL DEFAULT 'prerequisite',
    PRIMARY KEY (course_code, required_course_code),
    CONSTRAINT chk_course_not_own_prerequisite CHECK (course_code <> required_course_code),
    CONSTRAINT chk_course_requirement_kind CHECK (
        requirement_kind IN ('prerequisite', 'corequisite')
    )
);
CREATE INDEX idx_course_prerequisite_required ON course_prerequisite (required_course_code);

CREATE TABLE program_course (
    program_id INTEGER NOT NULL REFERENCES program (program_id) ON DELETE RESTRICT,
    course_code VARCHAR(20) NOT NULL REFERENCES course (course_code) ON DELETE RESTRICT,
    requirement_type VARCHAR(16) NOT NULL DEFAULT 'required',
    PRIMARY KEY (program_id, course_code),
    CONSTRAINT chk_program_course_type CHECK (requirement_type IN ('required', 'elective'))
);
CREATE INDEX idx_program_course_course ON program_course (course_code);

-- ------------------------- SEMESTERS, ROOMS, CLASSES ------------------------
CREATE TABLE semester (
    semester_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    term VARCHAR(8) NOT NULL,
    academic_year SMALLINT NOT NULL, -- Calendar year of term, e.g. Fall 2026
    starts_on DATE,
    ends_on DATE,
    CONSTRAINT uq_semester_term_year UNIQUE (term, academic_year),
    CONSTRAINT chk_semester_term CHECK (term IN ('spring', 'summer', 'fall')),
    CONSTRAINT chk_semester_year CHECK (academic_year BETWEEN 1950 AND 2200),
    CONSTRAINT chk_semester_date_range CHECK (
        starts_on IS NULL OR ends_on IS NULL OR ends_on >= starts_on
    )
);

-- Labels only; actual building map/geometry lives in Balamandian.
-- A room code may repeat on different campuses.
CREATE TABLE room_label (
    campus_id INTEGER NOT NULL REFERENCES campus (campus_id) ON DELETE RESTRICT,
    room_code VARCHAR(50) NOT NULL,
    display_name VARCHAR(100),
    PRIMARY KEY (campus_id, room_code)
);

CREATE TABLE section (
    section_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    course_code VARCHAR(20) NOT NULL REFERENCES course (course_code) ON DELETE RESTRICT,
    semester_id INTEGER NOT NULL REFERENCES semester (semester_id) ON DELETE RESTRICT,
    campus_id INTEGER NOT NULL REFERENCES campus (campus_id) ON DELETE RESTRICT,
    section_number VARCHAR(12) NOT NULL,
    instructor_user_id VARCHAR(20) NOT NULL REFERENCES instructor (user_id) ON DELETE RESTRICT,
    capacity INTEGER NOT NULL,
    language VARCHAR(10) NOT NULL DEFAULT 'english',
    CONSTRAINT uq_section_course_sem_campus_number
        UNIQUE (course_code, semester_id, campus_id, section_number),
    CONSTRAINT uq_section_id_campus UNIQUE (section_id, campus_id),
    CONSTRAINT chk_section_capacity CHECK (capacity > 0),
    CONSTRAINT chk_section_language CHECK (language IN ('english', 'arabic', 'french'))
);
CREATE INDEX idx_section_semester_campus ON section (semester_id, campus_id);
CREATE INDEX idx_section_instructor ON section (instructor_user_id);

CREATE TABLE section_meeting (
    meeting_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    section_id BIGINT NOT NULL,
    campus_id INTEGER NOT NULL,
    room_code VARCHAR(50), -- NULL means online / to be assigned
    weekday VARCHAR(9) NOT NULL,
    starts_at TIME WITHOUT TIME ZONE NOT NULL,
    ends_at TIME WITHOUT TIME ZONE NOT NULL,
    meeting_type VARCHAR(16) NOT NULL DEFAULT 'lecture',
    CONSTRAINT uq_section_meeting_slot
        UNIQUE (section_id, weekday, starts_at, meeting_type),
    CONSTRAINT chk_section_meeting_weekday CHECK (
        weekday IN ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday')
    ),
    CONSTRAINT chk_section_meeting_type CHECK (
        meeting_type IN ('lecture', 'lab', 'tutorial', 'seminar', 'other')
    ),
    CONSTRAINT chk_section_meeting_time CHECK (ends_at > starts_at),
    CONSTRAINT fk_section_meeting_section_campus FOREIGN KEY (section_id, campus_id)
        REFERENCES section (section_id, campus_id) ON DELETE CASCADE,
    CONSTRAINT fk_section_meeting_room FOREIGN KEY (campus_id, room_code)
        REFERENCES room_label (campus_id, room_code) ON DELETE RESTRICT
);
CREATE INDEX idx_section_meeting_room_slot
    ON section_meeting (campus_id, room_code, weekday, starts_at);

CREATE TABLE enrollment (
    enrollment_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    student_user_id VARCHAR(20) NOT NULL REFERENCES student (user_id) ON DELETE RESTRICT,
    section_id BIGINT NOT NULL REFERENCES section (section_id) ON DELETE RESTRICT,
    enrollment_status VARCHAR(16) NOT NULL DEFAULT 'enrolled',
    enrolled_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    final_grade VARCHAR(8),
    CONSTRAINT uq_enrollment_student_section UNIQUE (student_user_id, section_id),
    CONSTRAINT chk_enrollment_status CHECK (
        enrollment_status IN ('enrolled', 'dropped', 'withdrawn', 'completed', 'failed', 'incomplete')
    )
);
CREATE INDEX idx_enrollment_section ON enrollment (section_id);

CREATE TABLE exam (
    exam_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    section_id BIGINT NOT NULL,
    campus_id INTEGER NOT NULL,
    room_code VARCHAR(50),
    exam_type VARCHAR(16) NOT NULL DEFAULT 'final',
    starts_at TIMESTAMPTZ NOT NULL,
    ends_at TIMESTAMPTZ NOT NULL,
    CONSTRAINT uq_exam_section_type_start UNIQUE (section_id, exam_type, starts_at),
    CONSTRAINT chk_exam_type CHECK (exam_type IN ('quiz', 'midterm', 'final', 'other')),
    CONSTRAINT chk_exam_time_range CHECK (ends_at > starts_at),
    CONSTRAINT fk_exam_section_campus FOREIGN KEY (section_id, campus_id)
        REFERENCES section (section_id, campus_id) ON DELETE CASCADE,
    CONSTRAINT fk_exam_room FOREIGN KEY (campus_id, room_code)
        REFERENCES room_label (campus_id, room_code) ON DELETE RESTRICT
);
CREATE INDEX idx_exam_room_starts ON exam (campus_id, room_code, starts_at);

-- ---------------------------------- HOLDS ----------------------------------
CREATE TABLE hold_type (
    hold_type_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(255)
);

CREATE TABLE student_hold (
    student_hold_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    student_user_id VARCHAR(20) NOT NULL REFERENCES student (user_id) ON DELETE RESTRICT,
    hold_type_id INTEGER NOT NULL REFERENCES hold_type (hold_type_id) ON DELETE RESTRICT,
    reason VARCHAR(255),
    placed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    released_at TIMESTAMPTZ,
    CONSTRAINT chk_student_hold_dates CHECK (
        released_at IS NULL OR released_at >= placed_at
    )
);
CREATE INDEX idx_student_hold_open ON student_hold (student_user_id, released_at);
CREATE INDEX idx_student_hold_type ON student_hold (hold_type_id);

-- ------------------------------ REFERENCE ROLES ----------------------------
-- Seed ONLY static role definitions. User accounts and password hashes should
-- be inserted in separate controlled, repeatable dev/test seed scripts.
INSERT INTO sis_role (role_code, category, description) VALUES
    ('student',         'member', 'University student with student academic records'),
    ('instructor',      'member', 'University instructor responsible for course sections'),
    ('advisor',         'member', 'Academic advisor assigned to student records'),
    ('staff',           'member', 'University staff member without an academic subtype'),
    ('academic_admin',  'admin',  'SIS academic administration permissions'),
    ('registrar_admin', 'admin',  'SIS registrar and enrollment administration permissions'),
    ('system_admin',    'admin',  'SIS system administration permissions');

COMMIT;

-- ============================================================================
-- APPLICATION RULES (ENFORCE IN SIS BACKEND, NOT BY AUTHENTICATION UI):
-- 1) An SIS login checks account_status and verifies the PASSWORD HASH; return
--    only a minimal, sanitized user DTO (never password_hash).
-- 2) Identify users by immutable user_id; email must be institutionally
--    assigned, unique, and cannot be changed through Balamandian.
-- 3) Create a subtype role and its subtype row in the same transaction.
-- 4) Existing SIS members sign up to Balamandian; Balamandian manages its
--    email OTP, own app account, sessions and its OWN application admin flag.
-- 5) Check prerequisites, course cycles, enrollment caps, academic holds,
--    eligibility, schedule overlaps and same-time student enrollment in code.
-- 6) Do not expose unrestricted SIS academic CRUD to Balamandian. Protect
--    server-to-server APIs and separately authorize SIS administrative APIs.
-- 7) Campus is an attribute of a student (primary campus) and of sections;
--    a student may attend a section at a different campus.
-- 8) A campus time_zone value is an IANA zone string; validate it in backend.
-- 9) Student/instructor/advisor role assignments should not be left without
--    matching subtype rows when those records are needed. Database FKs protect
--    subtype -> role; backend transaction logic completes role -> subtype.
-- 10) Run schema and seed tests locally before any hosted deployment.
-- ============================================================================
