import express from 'express'
import passport from 'passport'
import { passportCall } from '../utils.js'
import EError from '../services/errors/enums.js'
import CustomError from '../services/errors/custom_error.js'

const router = express.Router()

router.get('/chat', passportCall('current'), (req, res) => {
    if (req.user.user.role == 'user') res.render('chat', {})
    else {
        const error = CustomError.createError({
            name: 'Not authorized for using the chat',
            cause: 'Unauthorized access',
            message: 'User not authorized for using chat tool',
            code: EError.UNAUTHORIZATION_ERROR,
            backRoute: '/api/products'
        })
        console.log(error)
        error.statusCode = 401
        
        res.render('errors/base', { error })
    }
})

export default router