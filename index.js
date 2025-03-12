require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

//Import Routes
const locationRoute = require('./routes/locationRoute');


//Database Coneection
const {connectDB} = require('./config/db');

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/sis/location',locationRoute);


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => 
    {
    console.log(`🚀 Server running on port ${PORT}`)
    }
);