class Admin {
    constructor(adminID, userID) {
        this.adminID = adminID;
        this.userID = userID;
    }

    static fromRow(row) {
        return new Admin(
            row.adminID,
            row.userID
        );
    }
}

module.exports = Admin;