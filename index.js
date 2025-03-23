require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

//Import Routes
const adminRoute = require('./routes/adminRoute');
const advisorRoute = require('./routes/advisorRoute');
const buildingRoute = require('./routes/buildingRoute');
const campusRoute = require('./routes/campusRoute');
const courseProgramRoute = require('./routes/courseProgramRoute');
const courseRoute = require('./routes/courseRoute');
const departmentRoute = require('./routes/departmentRoute');
const enrollmentRoute = require('./routes/enrollmentRoute');
const facultyRoute = require('./routes/facultyRoute');
const finalExamRoute = require('./routes/finalExamRoute');
const finalExamScheduleRoute = require('./routes/finalExamScheduleRoute');
const holdRoute = require('./routes/holdRoute');
const instructorRoute = require('./routes/instructorRoute');
const locationRoute = require('./routes/locationRoute');
const majorRoute = require('./routes/majorRoute');
const minorRoute = require('./routes/minorRoute');
const phoneNumberRoute = require('./routes/phoneNumberRoute');
const prerequisiteRoute = require('./routes/prerequisiteRoute');
const programRoute = require('./routes/programRoute');
const roleRoute = require('./routes/roleRoute');
const roomRoute = require('./routes/roomRoute');
const scheduleRoute = require('./routes/scheduleRoute');
const sectionRoute = require('./routes/sectionRoute');
const semesterRoute = require('./routes/semesterRoute');
const studentHoldRoute = require('./routes/studentHoldRoute');
const studentRoute = require('./routes/studentRoute');
const userRoleRoute = require('./routes/userRoleRoute');
const userRoute = require('./routes/userRoute');



const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Use Routes
app.use('/api/admin', adminRoute);
app.use('/api/advisor', advisorRoute);
app.use('/api/building', buildingRoute);
app.use('/api/campus', campusRoute);
app.use('/api/course-program', courseProgramRoute);
app.use('/api/course', courseRoute);
app.use('/api/department', departmentRoute);
app.use('/api/enrollment', enrollmentRoute);
app.use('/api/faculty', facultyRoute);
app.use('/api/final-exam', finalExamRoute);
app.use('/api/final-exam-schedule', finalExamScheduleRoute);
app.use('/api/hold', holdRoute);
app.use('/api/instructor', instructorRoute);
app.use('/api/location', locationRoute);
app.use('/api/major', majorRoute);
app.use('/api/minor', minorRoute);
app.use('/api/phone-number', phoneNumberRoute);
app.use('/api/prerequisite', prerequisiteRoute);
app.use('/api/program', programRoute);
app.use('/api/role', roleRoute);
app.use('/api/room', roomRoute);
app.use('/api/schedule', scheduleRoute);
app.use('/api/section', sectionRoute);
app.use('/api/semester', semesterRoute);
app.use('/api/student-hold', studentHoldRoute);
app.use('/api/student', studentRoute);
app.use('/api/user-role', userRoleRoute);
app.use('/api/user', userRoute);




// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => 
    {
    console.log(`🚀 Server running on port ${PORT}`)
    }
);