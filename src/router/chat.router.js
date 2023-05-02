import express from 'express'
import passport from 'passport'
import { passportCall } from '../utils.js'

const router = express.Router()

router.get('/chat', passportCall('current'), (req, res) => {
    console.log(req.user.user.role)
    if (req.user.user.role == 'user') res.render('chat', {})
    else res.render('errors/base', { error: 'Not authorized user for chat.'})
})

export default router