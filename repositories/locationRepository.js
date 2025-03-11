const Location = require("../models/locationModel.js");
const database = require("../config/db.js");

class locationRepository{

    static async createLocation(Location){
        try{
            let sql = `INSERT INTO location 
            (city, zipCode, address)
            VALUES (?,?,?)`;

            const [result] = await database.query(sql,[Location.city, Location.zipCode, Location.address]);
            const{affectedRows} = result;
            return{
                affectedRows;
            }
        }catch(e){
            throw new Error(e.sqlMessage);
        }
    }
}

module.exports = locationRepository;