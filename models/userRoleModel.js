class UserRole {
    constructor(userID, roleID) {
        this.userID = userID;
        this.roleID = roleID;
    }

    static fromRow(row) {
        return new UserRole(
            row.userID,
            row.roleID
        );
    }
}

module.exports = UserRole;