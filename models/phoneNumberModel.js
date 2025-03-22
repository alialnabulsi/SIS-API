class PhoneNumber {
    constructor(phoneNumberID, userID, phoneNumber) {
        this.phoneNumberID = phoneNumberID;
        this.userID = userID;
        this.phoneNumber = phoneNumber;
    }

    static fromRow(row) {
        return new PhoneNumber(
            row.phoneNumberID,
            row.userID,
            row.phoneNumber
        );
    }
}

module.exports = PhoneNumber;