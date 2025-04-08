class User {
    constructor(userID, username, password, firstName, lastName
        , dateOfBirth, email, profilePicture, createdAt, updatedAt,
         lastLogin, city, zipCode, street,isLocked = false, loginAttempts = 0) {
        this.userID = userID;
        this.username = username;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.dateOfBirth = dateOfBirth;
        this.email = email;
        this.profilePicture = profilePicture;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.lastLogin = lastLogin;
        this.city = city;
        this.zipCode = zipCode;
        this.street = street;
        this.isLocked = isLocked;
        this.loginAttempts = loginAttempts;
    }

    static fromRow(row) {
        return new User(
            row.userID,
            row.username,
            row.password,
            row.firstName,
            row.lastName,
            row.dateOfBirth,
            row.email,
            row.profilePicture,
            row.createdAt,
            row.updatedAt,
            row.lastLogin,
            row.city,
            row.zipCode,
            row.street
        );
    }
    async validatePassword(password) {
        return bcrypt.compare(password, this.password);
    }

    async hashPassword() {
        this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
    }
}

module.exports = User;