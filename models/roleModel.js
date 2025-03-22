class Role {
    constructor(roleID, roleName, roleDescription) {
        this.roleID = roleID;
        this.roleName = roleName;
        this.roleDescription = roleDescription;
    }

    static fromRow(row) {
        return new Role(
            row.roleID,
            row.roleName,
            row.roleDescription
        );
    }
}

module.exports = Role;