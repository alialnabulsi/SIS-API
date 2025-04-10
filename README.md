# Student Information System (SIS)

![License](https://img.shields.io/badge/license-ISC-blue.svg)

A comprehensive **Student Information System (SIS)** designed to manage students, courses, enrollments, schedules, and more. Built with **Node.js**, **Express**, and **MySQL**, this system provides a robust backend API for handling all aspects of student and academic management.

---

## Table of Contents
1. [Features](#features)
2. [Technologies Used](#technologies-used)
3. [Installation](#installation)
4. [Configuration](#configuration)
5. [API Endpoints](#api-endpoints)
6. [Usage](#usage)
7. [Contributing](#contributing)
8. [License](#license)
9. [Contact](#contact)

---

## Features
- **Student Management**: Add, update, delete, and view student details.
- **Course Management**: Manage courses, prerequisites, and programs.
- **Enrollment System**: Handle student enrollments and grades.
- **Schedule Management**: Manage class schedules, rooms, and final exams.
- **User Roles**: Admin, Advisor, Instructor, and Student roles with specific permissions.
- **Database Integration**: MySQL database for storing all data.
- **RESTful API**: Fully documented API endpoints for seamless integration.

---

## Technologies Used
- **Backend**: Node.js, Express.js
- **Database**: MySQL (with Sequelize ORM)
- **Validation**: Express Validator
- **Environment Management**: Dotenv
- **API Testing**: Postman 
- **Version Control**: Git

---

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/alialnabulsi/SIS-Project.git
   ```
2. Navigate to the project directory:
   ```bash
   cd SIS-Project
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up the database:
   - Import the SQL file provided in the database folder.
   - Update the database configuration in `.env`.

---

## Configuration
Create a `.env` file in the root directory and add the following environment variables:

```env
DB_HOST=your-database-host
DB_USER=your-database-user
DB_PASSWORD=your-database-password
DB_NAME=your-database-name
PORT=5000
```

---

## API Endpoints

### Students
- `GET /api/students` - Get all students.
- `POST /api/students` - Create a new student.
- `GET /api/students/:studentID` - Get a specific student by ID.
- `PUT /api/students/:studentID` - Update a student by ID.
- `DELETE /api/students/:studentID` - Delete a student by ID.

### Courses
- `GET /api/courses` - Get all courses.
- `POST /api/courses` - Create a new course.
- `GET /api/courses/:courseID` - Get a specific course by ID.
- `PUT /api/courses/:courseID` - Update a course by ID.
- `DELETE /api/courses/:courseID` - Delete a course by ID.

### Enrollments
- `GET /api/enrollments` - Get all enrollments.
- `POST /api/enrollments` - Create a new enrollment.
- `GET /api/enrollments/:enrollmentID` - Get a specific enrollment by ID.
- `PUT /api/enrollments/:enrollmentID` - Update an enrollment by ID.
- `DELETE /api/enrollments/:enrollmentID` - Delete an enrollment by ID.

### Schedules
- `GET /api/schedules` - Get all schedules.
- `POST /api/schedules` - Create a new schedule.
- `GET /api/schedules/:scheduleID` - Get a specific schedule by ID.
- `PUT /api/schedules/:scheduleID` - Update a schedule by ID.
- `DELETE /api/schedules/:scheduleID` - Delete a schedule by ID.

### Users
- `GET /api/users` - Get all users.
- `POST /api/users` - Create a new user.
- `GET /api/users/:userID` - Get a specific user by ID.
- `PUT /api/users/:userID` - Update a user by ID.
- `DELETE /api/users/:userID` - Delete a user by ID.

---

## Usage
1. Start the server:
   ```bash
   npm start
   ```
2. For development, use:
   ```bash
   npm run dev
   ```
3. Use an API testing tool like Postman or Insomnia to interact with the endpoints.
4. Refer to the API Endpoints section for available routes.

---

## Contributing
Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add your feature"
   ```
4. Push to the branch:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a pull request.

---

## License
This project is licensed under the ISC License. See the `LICENSE` file for details.

---

## Contact
For questions or feedback, feel free to reach out:

- **Author**: Ali Al Nabulsi  
- **GitHub**: [alialnabulsi](https://github.com/alialnabulsi)  
- **Email**: ali.alnabulsi@std.balamand.edu.lb  

---

