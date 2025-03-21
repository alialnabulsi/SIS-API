const Location = require("../models/locationModel");
const database = require("../config/db");
require('dotenv').config();
/*
In the table Location in the database the city attribute is considered as unique key so each city has a unique
*/
class LocationRepository{
    
    static async createLocation(Location){
        
        if ( await this.locationExists(Location.city)){
            const error = new Error("Location already exists");
            error.statusCode = 400; 
            throw error;
        }
        
        try{
            let sql = `INSERT INTO location 
            (city, zipCode, address)
            VALUES (?,?,?)`;
            const result = await database.query(sql,[Location.city, Location.zipCode, Location.address]);
            const{affectedRows,insertId} = result;
            return{
                affectedRows,
                insertId: insertId.toString() //since it is BigInt so it cant be serialized
            };
        }catch(e){
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in createLocation:", e); 
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async getLocation(city){
        if ( ! await this.locationExists(city)){
            const error = new Error("Location does not exists");
            error.statusCode = 404; 
            throw error;
        }
        try{
            
            let sql = `SELECT * FROM location WHERE city = ?`;

            const [row] = await database.query(sql,[city]);
            //no need to check row since it is checked in the locationExists

            return Location.fromRow(row);
        }catch(e){
            if (process.env.NODE_ENV === 'development') {
                console.error("Database Error in getLocation:", e);
            }
            throw new Error(e.sqlMessage);
        }
    }

    static async updateLocation(city, updates) {
        if ( ! await this.locationExists(city)){
            const error = new Error("Location does not exists");
            error.statusCode = 404; 
            throw error;
        }
        try{
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
            throw new Error(e.sqlMessage);
        }
        
    }

    //for class use(non memeber)
    static async locationExists(city){
        try{
            let sql = `SELECT * FROM location WHERE city=?`;
            const rows = await database.query(sql,[city]);
            //check the rows
            if(rows && rows.length > 0){
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