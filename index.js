require('dotenv').config();
const express = require('express');
const cors = require('cors'); //to handle requests from different domains
const bodyParser = require('body-parser'); //for converting to json objects
const momnent =  require("moment");

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

app.use((req,res,next) =>{

    console.log(req.originalUrl);
    console.log(momnent());

    console.log(res.statusCode) ;

    next();
    })
// Use Routes
app.use('/api/sis/admin', adminRoute);
app.use('/api/sis/advisor', advisorRoute);
app.use('/api/sis/building', buildingRoute);
app.use('/api/sis/campus', campusRoute);
app.use('/api/sis/course-program', courseProgramRoute);
app.use('/api/sis/course', courseRoute);
app.use('/api/sis/department', departmentRoute);
app.use('/api/sis/enrollment', enrollmentRoute);
app.use('/api/sis/faculty', facultyRoute);
app.use('/api/sis/final-exam', finalExamRoute);
app.use('/api/sis/final-exam-schedule', finalExamScheduleRoute);
app.use('/api/sis/hold', holdRoute);
app.use('/api/sis/instructor', instructorRoute);
app.use('/api/sis/location', locationRoute);
app.use('/api/sis/major', majorRoute);
app.use('/api/sis/minor', minorRoute);
app.use('/api/sis/phone-number', phoneNumberRoute);
app.use('/api/sis/prerequisite', prerequisiteRoute);
app.use('/api/sis/program', programRoute);
app.use('/api/sis/role', roleRoute);
app.use('/api/sis/room', roomRoute);
app.use('/api/sis/schedule', scheduleRoute);
app.use('/api/sis/section', sectionRoute);
app.use('/api/sis/semester', semesterRoute);
app.use('/api/sis/student-hold', studentHoldRoute);
app.use('/api/sis/student', studentRoute);
app.use('/api/sis/user-role', userRoleRoute);
app.use('/api/sis/user', userRoute);




// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => 
    {
    console.log(`🚀 Server running on port ${PORT}`)
    }
);