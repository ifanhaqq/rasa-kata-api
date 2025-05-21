const Joi = require('joi');
const User = require('../models/User');

module.exports = [
    {
        method: 'POST',
        path: '/api/auth/register',
        handler: async (request, h) => {
            try {
                const user = await User.createUser(request.payload);
                if (!user) {
                    return h.response({ error: 'User creation failed' }).code(400);
                }

                const { password, ...userWithoutPassword } = user;

                const token = request.server.methods.generateToken(userWithoutPassword);

                return h.response({
                    status: 'success',
                    data: {
                        user: userWithoutPassword,
                        token: token,
                    },
                }).code(201);
            } catch (error) {
                return h.response({ error: error.message }).code(400);
            }
        },
        options: {
            auth: false,
            validate: {
                payload: Joi.object({
                    name: Joi.string().required(),
                    email: Joi.string().email().required(),
                    password: Joi.string().min(6).required(),
                }),
            },
        }
    },
    {
        method: 'POST',
        path: '/api/auth/login',
        handler: async (request, h) => {
            try {
                const { email, password } = request.payload;
                const { isValid, user } = await request.server.methods.authenticateUser(email, password);

                if (!isValid) {
                    return h.response({ error: 'Invalid email or password' }).code(401);
                }

                const token = request.server.methods.generateToken(user);
                return h.response({
                    status: 'success',
                    data: {
                        user: user,
                        token: token,
                    },
                }).code(200);
            } catch (error) {
                return h.response({ error: error.message }).code(400);
            }
        },
        options: {
            auth: false,
            validate: {
                payload: Joi.object({
                    email: Joi.string().email().required(),
                    password: Joi.string().min(6).required(),
                }),
            },
        }
    }
]