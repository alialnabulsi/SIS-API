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
                affectedRows
            };
        }catch(e){
            throw new Error(e.sqlMessage);
        }
    }

    static async getLocation(city){
        try{
            if (! await this.locationExists(city)){
                return {message: "Location does not exist"};
            }
            let sql = `SELECT * FROM location WHERE city = ?`;

            const[rows] = await database.query(sql,city);

            return Location.fromRow(rows[0]);
        }catch(e){
            throw new Error(e.sqlMessage);
        }
    }

    static async locationExists(city){
        let sql = `SELECT * FROM location WHERE city=?`;
        const [rows] = await db.query(sql,city);
        //check the rows
        if(rows && rows.lenght){
            return true;
        }

        return false;

    }

    static async updateLocation(city, updates) {
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

        const [result] = await database.query(sql, values);
        const { affectedRows } = result;

        return { affectedRows };
    }


}

module.exports = locationRepository;