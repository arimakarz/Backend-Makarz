import { Router } from 'express'
import { login, loginForm, loginFail, logout, registerForm, registerUser, registerFail, resetPasswordSendMailForm, resetPasswordSendMail, resetForm, resetPassword } from '../controllers/sessions.controller.js'
import passport from "passport";
import { JWT_COOKIE_NAME } from '../config/credentials.js'
//import cartsManager from '../dao/CartsManager.js';
import { authToken } from "../utils.js";

const router = Router()
//const cartsManager = new CartsManager();

router.get('/register', registerForm)

//Create a user
router.post('/register', passport.authenticate('register', {failureRedirect: '/sessions/failRegister'}), registerUser)

router.get('/failRegister', registerFail)

router.get('/login', loginForm)

router.post('/login', passport.authenticate('login', { failureRedirect: '/sessions/failLogin' }), login)

router.get('/failLogin', loginFail)

router.get('/github', passport.authenticate('github', {scope: ['user: email']}), (req, res) => {
    res.redirect('/api/products')
})

router.get('/githubcallback', passport.authenticate('github', {failureRedirect: 'sessions/login'}), async(req, res)=>{
    //console.log('Callback: ', req.user)
    req.session.user = req.user
    //console.log('User session: ', req.session.user)
    res.redirect('/api/products')
})

//Close session
// router.get('/logout', (req, res) => {
//     res.clearCookie(JWT_COOKIE_NAME).redirect('login')
//     // ----- -Comentado porque ya no uso sessions
//     // if (req.session?.user){
//     //     req.session.destroy(err => {
//     //         if (err){
//     //             res.status(500).render(('errors/base'), {
//     //                 error: err
//     //             })
//     //         }else{
//     //             res.redirect('/sessions/login')
//     //         }
//     //     })
//     // }else{
//     //     //res.send('You are not logged in!')
//     //     res.redirect('/sessions/login')
//     // }
// })
router.get('/logout', logout)

router.get('/current', (req, res) => {
    try{
        res.cookie(JWT_COOKIE_NAME, req.user.token).send(req.user)
    }catch (error){
        res.send({ status: 'error', error: 'Not logged in'})
    }
})

router.get('/resetPassword', resetPasswordSendMailForm)

router.post('/resetPassword', resetPasswordSendMail)

router.get('/reset/:userID/:token', resetForm)

router.post('/reset/:userID/:token', resetPassword)

export default router