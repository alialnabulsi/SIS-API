const User = require("../models/userModel");
const UserService = require("../services/userService");
const UserRepository = require("../repositories/userRepository");
const UserRoleService = require("../services/userRoleService");



class UserController {
    static async createUser(req, res) {
        try {
            const { username, password, firstName, lastName, dateOfBirth, email, profilePicture, createdAt, updatedAt, lastLogin, city, zipCode, street } = req.body;
            const user = new User(0, username, password, firstName, lastName, dateOfBirth, email, profilePicture, createdAt, updatedAt, lastLogin, city, zipCode, street);
            const result = await UserService.createUser(user);
            res.status(201).json(result);
        } catch (e) {
            if (e.statusCode === 409) {
                res.status(e.statusCode).json({ message: 'User already exists', error: e.message });
            } else
                if (e.statusCode === 404) {
                    res.status(e.statusCode).json({ message: 'User does not exist', error: e.message });
                } else {
                    res.status(500).json({ message: 'Internal server error', error: e.message });
                }
        }
    }

    static async getUser(req, res) {
        try {
            const { username } = req.params;
            const result = await UserService.getUser(username);
            res.status(200).json(result);
        } catch (e) {
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'User not found', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async getUserByID(req, res) {
        try {
            const { userID } = req.params;
            const result = await UserService.getUserByID(userID);
            res.status(200).json(result);
        } catch (e) {
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'User not found', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async getAllUsers(req, res) {
        try {
            const result = await UserService.getAllUsers();
            res.status(200).json(result);
        } catch (e) {
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'No users found', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async updateUser(req, res) {
        try {
            const { userID } = req.params;
            const updates = req.body;
            const result = await UserService.updateUser(userID, updates);
            res.status(204).json(result);
        } catch (e) {
            if (e.statusCode === 400) {
                res.status(e.statusCode).json({ message: 'No updates provided', error: e.message });
            } else if (e.statusCode === 409) {
                const message = e.usernameExists
                    ? 'Username already exists '
                    : 'The new User ID already exists'; 
                res.status(e.statusCode).json({ message, error: e.message });
            } else
                if (e.statusCode === 404) {
                    res.status(e.statusCode).json({ message: 'User not found', error: e.message });
                } else {
                    res.status(500).json({ message: 'Internal server error', error: e.message });
                }
        }
    }

    static async deleteUser(req, res) {
        try {
            const { username } = req.params;
            const result = await UserService.deleteUser(username);
            res.status(200).json(result);
        } catch (e) {
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'User not found', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async deleteAllUsers(req, res) {
        try {
            const result = await UserService.deleteAllUsers();
            res.status(200).json(result);
        } catch (e) {
            if (e.statusCode === 404) {
                res.status(e.statusCode).json({ message: 'No users found to delete', error: e.message });
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async loginUser(req, res) {
        try {
            const { email, password } = req.body;
            const user = await UserService.validateCredentials(email, password);

            if (user.isLocked) {
                return res.status(403).json({ message: 'Account is locked' });
            }
            const userRole = await UserRoleService.getUserRolesByUserID(user.userID);

            await UserService.loginUser(user.userID);
            if(userRole[0].roleID == 1){
                res.render('C:\\Users\\user\\Documents\\VS Code Projects\\CSIS-228-Project\\SIS-Project\\views\\pages\\adminDashboard.ejs');
            }else if(userRole[0].roleID == 2){
                res.render('C:\\Users\\user\\Documents\\VS Code Projects\\CSIS-228-Project\\SIS-Project\\views\\pages\\advisorDashboard.ejs');
            }else if(userRole[0].roleID == 3){
                res.render('C:\\Users\\user\\Documents\\VS Code Projects\\CSIS-228-Project\\SIS-Project\\views\\pages\\instructorDashboard.ejs');
            }else if(userRole[0].roleID == 4){
                res.render('C:\\Users\\user\\Documents\\VS Code Projects\\CSIS-228-Project\\SIS-Project\\views\\pages\\studentDashboard.ejs');
            }
        } catch (e) {
            if (e.statusCode === 401) {
                try {
                    const user = await UserRepository.getUserByEmail(e.email);
                    if (user) {
                        await UserRepository.incrementLoginAttempts(user.userID);
                        if (user.loginAttempts + 1 >= 5) {

                            await UserService.lockAccount(user.userID);
                            return res.status(403).json({ message: 'Account locked due to too many failed attempts' });
                        }
                    }
                } catch (err) {

                }
                res.redirect("C:\\Users\\user\\Documents\\VS Code Projects\\CSIS-228-Project\\SIS-Project\\views\\pages\\index.ejs");
            } else {
                res.status(500).json({ message: 'Internal server error', error: e.message });
            }
        }
    }

    static async resetPassword(req, res) {
        try {
            const { userID } = req.params;
            const { currentPassword, newPassword } = req.body;

            const user = await UserService.getUserByID(userID);
            const isValid = await user.validatePassword(currentPassword);

            if (!isValid) {
                return res.status(401).json({ message: 'Current password is incorrect' });
            }

            await UserService.updatePassword(userID, newPassword);
            res.status(200).json({ message: 'Password updated successfully' });
        } catch (e) {
            res.status(500).json({ message: 'Internal server error', error: e.message });
        }
    }

    static async lockAccount(req, res) {
        try {
            const { userID } = req.params;
            const result = await UserService.lockAccount(userID);
            res.status(200).json({ message: 'Account locked', ...result });
        } catch (e) {
            res.status(500).json({ message: 'Internal server error', error: e.message });
        }
    }

    static async unlockAccount(req, res) {
        try {
            const { userID } = req.params;
            const result = await UserService.unlockAccount(userID);
            res.status(200).json({ message: 'Account unlocked', ...result });
        } catch (e) {
            res.status(500).json({ message: 'Internal server error', error: e.message });
        }
    }


    static async searchUsers(req, res) {
        try {

            const { term } = req.query;
            const users = await UserService.searchUsers(term);
            res.status(200).json(users);
        } catch (e) {
            res.status(500).json({ message: 'Internal server error', error: e.message });
        }
    }
}

module.exports = UserController;