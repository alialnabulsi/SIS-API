const database= require("mariadb");
require('dotenv').config();

const pool = database.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    connectionLimit: 100
});

const connectDB = async () => {
    try{
        const conn = await pool.getConnection();
        console.log("✅ Database connected successfully");
        conn.release(); //Back the connection for pool
    }catch(err){
        console.error("❌ Database connection failed:", err.message);
        process.exit(1);
    }
};
    module.exports = {pool, connectDB};