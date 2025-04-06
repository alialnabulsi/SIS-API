const HoldRepository = require("../repositories/holdRepository");
const Hold = require("../models/holdModel");

class HoldService {
    static async createHold(hold) {
        try {
            return HoldRepository.createHold(hold);
        } catch (e) {
            throw new Error(e.message);
        }
    }

    static async getHoldByID(holdID) {
        try {
            return HoldRepository.getHoldByID(holdID);
        } catch (e) {
            throw new Error(e.message);
        }
    }


    static async updateHold(holdID, updates) {
        try {
            return HoldRepository.updateHold(holdID, updates);
        } catch (e) {
            throw new Error(e.message);
        }
    }

    static async deleteHold(holdID) {
        try {
            return HoldRepository.deleteHold(holdID);
        } catch (e) {
            throw new Error(e.message);
        }
    }

}

module.exports = HoldService;