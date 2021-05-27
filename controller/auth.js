const { validationResult } = require('express-validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('../models/user')

exports.signUp = (req, res, next) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()) {
        const error = new Error('Failed validation')
        error.statusCode = 422
        error.data = errors.array()
        throw error
    }

    const email = req.body.email
    const name = req.body.name
    const password = req.body.password

    bcrypt.hash(password, 12).then(hashedPw => {
        const user = new User({
            email: email,
            name: name,
            password: hashedPw
        })

        user.save().then(user => {
            res.status(201).json({
                message: 'User was created',
                userId: user._id
            })
        }).catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500
            }
            next(err)
        })
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500
        }
        next(err)
    })
}

exports.login = (req, res, next) => {
    const email = req.body.email
    const password = req.body.password
    let loadedUser

    User.findOne({email: email}).then(user => {
        loadedUser = user
        if (!user) {
            const error = new Error('User not found')
            error.statusCode = 401
            throw error
        }

        return bcrypt.compare(password, user.password)
    }).then(isEqual => {
        if (!isEqual) {
            const error = new Error('Password does not match')
            error.statusCode = 401
            throw error
        }

        const token = jwt.sign({
            email: loadedUser.email,
            userId: loadedUser._id.toString()
        }, "Sherif'sSecretKey", {
            expiresIn: '1h'
        })

        res.status(200).json({
            token: token,
            userId: loadedUser._id.toString()
        })
    }).catch(err => {
        if (!err.statusCode) {
           err.statusCode = 500
        }
        next(err)
    })
}
