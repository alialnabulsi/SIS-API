const PhoneNumberRepository = require("../repositories/phoneNumberRepository");
const PhoneNumber = require("../models/phoneNumberModel");
const UserService = require("./userService");

class PhoneNumberService {
    static async createPhoneNumber(phoneNumber) {
        try {
            // Check if the user exists
            const userExists = await UserService.getUserByID(phoneNumber.userID);
            if (!userExists) {
                const error = new Error("User does not exist");
                error.statusCode = 404;
                throw error;
            }

            return PhoneNumberRepository.createPhoneNumber(phoneNumber);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in createPhoneNumber service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async getPhoneNumber(phoneNumber) {
        try {
            return PhoneNumberRepository.getPhoneNumber(phoneNumber);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in getPhoneNumber service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async getPhoneNumberByID(phoneNumberID) {
        try {
            return PhoneNumberRepository.getPhoneNumberByID(phoneNumberID);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in getPhoneNumberByID service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async getAllPhoneNumbers() {
        try {
            return PhoneNumberRepository.getAllPhoneNumbers();
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in getAllPhoneNumbers service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async updatePhoneNumber(phoneNumberID, updates) {
        try {
            return PhoneNumberRepository.updatePhoneNumber(phoneNumberID, updates);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in updatePhoneNumber service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async deletePhoneNumber(phoneNumber) {
        try {
            return PhoneNumberRepository.deletePhoneNumber(phoneNumber);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in deletePhoneNumber service:", e);
            }
            throw new Error(e.message);
        }
    }

    static async deleteAllPhoneNumbers() {
        try {
            return PhoneNumberRepository.deleteAllPhoneNumbers();
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in deleteAllPhoneNumbers service:", e);
            }
            throw new Error(e.message);
        }
    }
}

module.exports = PhoneNumberService;