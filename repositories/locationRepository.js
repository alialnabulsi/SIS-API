const Location = require("../models/locationModel");
const database = require("../config/db");
require('dotenv').config();

class LocationRepository{

    static async createLocation(Location){
        try{
            let sql = `INSERT INTO location 
            (city, zipCode, address)
            VALUES (?,?,?)`;
            const result = await database.query(sql,[Location.city, Location.zipCode, Location.address]);
            const{affectedRows} = result;
            return{
                affectedRows
            };
        }catch(e){
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in createLocation:", e); // Logs full error for debugging
            }
            throw new Error(e.sqlMessage || "An error occurred while creating location.");
        }
    }

    static async getLocation(city){
        try{
            if (! await this.locationExists(city)){
                return {message: "Location does not exist"};
            }
            let sql = `SELECT * FROM location WHERE city = ?`;

            const [row] = await database.query(sql,city);
            
            if (!row || row.length === 0) {
                return { message: "Location not found" };
            }
            return Location.fromRow(row);
        }catch(e){
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in getLocation:", e);
            }
            throw new Error(e.sqlMessage || "An error occurred while fetching location.");
        }
    }

    static async updateLocation(city, updates) {
        try{
            if (!await this.locationExists(city)) {
                return { message: "Location does not exist" };
            }
    
            if (!updates || Object.keys(updates).length === 0) {
                return { message: "No updates provided" };
            }
    
            let sql = "UPDATE location SET ";
            let conditions = [];
            let values = [];
    
            for (const key in updates) {
                conditions.push(`${key} = ?`);
                values.push(updates[key]);
            }
    
            sql += conditions.join(", ");
            sql += " WHERE city = ?";
            values.push(city);
    
            const result = await database.query(sql, values);
            const { affectedRows } = result;
    
            return { affectedRows };
        }catch(e){
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in updateLocation:", e); 
            }
            throw new Error(e.sqlMessage || "An error occurred while updating location.");
        }
        
    }

    //for class use
    static async locationExists(city){
        try{
            let sql = `SELECT * FROM location WHERE city=?`;
            const rows = await database.query(sql,city);
            //check the rows
            if(rows && rows.length){
                return true;
            }

            return false;
        }catch(e){
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in locationExists:", e);
            }
            throw new Error(e.sqlMessage || "An error occurred while checking the location.");
        }
    }


}

module.exports = LocationRepository;