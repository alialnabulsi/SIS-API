require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

//Import Routes
const locationRoute = require('./routes/locationRoute');
const campusRoute = require('./routes/campusRoute');
const buildingRoute = require('./routes/buildingRoute');




const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/sis/location',locationRoute);
app.use('/sis/campus',campusRoute);
app.use('/sis/building',buildingRoute);




// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => 
    {
    console.log(`🚀 Server running on port ${PORT}`)
    }
);