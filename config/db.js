const database= require("mariadb");
require('dotenv').config();

//insiated a pool connection
const pool = database.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    connectionLimit: 100
});

module.exports = pool; // export the pool to avoid repetition of intiating a connection