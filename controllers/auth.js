const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const User = require('../models/User');
const errorHandler = require('../utils/errorHandler');

module.exports.login = async (request, response) => {
    const candidate = await User.findOne({
        email: request.body.email
    });

    if (candidate) {
        const passwordResult = bcrypt.compareSync(request.body.password, candidate.password)
        if (passwordResult) {
            const token = jwt.sign({
                email: candidate.email,
                userId: candidate._id
            }, keys.jwt, {
                expiresIn: 60 * 60
            });
            response.status(200).json({
                token: `Bearer ${token}`
            })
        } else {
            response.status(401).json({
                message: 'Password is incorrect.'
            })
        }
    } else {
        response.status(404).json({
            message: 'User is not found.'
        })
    }
};

module.exports.register = async (request, response) => {
    const candidate = await User.findOne({
        email: request.body.email
    });

    if (candidate) {
        response.status(409).json({
            message: 'User with those email is already exist. Please try another email.'
        })
    } else {
        const salt = bcrypt.genSaltSync(10);
        const password = request.body.password;
        const user = new User({
            email: request.body.email,
            password: bcrypt.hashSync(password, salt)
        });

        try{
            await user.save();
            response.status(201).json({
                message: 'User is created.'
            })
        } catch (e) {
            errorHandler(response, e)
        }
    }
};
