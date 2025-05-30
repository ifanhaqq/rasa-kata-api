const bcrypt = require('bcrypt');
const db = require('../db');
const generateRandomUsername = require('../utils/generateRandomUsername');

class User {
    static async findByEmail(email) {
        const res = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        return res.rows[0];
    }

    static async createUser(userData) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const res = await db.query(
            'INSERT INTO users (name, email, password, anonymous_username) VALUES ($1, $2, $3, $4) RETURNING *',
            [userData.name, userData.email, hashedPassword, generateRandomUsername()]
        );
        return res.rows[0];
    }

    static async comparePassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }

    static async updateUser(id, userData) {
        const res = await db.query(
            'UPDATE users SET name = $1, email = $2, anonymous_username = $3 WHERE id = $4 RETURNING *',
            [userData.name, userData.email, userData.anonymous_username, id]
        );
        return res.rows[0];
    }
}

module.exports = User;