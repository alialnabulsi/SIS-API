const Hold = require("../models/holdModel");
const HoldService = require("../services/holdService");

class HoldController {
    static async createHold(req, res) {
        try {
            const {reason } = req.body;
            const hold = new Hold(0, reason);
            const result = await HoldService.createHold(hold);
            res.status(201).json(result);
        } catch (e) {
            if (e.statusCode === 409) {
                res.status(e.statusCode).json({ message: 'Hold already exists', error: e.message });
            }  else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async getHoldByID(req, res) {
        try {
            const { holdID } = req.params;
            const result = await HoldService.getHoldByID(holdID);
            res.status(200).json(result);
        } catch (e) {
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'Hold not found', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }


    static async updateHold(req, res) {
        try {
            const { holdID } = req.params;
            const updates = req.body;
            const result = await HoldService.updateHold(holdID, updates);
            res.status(204).json(result);
        } catch (e) {
            if (e.statusCode === 400) {
                res.status(e.statusCode).json({ message: 'No updates provided', error: e.message });
            } else if (e.statusCode === 409) {
                res.status(e.statusCode).json({ message: 'The new Hold ID already exists', error: e.message });
            } else
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'Hold not found', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async deleteHold(req, res) {
        try {
            const { holdID } = req.params;
            const result = await HoldService.deleteHold(holdID);
            res.status(200).json(result);
        } catch (e) {
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'Hold not found', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

}

module.exports = HoldController;