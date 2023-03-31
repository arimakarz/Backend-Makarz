import { Router } from 'express'
import UserModel from '../models/user.model.js'
import CartsManager from '../dao/CartsManager.js';
import { createHash, isValidPassword } from "../utils.js";
import passport from "passport";

const router = Router()
const cartsManager = new CartsManager();

router.get('/register', (req, res) => {
    res.render('sessions/register')
})

//Create a user
router.post('/register', passport.authenticate('register', {failureRedirect: '/sessions/failRegister'}), async (req, res) => {
    // const newUser = req.body
    // const user = new UserModel(newUser)

    // await user.save()

    res.redirect('/sessions/login')
})

router.get('/failRegister', (req, res) => {
    res.send({ error: 'Oops something wrong happened. Fail register' })
})

router.get('/login', async (req, res) => {
    if (req.session.user){
        const user = await UserModel.findOne({ email: req.session.user.email }).lean().exec()
        res.redirect('/api/products')
    }else{
        res.render('sessions/login')
    }
})

router.post('/login', passport.authenticate('login', { failureRedirect: '/sessions/failLogin' }), async (req, res) => {
    // const { email, password } = req.body

    // const user = await UserModel.findOne({ email, password }).lean().exec()
    
    if (!req.user){
        return res.status(401).render(('errors/base'), {
            error: "Wrong email or password"
        })
    }
    let role = 'user'
    if (req.user.email == 'admincoder@coder.com'){
        role = 'admin'
    }

    // const result = cartsManager.createCart()
    // const newCart = cartsManager.getNewCart()
    
    req.session.user = {
        email: req.user.email,
        role
    }

    res.redirect('/api/products')
})

router.get('/failLogin', (req, res) => {
    res.render('errors/base',{ error: 'Missing information. Fail login '})
})

router.get('/github', passport.authenticate('github', {scope: ['user: email']}), (req, res) => {
    res.redirect('/api/products')
})

router.get('/githubcallback', passport.authenticate('github', {failureRedirect: '/login'}), async(req, res)=>{
    //console.log('Callback: ', req.user)
    req.session.user = req.user
    //console.log('User session: ', req.session.user)
    res.redirect('/api/products')
})

//Close session

router.get('/logout', (req, res) => {
    if (req.session?.user){
        req.session.destroy(err => {
            if (err){
                res.status(500).render(('errors/base'), {
                    error: err
                })
            }else{
                res.redirect('/sessions/login')
            }
        })
    }else{
        //res.send('You are not logged in!')
        res.redirect('/sessions/login')
    }
})

export default router