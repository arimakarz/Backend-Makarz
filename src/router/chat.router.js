import express from 'express'
import passport from 'passport'
import { authToken, passportCall } from '../utils.js'
import EError from '../services/errors/enums.js'
import CustomError from '../services/errors/custom_error.js'

const router = express.Router()

router.get('/chat', passportCall('current'), (req, res) => {
    if (req.user.user.role != 'admin') res.render('chat')
    else {
        const error = CustomError.createError({
            name: 'Not authorized for using the chat',
            cause: 'Unauthorized access',
            message: 'User not authorized for using chat tool',
            code: EError.UNAUTHORIZATION_ERROR,
            backRoute: '/api/products'
        })
        error.statusCode = 401
        
        res.render('errors/base', { error })
    }
})

router.get('/chat2', authToken, (req, res) => {
    res.render('chat')
})

export default router